const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');
const order = db.prepare("SELECT * FROM orders WHERE order_code LIKE '%1773904555077%'").get();
console.log(JSON.stringify(order, null, 2));
db.close();
