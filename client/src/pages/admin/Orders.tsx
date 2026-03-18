import { useState, useEffect } from 'react';
import { Eye, Printer, MapPin, ChevronDown } from 'lucide-react';

interface Order {
  id: number;
  order_code: string;
  total_amount: number;
  status: string;
  customer_name: string;
  created_at: string;
  shipping_details: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = () => {
    fetch('http://localhost:5001/api/admin/orders')
      .then(res => res.json())
      .then(json => {
        if (json.data) setOrders(json.data);
      })
      .catch(err => console.error('Error fetching orders:', err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(`http://localhost:5001/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1 h-8 bg-red-800 rounded-full" />
          <h1 className="text-3xl font-serif font-bold text-gray-900">Order Management</h1>
        </div>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-sm font-bold text-gray-800">All Orders (Latest 50)</h2>
          <span className="text-xs text-gray-500 font-medium">{orders.length} orders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30">
                <th className="py-4 px-6 border-b border-gray-100 font-sans">Order</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans">Date</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans">Customer</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans">Total</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans">Delivery Status</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans text-center">Payment</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans text-center">Location</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-6 font-bold text-gray-900">{order.order_code}</td>
                  <td className="py-5 px-6 text-gray-400">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="py-5 px-6">{order.customer_name || 'Guest'}</td>
                  <td className="py-5 px-6 font-bold text-gray-900">₹{order.total_amount.toLocaleString()}</td>
                  <td className="py-5 px-6">
                    <div className="relative inline-block w-40">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`w-full appearance-none px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-red-200 cursor-pointer ${
                          order.status === 'Pending' || order.status === 'PENDING PAYMENT' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                          order.status === 'SHIPPED' ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                          order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          'bg-green-50 text-green-600 border border-green-100'
                        }`}
                      >
                        <option value="PENDING PAYMENT">PENDING PAYMENT</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-current pointer-events-none opacity-50" />
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center text-gray-500 font-medium">UPI/Online</td>
                  <td className="py-5 px-6 text-center">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shipping_details || 'India')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-red-800 hover:text-red-600 uppercase tracking-widest underline decoration-red-200 underline-offset-4">
                      <MapPin className="w-3 h-3" /> Map
                    </a>
                  </td>
                  <td className="py-5 px-6 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <a href={`/admin/invoice/${order.id}`} title="View Invoice" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"><Eye className="w-4 h-4" /></a>
                      <a href={`/admin/invoice/${order.id}?print=1`} title="Print Invoice" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-700 transition-colors cursor-pointer"><Printer className="w-4 h-4" /></a>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-gray-400 font-medium font-sans">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
