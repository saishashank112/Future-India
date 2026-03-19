const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.resolve(__dirname, 'database.sqlite');

console.log('Target database:', dbPath);
const db = new Database(dbPath);

try {
  // Deep clean
  db.exec('PRAGMA foreign_keys = OFF');
  
  const tables = ['order_items', 'cart_items', 'payments', 'notifications', 'orders', 'products', 'inquiries'];
  for (const table of tables) {
    try {
      db.prepare(`DELETE FROM ${table}`).run();
      console.log(`Cleared table: ${table}`);
    } catch (e) {
      console.log(`Table ${table} might not exist or failed to clear:`, e.message);
    }
  }
  
  db.exec('PRAGMA foreign_keys = ON');

  const products = [
    {
      name: "Organic Turmeric Finger",
      category: "Spices",
      priceRange: "$1200 - $1500 / Ton",
      price: 120,
      moq: "1 Ton",
      grade: "Premium (Curcumin 5%+)",
      origin: "Nizamabad, India",
      moisture: "< 10%",
      image: "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&q=80&w=800",
      description: "Highly potent turmeric fingers sourced directly from the volcanic soils of Nizamabad. High curcumin content and deep orange hue.",
      certs: "ISO 9001, FSSAI, Organic India"
    },
    {
      name: "Black Pepper (Tellicherry)",
      category: "Spices",
      priceRange: "$4500 - $5000 / Ton",
      price: 450,
      moq: "500 Kg",
      grade: "Bold (TGSEB)",
      origin: "Kerala, India",
      moisture: "< 12%",
      image: "https://images.unsplash.com/photo-1599481238505-b8b0537a3f77?auto=format&fit=crop&q=80&w=800",
      description: "The 'King of Spices'. Tellicherry extra bold black pepper known for its complex citrus notes and intense heat.",
      certs: "HALAL, GMP, FSSAI"
    },
    {
      name: "Basmati Rice (1121 Sella)",
      category: "Grains",
      priceRange: "$950 - $1100 / Ton",
      price: 95,
      moq: "20 Tons (1 FCL)",
      grade: "Extra Long Grain",
      origin: "Haryana, India",
      moisture: "< 12.5%",
      image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=800",
      description: "World-renowned 1121 Sella Basmati. Characterized by unparalleled length and distinct aroma after cooking.",
      certs: "ISO, APEDA, FSSAI"
    },
    {
      name: "Green Cardamom (8mm Bold)",
      category: "Spices",
      priceRange: "$18000 - $22000 / Ton",
      price: 1800,
      moq: "100 Kg",
      grade: "Highest Export Grade",
      origin: "Idukki, India",
      moisture: "< 11%",
      image: "https://images.unsplash.com/photo-1543322194-d2e7d7008f51?auto=format&fit=crop&q=80&w=800",
      description: "Premium green cardamom pods from the Cardamom Hills. Intense fragrance and vibrant green color.",
      certs: "FSSAI, Organic Certified"
    },
    {
      name: "Cavendish Bananas",
      category: "Fruits",
      priceRange: "$400 - $600 / Ton",
      price: 40,
      moq: "18 Tons (Reefer)",
      grade: "A-Grade Export",
      origin: "Maharashtra, India",
      moisture: "N/A",
      image: "https://images.unsplash.com/photo-1603833665858-e61d17a86224?auto=format&fit=crop&q=80&w=800",
      description: "Fresh premium Cavendish bananas. Harvested at precise maturity for maximum shelf life during international transit.",
      certs: "GLOBALG.A.P, FSSAI"
    },
    {
      name: "Red Chili (Teja/S17)",
      category: "Spices",
      priceRange: "$2200 - $2500 / Ton",
      price: 220,
      moq: "5 Tons",
      grade: "High Pungency",
      origin: "Guntur, India",
      moisture: "< 10%",
      image: "https://images.unsplash.com/photo-1588253508568-a92654c6827b?auto=format&fit=crop&q=80&w=800",
      description: "Guntur Teja dry red chilies. Famous for their intense heat and rich red oil content.",
      certs: "ISO, FSSAI"
    }
  ];

  const insertProd = db.prepare(`
    INSERT INTO products (name, category, priceRange, price, moq, grade, origin, moisture, image, description, certs)
    VALUES (@name, @category, @priceRange, @price, @moq, @grade, @origin, @moisture, @image, @description, @certs)
  `);

  const insertInq = db.prepare(`
    INSERT INTO inquiries (name, email, phone, country, food_item, message, status) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  db.transaction(() => {
    for (const p of products) insertProd.run(p);
    
    insertInq.run("Dr. Marcus Thorne", "m.thorne@londonagro.co.uk", "+44 20 7946 0958", "United Kingdom", "Organic Turmeric", "Initial interest in 15MT monthly supply.", "Pending");
    insertInq.run("Aria Chen", "aria@singaporefoods.sg", "+65 6789 0123", "Singapore", "Basmati Rice", "Requesting quotation for 2 x 20ft FCL.", "Pending");
    insertInq.run("Hans Miller", "h.miller@germangrains.de", "+49 30 123456", "Germany", "Green Cardamom", "Need batch samples for analysis.", "Pending");
  })();

  console.log('✔ Database successfully seeded with premium data.');
} catch (err) {
  console.error('✘ Seeding failed:', err.message);
  process.exit(1);
}

process.exit(0);
