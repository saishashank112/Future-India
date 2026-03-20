const db = require('./db.js');
const users = db.prepare("SELECT email, role, length(password) as p_len, password FROM users").all();
console.log(JSON.stringify(users, null, 2));
process.exit(0);
