let db;
try {
  const sqlite3 = require('sqlite3').verbose();
  const path = require('path');
  const dbPath = path.resolve(__dirname, 'database.sqlite');
  
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error('Error opening database', err.message);
      db = createMockDb();
    } else {
      console.log('Connected to the SQLite database.');
      initializeDb(db);
    }
  });
} catch (e) {
  console.warn('Sqlite3 not found or failed to load. Using in-memory mock database.');
  db = createMockDb();
}

function initializeDb(dbInstance) {
  dbInstance.serialize(() => {
    dbInstance.run(`CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      priceRange TEXT,
      moq TEXT,
      grade TEXT,
      origin TEXT,
      moisture TEXT,
      image TEXT,
      description TEXT,
      certs TEXT
    )`);

    dbInstance.run(`CREATE TABLE IF NOT EXISTS inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      country TEXT,
      food_item TEXT,
      type TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Seed products if empty
    dbInstance.get("SELECT count(*) as count FROM products", (err, row) => {
      if (row && row.count === 0) {
        const initialProducts = [
          {
            name: 'Organic Turmeric Finger',
            category: 'Spices',
            priceRange: '₹120 - ₹150',
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
            moq: '1000 Kg',
            grade: 'Gulf Grade',
            origin: 'Rajasthan',
            moisture: 'max 9%',
            image: 'https://images.unsplash.com/photo-1599307734111-923f1bdc8621',
            description: 'Machine cleaned Cumin seeds with 99.5% purity. Deep earthy flavor and high essential oil content.',
            certs: 'GMP, FSSAI'
          }
        ];

        const stmt = dbInstance.prepare("INSERT INTO products (name, category, priceRange, moq, grade, origin, moisture, image, description, certs) VALUES (?,?,?,?,?,?,?,?,?,?)");
        initialProducts.forEach(p => {
          stmt.run(p.name, p.category, p.priceRange, p.moq, p.grade, p.origin, p.moisture, p.image, p.description, p.certs);
        });
        stmt.finalize();
      }
    });
  });
}

function createMockDb() {
  // Simple in-memory mock that mimics sqlite3 API
  const mockData = {
    products: [
      {
        id: 1,
        name: 'Organic Turmeric Finger',
        category: 'Spices',
        priceRange: '₹120 - ₹150',
        moq: '500 Kg',
        grade: 'A1 Premium',
        origin: 'Maharashtra',
        moisture: 'max 10%',
        image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5',
        description: 'High curcumin content (5.5%+) sourced from the Erode and Sangli regions. Natural dehydration process preserves essential oils.',
        certs: 'NPOP, USDA Organic, ISO'
      },
      {
        id: 2,
        name: 'Black Pepper (Tellicherry)',
        category: 'Spices',
        priceRange: '₹450 - ₹550',
        moq: '200 Kg',
        grade: 'Bold (4.5mm)',
        origin: 'Kerala',
        moisture: 'max 12%',
        image: 'https://images.unsplash.com/photo-1599940859674-a7fef05b94ae',
        description: 'Known as the "King of Spices", our TGSEB grade pepper is world-renowned for its bold size and intense aroma.',
        certs: 'FSSAI, FDA Registered'
      }
    ],
    inquiries: []
  };

  return {
    all: (sql, params, cb) => {
      if (sql.includes('FROM products')) cb(null, mockData.products);
      else cb(null, []);
    },
    get: (sql, params, cb) => {
      if (sql.includes('FROM products')) cb(null, mockData.products.find(p => p.id == params[0]));
      else if (sql.includes('count(*)')) cb(null, { count: mockData.products.length });
      else cb(null, null);
    },
    run: (sql, params, cb) => {
      if (sql.includes('INSERT INTO inquiries')) {
        const newInquiry = { id: mockData.inquiries.length + 1, name: params[0], email: params[1] };
        mockData.inquiries.push(newInquiry);
        if (cb) cb.call({ lastID: newInquiry.id }, null);
      } else if (sql.includes('INSERT INTO products')) {
        const newProduct = { id: mockData.products.length + 1, name: params[0] };
        mockData.products.push(newProduct);
        if (cb) cb.call({ lastID: newProduct.id }, null);
      } else if (cb) {
        cb(null);
      }
    },
    serialize: (fn) => fn(),
    prepare: () => ({ 
      run: function() { 
        this.lastID = (this.lastID || 0) + 1;
      }, 
      finalize: () => {} 
    })
  };
}

module.exports = db;
