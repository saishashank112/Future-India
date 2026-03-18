const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
let db;

try {
  db = new Database(dbPath, { verbose: console.log });
  console.log('Connected to the SQLite database (better-sqlite3).');
  initializeDb(db);
  
  // Migrations - add columns if they don't exist
  const migrations = [
    "ALTER TABLE users ADD COLUMN password TEXT",
    "ALTER TABLE inquiries ADD COLUMN phone TEXT",
    "ALTER TABLE inquiries ADD COLUMN company_name TEXT",
    "ALTER TABLE inquiries ADD COLUMN status TEXT DEFAULT 'New'",
  ];
  for (const m of migrations) {
    try { db.prepare(m).run(); } catch (_) { /* already exists */ }
  }
} catch (e) {
  console.error('Failed to connect to SQLite:', e.message);
  db = createMockDb();
}

function initializeDb(dbInstance) {
  dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      priceRange TEXT,
      price REAL DEFAULT 0,
      moq TEXT,
      grade TEXT,
      origin TEXT,
      moisture TEXT,
      image TEXT,
      description TEXT,
      certs TEXT
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT UNIQUE,
      phone TEXT UNIQUE,
      password TEXT,
      company_name TEXT,
      country TEXT,
      otp TEXT,
      otp_expiry DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cart_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      order_code TEXT UNIQUE NOT NULL,
      total_amount REAL NOT NULL,
      shipping_details TEXT,
      status TEXT DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      country TEXT,
      food_item TEXT,
      type TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed products if empty
  const count = dbInstance.prepare("SELECT count(*) as count FROM products").get().count;
  if (count === 0) {
    const initialProducts = [
      {
        name: 'Organic Turmeric Finger',
        category: 'Spices',
        priceRange: '₹120 - ₹150',
        price: 120,
        moq: '500 Kg',
        grade: 'A1 Premium',
        origin: 'Maharashtra',
        moisture: 'max 10%',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5',
        description: 'High curcumin content (5.5%+) sourced from the Erode and Sangli regions. Natural dehydration process preserves essential oils.',
        certs: 'NPOP, USDA Organic, ISO'
      },
      {
        name: 'Black Pepper (Tellicherry)',
        category: 'Spices',
        priceRange: '₹450 - ₹550',
        price: 450,
        moq: '200 Kg',
        grade: 'Bold (4.5mm)',
        origin: 'Kerala',
        moisture: 'max 12%',
        image: 'https://images.unsplash.com/photo-1599940859674-a7fef05b94ae',
        description: 'Known as the "King of Spices", our TGSEB grade pepper is world-renowned for its bold size and intense aroma.',
        certs: 'FSSAI, FDA Registered'
      },
      {
        name: 'Shelled Groundnuts',
        category: 'Seeds',
        priceRange: '₹95 - ₹110',
        price: 95,
        moq: '5000 Kg',
        grade: '50/60 Count',
        origin: 'Gujarat',
        moisture: 'max 7%',
        image: 'https://images.unsplash.com/photo-1590502591653-37630713583d',
        description: 'Aflatoxin controlled groundnuts, perfect for roasting and peanut butter manufacturing. Double sortex cleaned.',
        certs: 'HACCP, BRC Global'
      },
      {
        name: 'Cumin Seeds (Kala Jeera)',
        category: 'Seeds',
        priceRange: '₹280 - ₹320',
        price: 280,
        moq: '1000 Kg',
        grade: 'Gulf Grade',
        origin: 'Rajasthan',
        moisture: 'max 9%',
        image: 'https://images.unsplash.com/photo-1599307734111-923f1bdc8621',
        description: 'Machine cleaned Cumin seeds with 99.5% purity. Deep earthy flavor and high essential oil content.',
        certs: 'GMP, FSSAI'
      }
    ];

    const insert = dbInstance.prepare("INSERT INTO products (name, category, priceRange, price, moq, grade, origin, moisture, image, description, certs) VALUES (@name, @category, @priceRange, @price, @moq, @grade, @origin, @moisture, @image, @description, @certs)");
    const insertMany = dbInstance.transaction((items) => {
      for (const item of items) insert.run(item);
    });
    insertMany(initialProducts);
  }
}

function createMockDb() {
  console.warn('Using in-memory mock database.');
  const mockData = {
    products: [
      { id: 1, name: 'Organic Turmeric Finger', category: 'Spices', priceRange: '₹120 - ₹150', price: 120, moq: '500 Kg', grade: 'A1 Premium', origin: 'Maharashtra', moisture: 'max 10%', image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5', description: '...', certs: 'ISO' },
      { id: 2, name: 'Black Pepper (Tellicherry)', category: 'Spices', priceRange: '₹450 - ₹550', price: 450, moq: '200 Kg', grade: 'Bold (4.5mm)', origin: 'Kerala', moisture: 'max 12%', image: 'https://images.unsplash.com/photo-1599940859674-a7fef05b94ae', description: '...', certs: 'FSSAI' }
    ],
    users: [],
    cart: [],
    orders: [],
    inquiries: []
  };

  return {
    prepare: (sql) => {
      return {
        all: () => {
          if (sql.includes('FROM products')) return mockData.products;
          if (sql.includes('FROM inquiries')) return mockData.inquiries;
          if (sql.includes('FROM users')) return mockData.users;
          return [];
        },
        get: (params) => {
          if (sql.includes('FROM products')) return mockData.products.find(p => p.id == (params?.id || params));
          if (sql.includes('SELECT count(*)')) return { count: mockData.products.length };
          if (sql.includes('FROM users')) {
            const val = Array.isArray(params) ? params[0] : params;
            return mockData.users.find(u => u.id == val || u.email == val || u.phone == val || u.name == val);
          }
          return null;
        },
        run: (params) => {
          if (sql.includes('INSERT INTO users')) {
             const newUser = { id: mockData.users.length + 1, ...params };
             mockData.users.push(newUser);
             return { lastInsertRowid: newUser.id };
          }
          if (sql.includes('INSERT INTO inquiries')) {
            const newInq = { id: mockData.inquiries.length + 1, ...params };
            mockData.inquiries.push(newInq);
            return { lastInsertRowid: newInq.id };
          }
          return { changes: 1 };
        }
      }
    },
    exec: (sql) => console.log('Mock Exec:', sql),
    transaction: (fn) => fn
  };
}

module.exports = db;

