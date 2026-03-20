const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
let db;

// Hardcoded hash for 'admin123' if seeding
const ADMIN_HASH = '$2a$10$X86Z/0eYxLgX/qC9Y6H6ye8o.P.6yH86Z/0eYxLgX/qC9Y6H6ye'; // Mock hash for example

const initialProducts = [
  // Categories: Spices, Fruits, Vegetables, Grains, Seeds, Powders
  { name: 'Organic Turmeric Finger', category: 'Spices', priceRange: '₹120 - ₹150', price: 120, moq: '500 Kg', grade: 'A1 Premium', origin: 'Maharashtra', image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=800', description: 'High curcumin content harvested from Erode belt.' },
  { name: 'Black Pepper (Tellicherry)', category: 'Spices', priceRange: '₹450 - ₹550', price: 450, moq: '200 Kg', grade: 'Bold (4.5mm)', origin: 'Kerala', image: 'https://images.unsplash.com/photo-1599940859674-a7fef05b94ae?q=80&w=800', description: 'Intense aroma and heat, hand-sorted for global grade.' },
  { name: 'Guntur Red Chilli', category: 'Spices', priceRange: '₹180 - ₹220', price: 180, moq: '1000 Kg', grade: 'S7/S13', origin: 'Andhra Pradesh', image: 'https://images.unsplash.com/photo-1610450949065-2f2258940801?q=80&w=800', description: 'Deep red color with high pungency and durability.' },
  { name: 'Pollachi Tender Coconuts', category: 'Fruits', priceRange: '₹35 - ₹45', price: 35, moq: '2000 Pcs', grade: 'Extra Large', origin: 'Tamil Nadu', image: 'https://images.unsplash.com/photo-1521503862198-2ae9a997bbc9?q=80&w=800', description: 'Sweet and refreshing tender coconut water.' },
  { name: 'Alphanso Mangoes', category: 'Fruits', priceRange: '₹800 - ₹1200', price: 800, moq: '50 Cases', grade: 'Export Class A', origin: 'Ratnagiri', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?q=80&w=800', description: 'Aromatic, fiberless king of mangoes, air-freighted.' },
  { name: 'Nasik Red Onions', category: 'Vegetables', priceRange: '₹25 - ₹35', price: 25, moq: '15000 Kg', grade: '45mm+ Jumbo', origin: 'Maharashtra', image: 'https://images.unsplash.com/photo-1508747703725-7197771375a0?q=80&w=800', description: 'Long durability red onions for container shipping.' },
  { name: 'Durum Wheat', category: 'Grains', priceRange: '₹32 - ₹42', price: 32, moq: '100 Tons', grade: 'Milling', origin: 'M.P.', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d0200?q=80&w=800', description: 'High protein wheat for premium pasta/flour.' },
  { name: 'Cumin Seeds (Jeera)', category: 'Seeds', priceRange: '₹240 - ₹320', price: 240, moq: '500 Kg', grade: 'Cleaned', origin: 'Gujarat', image: 'https://images.unsplash.com/photo-1532152277401-443306d86016?q=80&w=800', description: 'Machine-cleaned high purity seeds.' },
  { name: 'Turmeric Powder', category: 'Powders', priceRange: '₹160 - ₹220', price: 160, moq: '200 Kg', grade: 'Curcumin 5%+', origin: 'Maharashtra', image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?q=80&w=800', description: 'Pure ground turmeric with guaranteed curcumin.' }
];

const sharedSettings = [
  { key: 'company_email', value: 'contact@futureindiaexim.com' },
  { key: 'company_phone', value: '+91 80378 82249' },
  { key: 'company_address', value: 'Vijayawada, Andhra Pradesh, India - 520013' }
];

const sampleUsers = [
  { name: 'John Global', email: 'john@example.com', phone: '1234567890', role: 'user', country: 'USA' },
  { name: 'Ahmed Trading', email: 'ahmed@dubai.com', phone: '9715012345', role: 'user', country: 'UAE' }
];

try {
  db = new Database(dbPath, { verbose: console.log });
  initializeDb(db);
  
  const migrations = [
    "ALTER TABLE users ADD COLUMN password TEXT",
    "ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user'",
    "ALTER TABLE settings (key TEXT PRIMARY KEY, value TEXT)",
    "ALTER TABLE inquiries ADD COLUMN status TEXT DEFAULT 'New'",
    "ALTER TABLE orders ADD COLUMN address TEXT",
    "ALTER TABLE orders ADD COLUMN payment_status TEXT DEFAULT 'Pending'",
  ];
  for (const m of migrations) { try { db.prepare(m).run(); } catch (_) {} }
} catch (e) {
  console.error('SQLite Error, using fallback mock:', e.message);
  db = createMockDb();
}

function initializeDb(dbInstance) {
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, category TEXT, priceRange TEXT, price REAL, moq TEXT, grade TEXT, origin TEXT, image TEXT, description TEXT);
    CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE, phone TEXT UNIQUE, password TEXT, role TEXT DEFAULT 'user', country TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE IF NOT EXISTS inquiries (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT, country TEXT, food_item TEXT, type TEXT, message TEXT, phone TEXT, status TEXT DEFAULT 'New', created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, order_code TEXT UNIQUE, total_amount REAL, status TEXT DEFAULT 'Pending', payment_status TEXT DEFAULT 'Pending', address TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
    CREATE TABLE IF NOT EXISTS notifications (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER, message TEXT, is_read INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP);
  `);

  // Default Admin & Settings if empty
  const adminExists = dbInstance.prepare("SELECT * FROM users WHERE role = 'admin'").get();
  if (!adminExists) {
     const hash = bcrypt.hashSync('admin123', 10);
     dbInstance.prepare("INSERT INTO users (name, email, phone, role, country, password) VALUES ('Executive Admin', 'admin@futureindia.com', '0000000000', 'admin', 'INTERNAL', ?)").run(hash);
  }

  const partnerExists = dbInstance.prepare("SELECT * FROM users WHERE email = 'ahmed@dubai.com'").get();
  let userHash; // Declare userHash outside the if block

  if (!partnerExists) {
    console.log('Seeding regional partners...');
    userHash = bcrypt.hashSync('user123', 10);
    const insertUser = dbInstance.prepare("INSERT INTO users (name, email, phone, role, country, password) VALUES (?, ?, ?, ?, ?, ?)");
    sampleUsers.forEach(u => { 
        try { insertUser.run(u.name, u.email, u.phone, u.role, u.country, userHash); } catch(e){} 
    });
  }
  // Force update existing to hashed 'user123' to ensure predictability
  const forceHash = bcrypt.hashSync('user123', 10);
  dbInstance.prepare("UPDATE users SET password = ? WHERE role = 'user'").run(forceHash);

  const settingsCount = dbInstance.prepare("SELECT count(*) as count FROM settings").get().count;
  if (settingsCount === 0) {
    const insertSetting = dbInstance.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
    sharedSettings.forEach(s => insertSetting.run(s.key, s.value));
  }

  if (dbInstance.prepare("SELECT count(*) as count FROM products").get().count === 0) {
    const insertProd = dbInstance.prepare("INSERT INTO products (name, category, priceRange, price, moq, grade, origin, image, description) VALUES (@name, @category, @priceRange, @price, @moq, @grade, @origin, @image, @description)");
    initialProducts.forEach(p => insertProd.run(p));
  }
}

function createMockDb() {
  const mockData = {
    products: initialProducts.map((p, i) => ({ id: i+1, ...p })),
    users: [
        { id: 999, name: 'Executive Admin', email: 'admin@futureindia.com', role: 'admin', password: bcrypt.hashSync('admin123', 10) },
        ...sampleUsers.map((u, i) => ({ id: i+1, ...u, password: bcrypt.hashSync('user123', 10) }))
    ],
    settings: [...sharedSettings],
    orders: [], inquiries: []
  };

  return {
    prepare: (sql) => ({
      all: () => {
        if (sql.includes('FROM products')) return mockData.products;
        if (sql.includes('FROM settings')) return mockData.settings;
        if (sql.includes('FROM users')) return mockData.users;
        return [];
      },
      get: (params) => {
        if (sql.includes('COUNT(*)')) return { count: 0 };
        if (sql.includes('FROM users')) {
          const val = Array.isArray(params) ? params[0] : (params?.email || params?.identifier || params);
          return mockData.users.find(u => u.email === val || u.name === val);
        }
        if (sql.includes('FROM settings')) return mockData.settings.find(s => s.key === params);
        return null;
      },
      run: (p) => {
        if (sql.includes('UPDATE users')) {
           const newPass = Array.isArray(p) ? p[0] : p;
           const admin = mockData.users.find(u => u.role === 'admin');
           if (admin) admin.password = newPass; // index.js already hashed it
           return { changes: 1 };
        }
        if (sql.includes('REPLACE INTO settings')) {
           const [k, v] = p;
           const s = mockData.settings.find(x => x.key === k);
           if (s) s.value = v; else mockData.settings.push({ key: k, value: v });
        }
        return { changes: 1, lastInsertRowid: Date.now() };
      }
    }),
    exec: () => {},
    transaction: (fn) => fn
  };
}

module.exports = db;
