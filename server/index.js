const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

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
  const url = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ message: "success", url });
});

// Get all products
app.get('/api/products', (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Add a product
app.post('/api/products', (req, res) => {
  const { name, category, priceRange, moq, grade, origin, moisture, image, description, certs } = req.body;
  const sql = 'INSERT INTO products (name, category, priceRange, moq, grade, origin, moisture, image, description, certs) VALUES (?,?,?,?,?,?,?,?,?,?)';
  const params = [name, category, priceRange, moq, grade, origin, moisture, image, description, certs];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "success", id: this.lastID });
  });
});

// Update a product
app.put('/api/products/:id', (req, res) => {
  const { name, category, priceRange, moq, grade, origin, moisture, image, description, certs } = req.body;
  const sql = `UPDATE products SET 
    name = COALESCE(?, name), 
    category = COALESCE(?, category), 
    priceRange = COALESCE(?, priceRange), 
    moq = COALESCE(?, moq), 
    grade = COALESCE(?, grade), 
    origin = COALESCE(?, origin), 
    moisture = COALESCE(?, moisture), 
    image = COALESCE(?, image), 
    description = COALESCE(?, description), 
    certs = COALESCE(?, certs) 
    WHERE id = ?`;
  const params = [name, category, priceRange, moq, grade, origin, moisture, image, description, certs, req.params.id];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "success", changes: this.changes });
  });
});

// Delete a product
app.delete('/api/products/:id', (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', req.params.id, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: "deleted", changes: this.changes });
  });
});

// Get single product
app.get('/api/products/:id', (req, res) => {
  db.get("SELECT * FROM products WHERE id = ?", [req.params.id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// Submit Inquiry
app.post('/api/inquire', (req, res) => {
  const { name, email, country, food_item, type, message } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: "Name and Email are required" });
    return;
  }
  const sql = 'INSERT INTO inquiries (name, email, country, food_item, type, message) VALUES (?,?,?,?,?,?)';
  const params = [name, email, country, food_item, type, message];
  db.run(sql, params, function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: "success",
      id: this.lastID
    });
  });
});

// Analytics Metrics
app.get('/api/metrics', (req, res) => {
  // Mock metrics for the progress page
  res.json({
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
    growth: 12.5,
    activeEnquiries: 48
  });
});

app.get('/', (req, res) => {
  res.send('Future India Exim API - Status: Online');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
