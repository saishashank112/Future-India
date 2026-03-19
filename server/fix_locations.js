const Database = require('better-sqlite3');
const db = new Database('./database.sqlite');
const orders = db.prepare("SELECT * FROM orders WHERE latitude IS NULL").all();
for (const order of orders) {
    if (order.shipping_details) {
        try {
            const data = JSON.parse(order.shipping_details);
            if (data.latitude && data.longitude) {
                db.prepare("UPDATE orders SET latitude = ?, longitude = ?, address = ? WHERE id = ?")
                  .run(data.latitude, data.longitude, data.address || null, order.id);
                console.log(`Fixed order ID ${order.id}`);
            }
        } catch (e) { console.error('Error parsing shippingDetails for order', order.id); }
    }
}
db.close();
