const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');
console.log(db.pragma('table_info(orders)'));
db.close();
