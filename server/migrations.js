const db = require('./db');

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL UNIQUE,
      stock_quantity INTEGER DEFAULT 0,
      threshold INTEGER DEFAULT 50,
      FOREIGN KEY(product_id) REFERENCES products(id)
    );
  `);
  
  // Create inventory records for existing products
  db.exec(`
    INSERT OR IGNORE INTO inventory (product_id, stock_quantity, threshold)
    SELECT id, 100, 20 FROM products;
  `);
  console.log("Migrations applied successfully.");
} catch (error) {
  console.error(error);
}
