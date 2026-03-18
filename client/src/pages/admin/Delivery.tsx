import { useState, useEffect } from 'react';
import { Printer, MapPin, ChevronDown, Eye } from 'lucide-react';

interface Order {
  id: number;
  order_code: string;
  total_amount: number;
  status: string;
  customer_name: string;
  created_at: string;
  shipping_details: string;
}

const AdminDelivery = () => {
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
          <h1 className="text-3xl font-serif font-bold text-gray-900">Delivery Management</h1>
        </div>
        <p className="text-gray-400 font-medium uppercase tracking-widest text-xs italic pl-5">Track and manage all order deliveries.</p>
      </header>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="flex gap-4 items-center">
             <input type="text" placeholder="Search by ID, order, customer, tracking..." className="w-80 px-4 py-2 text-xs border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-red-200" />
             <select className="px-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 outline-none focus:ring-1 focus:ring-red-200">
                <option>All Statuses</option>
             </select>
          </div>
          <span className="text-xs text-gray-500 font-medium">{orders.length} deliveries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/30">
                <th className="py-4 px-6 border-b border-gray-100 font-sans">Delivery ID</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans">Order</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans">Customer</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans">Tracking</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans">Status</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans text-center">Shipping</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans text-center">Location</th>
                <th className="py-4 px-6 border-b border-gray-100 font-sans text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-700">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-5 px-6 font-bold text-gray-900">
                     <span className="text-red-800">Del-{order.order_code.split('-')[1]}</span>
                     <div className="text-[9px] text-gray-400 font-medium">{new Date(order.created_at).toLocaleDateString()}</div>
                  </td>
                  <td className="py-5 px-6 font-bold text-gray-900">{order.order_code}</td>
                  <td className="py-5 px-6">
                     <div className="font-bold">{order.customer_name || 'Guest'}</div>
                     <div className="text-[9px] text-gray-400 font-medium">+91-000000000</div> 
                  </td>
                  <td className="py-5 px-6 font-medium text-gray-500">-</td>
                  <td className="py-5 px-6">
                    <div className="relative inline-block w-40">
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className={`w-full appearance-none px-3 py-1.5 rounded-md text-[9px] font-bold uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-red-200 cursor-pointer ${
                          order.status === 'Pending' || order.status === 'PENDING PAYMENT' || order.status === 'OUT FOR DELIVERY' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                          order.status === 'SHIPPED' || order.status === 'PACKING' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                          order.status === 'DELIVERED' ? 'bg-green-50 text-green-600 border border-green-100' : 
                          'bg-purple-50 text-purple-600 border border-purple-100'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="PACKING">PACKING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT FOR DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-current pointer-events-none opacity-50" />
                    </div>
                  </td>
                  <td className="py-5 px-6 text-center text-gray-500 font-medium">Free</td>
                  <td className="py-5 px-6 text-center">
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(order.shipping_details || 'India')}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[10px] font-bold text-red-800 hover:text-red-600 tracking-widest underline decoration-red-200 underline-offset-4 pointer-events-auto">
                      <MapPin className="w-3 h-3" /> View
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
                  <td colSpan={8} className="py-8 text-center text-gray-400 font-medium font-sans">No deliveries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDelivery;
