const Database = require('better-sqlite3');
const db = new Database('./server/database.sqlite');
const info = db.pragma('table_info(orders)');
console.log(JSON.stringify(info, null, 2));
db.close();
