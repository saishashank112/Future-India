const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db');
const fs = require('fs');

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
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Authentication
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const info = db.prepare("INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, 'user')").run(name, email, phone, hashedPassword);
    const user = { id: info.lastInsertRowid, name, email, phone, role: 'user' };
    res.json({ user });
  } catch (err) {
    res.status(400).json({ error: "Email or Phone already exists." });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = db.prepare("SELECT * FROM users WHERE (email = ? OR phone = ? OR name = ?)").get(identifier, identifier, identifier);
    if (user && await bcrypt.compare(password, user.password)) {
      delete user.password;
      res.json({ user });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = db.prepare("SELECT * FROM users WHERE email = ? AND role = 'admin'").get(email);
    if (user && await bcrypt.compare(password, user.password)) {
      delete user.password;
      res.json({ user });
    } else {
      res.status(401).json({ error: "Access Denied" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/admin/password', async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = db.prepare("SELECT * FROM users WHERE role = 'admin'").get();
    if (user && await bcrypt.compare(currentPassword, user.password)) {
        const hashed = await bcrypt.hash(newPassword, 10);
        db.prepare("UPDATE users SET password = ? WHERE role = 'admin'").run(hashed);
        res.json({ message: "Password updated successfully" });
    } else {
        res.status(400).json({ error: "Incorrect current password" });
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Settings & Global
app.get('/api/settings', (req, res) => {
  try {
    const rows = db.prepare("SELECT * FROM settings").all();
    const settingsObj = {};
    rows.forEach(r => settingsObj[r.key] = r.value);
    res.json({ data: settingsObj });
  } catch(e) { res.json({ data: {} }); }
});

app.post('/api/admin/settings', (req, res) => {
  const { settings } = req.body;
  try {
    const upsert = db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)");
    for (const key in settings) {
      upsert.run(key, settings[key]);
    }
    res.json({ message: "Settings saved" });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    // Return absolute URL for reliable rendering in local development
    res.json({ message: 'success', url: `http://localhost:5001/uploads/${req.file.filename}` });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
});

// Products
app.get('/api/products', (req, res) => {
  try { res.json({ data: db.prepare("SELECT * FROM products").all() }); } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/products', (req, res) => {
    const { name, category, priceRange, price, moq, grade, origin, image, description, certs } = req.body;
    try {
      const info = db.prepare("INSERT INTO products (name, category, priceRange, price, moq, grade, origin, image, description, certs) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").run(name, category, priceRange, price, moq, grade, origin, image, description, certs);
      res.json({ message: 'success', id: info.lastInsertRowid });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/products/:id', (req, res) => {
    const { name, category, priceRange, price, moq, grade, origin, image, description, certs } = req.body;
    try {
      db.prepare("UPDATE products SET name = ?, category = ?, priceRange = ?, price = ?, moq = ?, grade = ?, origin = ?, image = ?, description = ?, certs = ? WHERE id = ?").run(name, category, priceRange, price, moq, grade, origin, image, description, certs, req.params.id);
      res.json({ message: 'success' });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/products/:id', (req, res) => {
    try { db.prepare("DELETE FROM products WHERE id = ?").run(req.params.id); res.json({ message: 'deleted' }); } catch (err) { res.status(400).json({ error: err.message }); }
});

// Notifications
app.get('/api/notifications/:userId', (req, res) => {
    try { res.json({ data: db.prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC").all(req.params.userId) }); } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/notifications/read/:id', (req, res) => {
    try { db.prepare("UPDATE notifications SET is_read = 1 WHERE id = ?").run(req.params.id); res.json({ message: "success" }); } catch (err) { res.status(400).json({ error: err.message }); }
});

// Cart
app.get('/api/cart/:userId', (req, res) => {
    try { res.json({ data: db.prepare("SELECT c.*, p.name, p.price, p.image FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?").all(req.params.userId) }); } catch (err) { res.status(400).json({ error: err.message }); }
});

app.post('/api/cart/add', (req, res) => {
    const { userId, productId, quantity } = req.body;
    try {
      const existing = db.prepare("SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?").get(userId, productId);
      if (existing) { db.prepare("UPDATE cart_items SET quantity = quantity + ? WHERE id = ?").run(quantity, existing.id); } 
      else { db.prepare("INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)").run(userId, productId, quantity); }
      res.json({ message: "Added to cart" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/cart/:id', (req, res) => {
  try { db.prepare("DELETE FROM cart_items WHERE id = ?").run(req.params.id); res.json({ message: "deleted" }); } catch (err) { res.status(400).json({ error: err.message }); }
});

// Orders
app.post('/api/orders', (req, res) => {
  const { userId, totalAmount, shippingDetails, items } = req.body;
  const orderCode = `EXIM-${Date.now()}`;
  const createOrder = db.transaction((orderData) => {
    const info = db.prepare("INSERT INTO orders (user_id, order_code, total_amount, shipping_details, latitude, longitude, address) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .run(orderData.userId, orderData.orderCode, orderData.totalAmount, JSON.stringify(orderData.shippingDetails), orderData.latitude, orderData.longitude, orderData.address);
    const orderId = info.lastInsertRowid;
    const insertItem = db.prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    for (const item of orderData.items) { insertItem.run(orderId, item.product_id, item.quantity, item.price); }
    db.prepare("DELETE FROM cart_items WHERE user_id=?").run(orderData.userId);
    return { orderId, orderCode };
  });
  try {
    const result = createOrder({ userId, orderCode, totalAmount, shippingDetails, items, latitude: shippingDetails?.latitude || null, longitude: shippingDetails?.longitude || null, address: shippingDetails?.address || null });
    res.json({ message: "Order placed successfully", ...result });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/orders/:userId', (req, res) => {
    try {
      const orders = db.prepare("SELECT * FROM orders WHERE user_id=? ORDER BY created_at DESC").all(req.params.userId);
      const enriched = orders.map(o => {
        const items = db.prepare(`SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?`).all(o.id);
        return { ...o, items: JSON.stringify(items) };
      });
      res.json({ data: enriched });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/order-details/:orderId', (req, res) => {
    try { res.json({ data: db.prepare("SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?").all(req.params.orderId) }); } catch (err) { res.status(400).json({ error: err.message }); }
});

// Payments
app.post('/api/payments/proof', upload.single('screenshot'), (req, res) => {
    const { orderId, transactionId, paymentName } = req.body;
    const screenshot_url = req.file ? `/uploads/${req.file.filename}` : null;
    try {
      const existing = db.prepare("SELECT * FROM payments WHERE order_id = ?").get(orderId);
      if (existing) { db.prepare("UPDATE payments SET screenshot_url = ?, transaction_id = ?, payment_name = ? WHERE id = ?").run(screenshot_url, transactionId, paymentName, existing.id); }
      else { db.prepare("INSERT INTO payments (order_id, screenshot_url, transaction_id, payment_name) VALUES (?, ?, ?, ?)").run(orderId, screenshot_url, transactionId, paymentName); }
      db.prepare("UPDATE orders SET payment_status = 'Pending Verification' WHERE id = ?").run(orderId);
      res.json({ message: "Proof uploaded successfully" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/admin/payments/:orderId', (req, res) => {
    try { res.json({ data: db.prepare("SELECT * FROM payments WHERE order_id = ?").get(req.params.orderId) }); } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/admin/payments/:orderId/status', (req, res) => {
    const { status } = req.body;
    try {
      db.prepare("UPDATE payments SET status = ? WHERE order_id = ?").run(status, req.params.orderId);
      db.prepare("UPDATE orders SET payment_status = ? WHERE id = ?").run(status, req.params.orderId);
      res.json({ message: "status updated" });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

// Admin All
app.get('/api/admin/dashboard', (req, res) => {
    try {
      const enquiryCount = db.prepare("SELECT COUNT(*) as count FROM inquiries").get().count;
      const orderCount = db.prepare("SELECT COUNT(*) as count FROM orders").get().count;
      const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get().count;
      const countries = db.prepare("SELECT COUNT(DISTINCT country) as count FROM inquiries").get().count;
      const revenue = db.prepare("SELECT SUM(total_amount) as total FROM orders WHERE payment_status = 'Approved'").get().total || 0;
      const recent = db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC LIMIT 5").all();
      res.json({ data: { stats: { totalEnquiries: enquiryCount, activeProducts: productCount, countriesReached: countries, annualRevenue: revenue }, recentEnquiries: recent } });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get(['/api/admin/inquiries', '/api/admin/enquiries'], (req, res) => {
    try { res.json({ data: db.prepare("SELECT * FROM inquiries ORDER BY created_at DESC").all() }); } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/admin/orders', (req, res) => {
    try { res.json({ data: db.prepare("SELECT o.*, u.name as customer_name, u.email as customer_email FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC").all() }); } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/admin/orders/:id', (req, res) => {
    try {
      const order = db.prepare("SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone FROM orders o JOIN users u ON o.user_id = u.id WHERE o.id = ?").get(req.params.id);
      if (order) {
        const items = db.prepare("SELECT oi.*, p.name, p.image FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?").all(order.id);
        order.items = JSON.stringify(items);
      }
      res.json({ data: order });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.put('/api/admin/orders/:id/status', (req, res) => {
    const { status } = req.body;
    try { db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id); res.json({ message: "success" }); } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/admin/users', (req, res) => {
    try {
      const rows = db.prepare(`SELECT u.*, (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count, (SELECT SUM(total_amount) FROM orders WHERE user_id = u.id) as total_spent FROM users u WHERE role = 'user'`).all();
      res.json({ data: rows });
    } catch (err) { res.status(400).json({ error: err.message }); }
});

app.delete('/api/admin/users/:id', (req, res) => {
    try { db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id); res.json({ message: "deleted" }); } catch (err) { res.status(400).json({ error: err.message }); }
});

app.get('/api/admin/reports', (req, res) => {
  try {
    const monthlyRevenue = db.prepare("SELECT strftime('%Y-%m', created_at) as month, SUM(total_amount) as revenue, COUNT(*) as count FROM orders GROUP BY month ORDER BY month DESC LIMIT 12").all();
    const weeklyRevenue = db.prepare("SELECT strftime('%W', created_at) as week, SUM(total_amount) as revenue, COUNT(*) as count FROM orders GROUP BY week ORDER BY week DESC LIMIT 4").all();
    res.json({ data: { monthlyRevenue, weeklyRevenue } });
  } catch (err) { res.status(400).json({ error: err.message }); }
});

const PORT = 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
