const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Serve static files
app.use('/uploads', express.static(uploadDir));

// Upload endpoint
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const url = `http://localhost:5001/uploads/${req.file.filename}`;
  res.json({ message: "success", url });
});

// Get all products
app.get('/api/products', (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM products").all();
    res.json({ data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Add a product
app.post('/api/products', (req, res) => {
  const { name, category, priceRange, price, moq, grade, origin, moisture, image, description, certs } = req.body;
  const parsedPrice = price || (priceRange ? parseInt(String(priceRange).match(/\d+/)?.[0] || '0') : 0);
  const sql = 'INSERT INTO products (name, category, priceRange, price, moq, grade, origin, moisture, image, description, certs) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
  const params = [name, category, priceRange, parsedPrice, moq, grade, origin, moisture, image, description, certs];
  try {
    const info = db.prepare(sql).run(params);
    res.json({ message: "success", id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a product
app.put('/api/products/:id', (req, res) => {
  const { name, category, priceRange, price, moq, grade, origin, moisture, image, description, certs } = req.body;
  const parsedPrice = price || (priceRange ? parseInt(String(priceRange).match(/\d+/)?.[0] || '0') : 0);
  const sql = `UPDATE products SET 
    name = COALESCE(?, name), 
    category = COALESCE(?, category), 
    priceRange = COALESCE(?, priceRange), 
    price = COALESCE(?, price),
    moq = COALESCE(?, moq), 
    grade = COALESCE(?, grade), 
    origin = COALESCE(?, origin), 
    moisture = COALESCE(?, moisture), 
    image = COALESCE(?, image), 
    description = COALESCE(?, description), 
    certs = COALESCE(?, certs) 
    WHERE id = ?`;
  const params = [name, category, priceRange, parsedPrice, moq, grade, origin, moisture, image, description, certs, req.params.id];
  try {
    const info = db.prepare(sql).run(params);
    res.json({ message: "success", changes: info.changes });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Auth Endpoints
app.post('/api/auth/signup', (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ error: "All fields are required (Name, Email, Phone, Password)" });
  }

  try {
    const info = db.prepare("INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)").run(name, email, phone, password);
    const user = db.prepare("SELECT id, name, email, phone FROM users WHERE id=?").get(info.lastInsertRowid);
    res.json({ message: "Registration successful", user: { ...user, role: 'user' } });
  } catch (err) {
    if (err.message.includes('email')) return res.status(400).json({ error: "Email already exists" });
    if (err.message.includes('phone')) return res.status(400).json({ error: "Phone number already exists" });
    return res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body; 
  console.log(`[AUTH] Login attempt for: ${identifier}`);
  
  if (!identifier || !password) {
    return res.status(400).json({ error: "Identifier and Password are required" });
  }

  try {
    const user = db.prepare("SELECT * FROM users WHERE (email=? OR phone=? OR name=?) AND password=?").get(identifier, identifier, identifier, password);
    if (!user) {
      console.warn(`[AUTH] Login failed for: ${identifier} - Invalid credentials`);
      return res.status(400).json({ error: "Invalid credentials" });
    }
    console.log(`[AUTH] Login success: ${user.email} (ID: ${user.id})`);
    res.json({ message: "Login successful", user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.email === 'admin@futureindia.com' ? 'admin' : 'user' } });
  } catch (err) {
    console.error(`[AUTH] Login error: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/otp/send', (req, res) => {
  const { identifier } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  try {
    const user = db.prepare("SELECT * FROM users WHERE email=? OR phone=?").get(identifier, identifier);
    if (!user) {
        return res.status(404).json({ error: "User not found. Please Sign Up first." });
    }

    db.prepare("UPDATE users SET otp=?, otp_expiry=? WHERE id=?").run(otp, expiry, user.id);
    console.log(`[EMAIL SEND] To: ${user.email}, Subject: Verification Code, Body: Your code is ${otp}`);
    res.json({ message: "Verification code sent successfully", identifier });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/otp/verify', (req, res) => {
  const { identifier, otp } = req.body;
  try {
    const user = db.prepare("SELECT * FROM users WHERE (email=? OR phone=?) AND otp=?").get(identifier, identifier, otp);
    if (!user) {
      return res.status(400).json({ error: "Invalid OTP" });
    }
    if (new Date(user.otp_expiry) < new Date()) {
      return res.status(400).json({ error: "OTP expired" });
    }
    db.prepare("UPDATE users SET otp=NULL, otp_expiry=NULL WHERE id=?").run(user.id);
    res.json({ message: "success", user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: 'user' } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/user/profile/:id', (req, res) => {
  const { name, company_name, country } = req.body;
  try {
    db.prepare("UPDATE users SET name=?, company_name=?, country=? WHERE id=?").run(name, company_name, country, req.params.id);
    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Cart Endpoints
app.get('/api/cart/:userId', (req, res) => {
  const sql = `SELECT c.*, p.name, p.price, p.priceRange, p.image, p.category 
               FROM cart_items c 
               JOIN products p ON c.product_id = p.id 
               WHERE c.user_id = ?`;
  try {
    const rows = db.prepare(sql).all(req.params.userId);
    res.json({ data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/cart/add', (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const item = db.prepare("SELECT * FROM cart_items WHERE user_id=? AND product_id=?").get(userId, productId);
    if (item) {
      db.prepare("UPDATE cart_items SET quantity = quantity + ? WHERE id=?").run(quantity || 1, item.id);
      res.json({ message: "Quantity updated" });
    } else {
      const info = db.prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)").run(userId, productId, quantity || 1);
      res.json({ message: "Added to cart", id: info.lastInsertRowid });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/cart/update/:id', (req, res) => {
    const { quantity } = req.body;
    try {
      db.prepare("UPDATE cart_items SET quantity = ? WHERE id = ?").run(quantity, req.params.id);
      res.json({ message: "Cart updated" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.delete('/api/cart/:id', (req, res) => {
  try {
    db.prepare("DELETE FROM cart_items WHERE id=?").run(req.params.id);
    res.json({ message: "Removed from cart" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Order Endpoints
app.get('/api/admin/orders', (req, res) => {
  const sql = `
    SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as phone
    FROM orders o 
    LEFT JOIN users u ON o.user_id = u.id 
    ORDER BY o.created_at DESC
  `;
  try {
    const rows = db.prepare(sql).all();
    // Attach items JSON for each order
    const itemsSql = `SELECT oi.*, p.name, p.category FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`;
    const enriched = rows.map(order => {
      try {
        const items = db.prepare(itemsSql).all(order.id);
        return { ...order, items: JSON.stringify(items) };
      } catch(e) {
        return { ...order, items: '[]' };
      }
    });
    res.json({ data: enriched });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/orders/:id', (req, res) => {
  try {
    const order = db.prepare(`
      SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as phone
      FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE o.id = ?
    `).get(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const items = db.prepare(`SELECT oi.*, p.name, p.category FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`).all(req.params.id);
    res.json({ data: { ...order, items: JSON.stringify(items) } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/orders/:id/status', (req, res) => {
  const { status } = req.body;
  try {
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ message: "Order status updated successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Enquiries Endpoint
app.get('/api/admin/inquiries', (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all();
    res.json({ data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Customers Endpoint
app.get('/api/admin/customers', (req, res) => {
  try {
    const sql = `
      SELECT u.id, u.name, u.email, u.phone, COUNT(o.id) as total_orders, SUM(o.total_amount) as total_spent
      FROM users u
      LEFT JOIN orders o ON u.id = o.user_id
      WHERE u.role != 'admin'
      GROUP BY u.id
      ORDER BY u.id DESC
    `;
    const rows = db.prepare(sql).all();
    res.json({ data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Inventory Endpoint
app.get('/api/admin/inventory', (req, res) => {
  try {
    const sql = `
      SELECT i.*, p.name as product_name, p.category 
      FROM inventory i 
      JOIN products p ON i.product_id = p.id
    `;
    const rows = db.prepare(sql).all();
    res.json({ data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/orders', (req, res) => {
  const { userId, totalAmount, shippingDetails, items } = req.body;
  const orderCode = `EXIM-${Date.now()}`;
  
  const createOrder = db.transaction((orderData) => {
    const info = db.prepare("INSERT INTO orders (user_id, order_code, total_amount, shipping_details) VALUES (?, ?, ?, ?)")
      .run(orderData.userId, orderData.orderCode, orderData.totalAmount, JSON.stringify(orderData.shippingDetails));
    
    const orderId = info.lastInsertRowid;
    const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    
    for (const item of orderData.items) {
      insertItem.run(orderId, item.product_id, item.quantity, item.price);
    }
    
    db.prepare("DELETE FROM cart_items WHERE user_id=?").run(orderData.userId);
    return orderData.orderCode;
  });

  try {
    const code = createOrder({ userId, orderCode, totalAmount, shippingDetails, items });
    res.json({ message: "Order placed successfully", orderCode: code });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/orders/:userId', (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC").all(req.params.userId);
    res.json({ data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/orders/:orderId/items', (req, res) => {
    const sql = `SELECT oi.*, p.name, p.image 
                 FROM order_items oi 
                 JOIN products p ON oi.product_id = p.id 
                 WHERE oi.order_id = ?`;
    try {
      const rows = db.prepare(sql).all(req.params.orderId);
      res.json({ data: rows });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  try {
    const info = db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ message: "deleted", changes: info.changes });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  try {
    const row = db.prepare("SELECT * FROM products WHERE id = ?").get(req.params.id);
    res.json({ data: row });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Submit Inquiry
app.post('/api/inquire', (req, res) => {
  const { name, email, country, food_item, type, message, phone, company_name } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: "Name and Email are required" });
  }
  const sql = 'INSERT INTO inquiries (name, email, country, food_item, type, message, phone, company_name, status) VALUES (?,?,?,?,?,?,?,?,?)';
  try {
    const info = db.prepare(sql).run(name, email, country, food_item, type, message, phone || null, company_name || null, 'New');
    res.json({ message: "success", id: info.lastInsertRowid });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Analytics Metrics (Real DB Data)
app.get('/api/admin/dashboard', (req, res) => {
  try {
    const totalEnquiriesStr = db.prepare("SELECT COUNT(*) as count FROM inquiries").get().count;
    const activeProductsStr = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
    // For countries reached, we use distinct countries from both inquiries and users
    let totalCountries = 0;
    try {
      totalCountries = db.prepare("SELECT COUNT(DISTINCT country) as count FROM inquiries WHERE country IS NOT NULL").get().count;
    } catch(e) {}
    
    // Revenue from completed/delivered orders
    let totalRevenue = 0;
    try {
      totalRevenue = db.prepare("SELECT SUM(total_amount) as total FROM orders").get().total || 0;
    } catch(e) {}

    // Recent Enquiries
    let recentEnquiries = [];
    try {
      recentEnquiries = db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5").all();
    } catch(e) {}

    res.json({
      data: {
        stats: {
          totalEnquiries: totalEnquiriesStr,
          activeProducts: activeProductsStr,
          countriesReached: totalCountries,
          annualRevenue: totalRevenue
        },
        recentEnquiries
      }
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/metrics', (req, res) => {
  res.json({
    data: {
      production: [
        { month: 'Jan', value: 450 },
        { month: 'Feb', value: 520 },
        { month: 'Mar', value: 480 },
        { month: 'Apr', value: 610 },
        { month: 'May', value: 590 },
        { month: 'Jun', value: 720 },
      ],
      revenue: 1254000,
      profit: 245000,
      growth: '+12.5%',
      enquiries: 48
    }
  });
});

app.get('/', (req, res) => {
  res.send('Future India Exim API - Status: Online');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

