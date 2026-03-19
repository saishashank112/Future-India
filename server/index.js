const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Create uploads folder if not exists
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Authentication
app.post('/api/auth/signup', (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const info = db.prepare("INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'user')").run(name, email, phone, password);
    const user = { id: info.lastInsertRowid, name, email, phone, role: 'user' };
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: "Email or Phone already exists." });
  }
});

app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = db.prepare("SELECT * FROM users WHERE (email = ? OR phone = ? OR name = ?) AND password = ?").get(identifier, identifier, identifier, password);
    if (user) {
      delete user.password;
      res.json({ user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ? AND role = 'admin'").get(email, password);
    if (user) {
      delete user.password;
      res.json({ user });
    } else {
      res.status(401).json({ error: "Access Denied: Administrative Clearance Required" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// User Profile
app.put('/api/user/profile/:id', (req, res) => {
  const { name, email, phone, company_name, country } = req.body;
  try {
    db.prepare("UPDATE users SET name=?, email=?, phone=?, company_name=?, country=? WHERE id=?")
      .run(name, email, phone, company_name, country, req.params.id);
    res.json({ message: "profile updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Admin Users (Customers) Actions
app.delete('/api/admin/users/:id', (req, res) => {
    try {
      db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.put('/api/admin/users/:id/block', (req, res) => {
    const { blocked } = req.body;
    try {
      db.prepare("UPDATE users SET country = ? WHERE id = ?").run(blocked ? 'BLOCKED' : 'ACTIVE', req.params.id); // Simple mock block logic via country field for now
      res.json({ message: "User status updated" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.get('/api/admin/users', (req, res) => {
    try {
      const rows = db.prepare(`
        SELECT u.*, 
        (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count,
        (SELECT SUM(total_amount) FROM orders WHERE user_id = u.id) as total_spent
        FROM users u 
        WHERE role = 'user'
      `).all();
      res.json({ data: rows });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
});

app.put('/api/admin/password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    db.prepare("UPDATE users SET password = ? WHERE role = 'admin'").run(newPassword);
    res.json({ message: "Password updated" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/products', (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM products").all();
    res.json({ data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/cart/:userId', (req, res) => {
  try {
    const rows = db.prepare("SELECT c.*, p.name, p.price, p.image FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?").all(req.params.userId);
    res.json({ data: rows });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/cart/add', (req, res) => {
  const { userId, productId, quantity } = req.body;
  try {
    const existing = db.prepare("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?").get(userId, productId);
    if (existing) {
      db.prepare("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?").run(quantity, existing.id);
    } else {
      db.prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)").run(userId, productId, quantity);
    }
    res.json({ message: "Added to cart" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/cart/:id', (req, res) => {
  db.prepare("DELETE FROM cart_items WHERE id = ?").run(req.params.id);
  res.json({ message: "deleted" });
});

app.post('/api/orders', (req, res) => {
  const { userId, totalAmount, shippingDetails, items } = req.body;
  const orderCode = `EXIM-${Date.now()}`;
  const createOrder = db.transaction((orderData) => {
    const info = db.prepare("INSERT INTO orders (user_id, order_code, total_amount, shipping_details, latitude, longitude, address) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(orderData.userId, orderData.orderCode, orderData.totalAmount, JSON.stringify(orderData.shippingDetails), orderData.latitude, orderData.longitude, orderData.address);
    const orderId = info.lastInsertRowid;
    const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    for (const item of orderData.items) {
      insertItem.run(orderId, item.product_id, item.quantity, item.price);
    }
    db.prepare("DELETE FROM cart_items WHERE user_id=?").run(orderData.userId);
    return orderId;
  });
  try {
    const id = createOrder({ 
      userId, orderCode, totalAmount, shippingDetails, items, 
      latitude: shippingDetails?.latitude || null, 
      longitude: shippingDetails?.longitude || null, 
      address: shippingDetails?.address || null 
    });
    res.json({ message: "Order placed successfully", orderCode, orderId: id });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/orders/:userId', (req, res) => {
  try {
    const orders = db.prepare("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC").all(req.params.userId);
    const enrichedOrders = orders.map(order => {
        const items = db.prepare(`SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`).all(order.id);
        return { ...order, items: JSON.stringify(items) };
    });
    res.json({ data: enrichedOrders });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/admin/reports', (req, res) => {
    try {
      const monthlyRevenue = db.prepare("SELECT strftime('%Y-%m', created_at) as month, SUM(total_amount) as revenue, COUNT(*) as count FROM orders WHERE payment_status = 'Approved' GROUP BY month ORDER BY month DESC LIMIT 12").all();
      const weeklyRevenue = db.prepare("SELECT strftime('%W', created_at) as week, SUM(total_amount) as revenue, COUNT(*) as count FROM orders GROUP BY week ORDER BY week DESC LIMIT 4").all();
      res.json({ data: { monthlyRevenue, weeklyRevenue, totalStats: { volume: "42.5 Tons", conversion: "3.2%" } } });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/admin/payments/:orderId', (req, res) => {
    try {
      const row = db.prepare("SELECT * FROM payments WHERE order_id = ?").get(req.params.orderId);
      res.json({ data: row });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/order-details/:orderId', (req, res) => {
    try {
      const rows = db.prepare("SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?").all(req.params.orderId);
      res.json({ data: rows });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/admin/dashboard', (req, res) => {
    try {
      const enquiryCount = db.prepare("SELECT COUNT(*) as count FROM inquiries").get().count;
      const orderCount = db.prepare("SELECT COUNT(*) as count FROM orders").get().count;
      const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
      const countryCount = db.prepare("SELECT COUNT(DISTINCT country) as count FROM inquiries").get().count;
      const totalRevenue = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'Approved'").get().total || 0;
      const recentEnquiries = db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5").all();
      res.json({ data: { stats: { totalEnquiries: enquiryCount, activeProducts: productCount, countriesReached: countryCount, annualRevenue: totalRevenue }, recentEnquiries } });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/settings', (req, res) => { res.json({ data: {} }); });

app.post('/api/payments/proof', upload.single('screenshot'), (req, res) => {
  const { orderId, transactionId, paymentName } = req.body;
  const screenshot_url = req.file ? `/uploads/${req.file.filename}` : null;
  const safeOrderId = orderId || req.body.orderId;
  try {
    const existing = db.prepare("SELECT * FROM payments WHERE order_id = ?").get(safeOrderId);
    if (existing) { db.prepare("UPDATE payments SET screenshot_url = ?, transaction_id = ?, payment_name = ? WHERE id = ?").run(screenshot_url, transactionId, paymentName, existing.id); }
    else { db.prepare("INSERT INTO payments (order_id, screenshot_url, transaction_id, payment_name) VALUES (?, ?, ?, ?)").run(safeOrderId, screenshot_url, transactionId, paymentName); }
    db.prepare("UPDATE orders SET payment_status = 'Pending Verification' WHERE id = ?").run(safeOrderId);
    res.json({ message: "Proof uploaded" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/admin/payments/:orderId/status', (req, res) => {
    const { status } = req.body;
    try {
      db.prepare("UPDATE payments SET status = ? WHERE order_id = ?").run(status, req.params.orderId);
      db.prepare("UPDATE orders SET payment_status = ? WHERE id = ?").run(status, req.params.orderId);
      res.json({ message: "Payment status updated" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/admin/orders/:id', (req, res) => {
    try {
      const order = db.prepare("SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?").get(req.params.id);
      if (order) {
          const items = db.prepare(`SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`).all(order.id);
          order.items = JSON.stringify(items);
      }
      res.json({ data: order });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/notifications/:userId', (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId);
    res.json({ data: rows });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/notifications/read/:id', (req, res) => {
  try {
    db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ?").run(req.params.id);
    res.json({ message: "success" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get(['/api/admin/inquiries', '/api/admin/enquiries'], (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all();
    res.json({ data: rows });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete(['/api/admin/inquiries/:id', '/api/admin/enquiries/:id'], (req, res) => {
  try {
    db.prepare("DELETE FROM inquiries WHERE id = ?").run(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put(['/api/admin/inquiries/:id/status', '/api/admin/enquiries/:id/status'], (req, res) => {
  const { status } = req.body;
  try {
    db.prepare("UPDATE inquiries SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ message: "success" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post(['/api/admin/inquiries/:id/reply', '/api/admin/enquiries/:id/reply'], (req, res) => {
  try {
    db.prepare("UPDATE inquiries SET status = 'Responded' WHERE id = ?").run(req.params.id);
    res.json({ message: "Reply sent successfully" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/admin/orders/:id/status', (req, res) => {
  const { status } = req.body;
  try {
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
    res.json({ message: "success" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/admin/orders', (req, res) => {
  try {
    const rows = db.prepare("SELECT o.*, u.name as customer_name, u.email as customer_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC").all();
    res.json({ data: rows });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/products', (req, res) => {
  const { name, category, priceRange, price, moq, grade, origin, moisture, image, description, certs } = req.body;
  try {
    const info = db.prepare("INSERT INTO products (name, category, priceRange, price, moq, grade, origin, moisture, image, description, certs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(name, category, priceRange, price, moq, grade, origin, moisture, image, description, certs);
    res.json({ id: info.lastInsertRowid });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/products/:id', (req, res) => {
  const { name, category, priceRange, price, moq, grade, origin, moisture, image, description, certs } = req.body;
  try {
    db.prepare("UPDATE products SET name=?, category=?, priceRange=?, price=?, moq=?, grade=?, origin=?, moisture=?, image=?, description=?, certs=? WHERE id=?").run(name, category, priceRange, price, moq, grade, origin, moisture, image, description, certs, req.params.id);
    res.json({ message: "success" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
