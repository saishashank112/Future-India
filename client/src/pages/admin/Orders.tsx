import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  MapPin, 
  ChevronDown, 
  X, 
  AlertCircle,
  CreditCard,
  User,
  Navigation,
  Printer,
  Package,
  FileText,
  Clock
} from 'lucide-react';

interface OrderItem {
  name: string;
  image: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_code: string;
  total_amount: number;
  status: string;
  payment_status: string;
  customer_name: string;
  email?: string;
  phone?: string;
  created_at: string;
  address: string;
  latitude?: number;
  longitude?: number;
  shipping_details?: string;
}

interface PaymentProof {
  screenshot_url: string;
  transaction_id: string;
  payment_name: string;
  status: string;
}

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [paymentProof, setPaymentProof] = useState<PaymentProof | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  


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

  const fetchOrderDetails = async (orderId: number) => {
    setIsLoadingDetails(true);
    setOrderItems([]);
    setPaymentProof(null);
    try {
      // Fetch Items
      const itemsRes = await fetch(`http://localhost:5001/api/order-details/${orderId}`);
      const itemsData = await itemsRes.json();
      if (itemsData.data) setOrderItems(itemsData.data);

      // Fetch Payment Proof
      const paymentRes = await fetch(`http://localhost:5001/api/admin/payments/${orderId}`);
      const paymentData = await paymentRes.json();
      if (paymentData.data) setPaymentProof(paymentData.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (selectedOrder) {
      fetchOrderDetails(selectedOrder.id);
    }
  }, [selectedOrder]);

  const updatePaymentStatus = async (id: number, status: string) => {
    try {
      await fetch(`http://localhost:5001/api/admin/payments/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchOrders();
    } catch (err) {
      console.error('Error updating payment status:', err);
    }
  };

  // Helper to parse shipping details
  const parsedShippingDetails = selectedOrder?.shipping_details 
    ? JSON.parse(selectedOrder.shipping_details) 
    : {};

  return (
    <div className="space-y-8 pb-12 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary italic">Global Order Ledger</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time trade monitoring & logistics control</p>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50">
                <th className="py-6 px-8">Identity</th>
                <th className="py-6 px-8">Client / Origin</th>
                <th className="py-6 px-8">Settlement</th>
                <th className="py-6 px-8">Payment Status</th>
                <th className="py-6 px-8">Mapping</th>
                <th className="py-6 px-8 text-right">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="py-6 px-8">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary group-hover:text-accent transition-colors">#{order.order_code}</span>
                        <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest mt-1">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary italic font-serif leading-none mb-1">{order.customer_name || 'Anonymous Client'}</span>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-accent" />
                            {order.address?.split(',').slice(-2).join(',') || 'Domestic'}
                        </span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <span className="text-xs font-bold text-primary tabular-nums">₹{order.total_amount.toLocaleString()}</span>
                  </td>
                  <td className="py-6 px-8">
                    <div className="relative inline-block">
                      <select 
                        value={order.payment_status || 'Pending'}
                        onChange={(e) => updatePaymentStatus(order.id, e.target.value)}
                        className={`appearance-none px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest pr-8 cursor-pointer transition-all border ${
                          order.payment_status === 'Approved' ? 'bg-green-50 text-green-600 border-green-100' :
                          order.payment_status === 'Cancelled' ? 'bg-red-50 text-red-600 border-red-100' :
                          order.payment_status === 'Pending Verification' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                          'bg-orange-50 text-orange-600 border-orange-100'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Pending Verification">Verification</option>
                        <option value="Approved">Approved</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-current pointer-events-none opacity-50" />
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    {order.latitude ? (
                        <a 
                            href={`https://www.google.com/maps?q=${order.latitude},${order.longitude}`} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-[9px] font-bold uppercase tracking-widest text-primary hover:bg-accent hover:text-white transition-all shadow-sm"
                        >
                            <Navigation className="w-3 h-3" />
                            <span>GPS ACTIVE</span>
                        </a>
                    ) : (
                        <span className="text-[9px] font-bold text-gray-200 uppercase italic">NO GPS DATA</span>
                    )}
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-100"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <a 
                        href={`/admin/invoice/${order.id}?print=1`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary hover:bg-accent hover:text-white transition-all shadow-sm border border-gray-100"
                      >
                        <Printer className="w-4 h-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">No active orders found in ledger</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-primary/90 backdrop-blur-xl p-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="w-full max-w-6xl bg-white rounded-[4rem] shadow-4xl overflow-hidden relative border border-white/20 flex flex-col md:flex-row max-h-[90vh]"
            >
              <button 
                onClick={() => setSelectedOrder(null)}
                className="absolute top-10 right-10 w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-primary hover:bg-red-50 hover:text-red-500 transition-all z-50 shadow-sm"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Left Side: Proof & Metadata */}
              <div className="md:w-5/12 bg-gray-50 p-12 flex flex-col gap-10 border-r border-gray-100 overflow-y-auto">
                    <div>
                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-6">Financial Verification</h4>
                        {paymentProof ? (
                             <div className="space-y-6">
                                <div className="aspect-[4/5] bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl group relative cursor-zoom-in">
                                    <img src={`http://localhost:5001${paymentProof.screenshot_url}`} alt="Payment Proof" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                         <Eye className="w-10 h-10 text-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                         <div className="absolute right-0 top-0 w-12 h-12 bg-accent/5 rounded-bl-3xl flex items-center justify-center">
                                            <FileText className="w-5 h-5 text-accent" />
                                         </div>
                                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Transaction Ref (UID)</span>
                                         <span className="text-sm font-bold text-primary font-serif italic truncate block">{paymentProof.transaction_id}</span>
                                    </div>
                                    <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group">
                                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Payer Identity</span>
                                         <span className="text-sm font-bold text-primary italic font-serif truncate block">{paymentProof.payment_name}</span>
                                    </div>
                                </div>
                             </div>
                        ) : (
                            <div className="aspect-[4/5] bg-gray-100/50 rounded-[2.5rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-300">
                                <AlertCircle className="w-12 h-12 mb-4 opacity-20" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Awaiting Proof Submission</span>
                            </div>
                        )}
                    </div>

                     <div className="space-y-4">
                          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em] mb-2">Location Intelligence</h4>
                          {(selectedOrder.latitude || parsedShippingDetails?.latitude) ? (
                             <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
                                 <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                         <Navigation className="w-5 h-5 animate-pulse" />
                                      </div>
                                      <div>
                                         <div className="text-[10px] font-bold text-primary uppercase">Precise Coordinates Archived</div>
                                         <div className="text-[9px] text-gray-400">
                                           {selectedOrder.latitude || parsedShippingDetails?.latitude}, {selectedOrder.longitude || parsedShippingDetails?.longitude}
                                         </div>
                                      </div>
                                 </div>
                                 <a 
                                     href={`https://www.google.com/maps?q=${selectedOrder.latitude || parsedShippingDetails?.latitude},${selectedOrder.longitude || parsedShippingDetails?.longitude}`}
                                     target="_blank"
                                     rel="noreferrer"
                                     className="block w-full py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest text-center rounded-xl hover:bg-accent transition-all"
                                 >
                                     Open Satellite Mapping
                                 </a>
                             </div>
                          ) : (
                             <div className="p-6 bg-orange-50/50 rounded-[2rem] border border-orange-100 text-center">
                                 <p className="text-[9px] font-bold text-orange-600 uppercase tracking-widest">Geo-Location Metadata Unavailable</p>
                             </div>
                          )}
                     </div>
              </div>

              {/* Right Side: Order Manifest */}
              <div className="flex-1 p-16 overflow-y-auto">
                    <div className="flex justify-between items-start mb-12">
                         <div>
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 bg-accent text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em]">Commercial Protocol</span>
                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] ${
                                    selectedOrder.payment_status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {selectedOrder.payment_status}
                                </span>
                            </div>
                            <h3 className="text-5xl font-serif font-bold text-primary italic leading-tight">Entity {selectedOrder.order_code}</h3>
                            <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                    <Clock className="w-3.5 h-3.5 text-accent" />
                                    Logged: {new Date(selectedOrder.created_at).toLocaleString()}
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-16">
                        <div className="space-y-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <User className="w-4 h-4 text-accent" /> Consignee Intelligence
                            </span>
                            <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-lg font-serif font-bold text-primary mb-1 italic">{selectedOrder.customer_name}</p>
                                <p className="text-xs text-gray-400 font-medium">{selectedOrder.email}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-accent" /> Financial Volume
                            </span>
                            <div className="p-6 bg-primary rounded-2xl shadow-xl shadow-primary/20">
                                <p className="text-3xl font-serif font-bold text-white italic">₹{selectedOrder.total_amount.toLocaleString()}</p>
                                <p className="text-[9px] font-bold text-white/50 uppercase tracking-widest mt-1">Total Valuation Net</p>
                            </div>
                        </div>
                    </div>

                    <div className="mb-16">
                         <div className="flex items-center justify-between mb-6">
                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                                <Package className="w-4 h-4 text-accent" /> Ordered Manifest
                            </h4>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{orderItems.length} Products Found</span>
                         </div>
                         <div className="space-y-4">
                            {isLoadingDetails ? (
                                <div className="py-12 flex justify-center">
                                    <div className="w-8 h-8 border-4 border-primary/20 border-t-accent rounded-full animate-spin" />
                                </div>
                            ) : (
                                orderItems.map((item, idx) => (
                                    <motion.div 
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        key={idx} 
                                        className="flex items-center gap-6 p-5 bg-gray-50 rounded-3xl border border-gray-100 hover:bg-white hover:shadow-xl transition-all group"
                                    >
                                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white border border-gray-100 flex-shrink-0 group-hover:scale-110 transition-transform">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h5 className="text-sm font-bold text-primary group-hover:text-accent transition-colors">{item.name}</h5>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Commercial Grade · Unit Price: ₹{item.price.toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-primary">₹{(item.price * item.quantity).toLocaleString()}</div>
                                            <div className="text-[10px] font-bold text-accent uppercase tracking-widest mt-0.5">Qty: {item.quantity}</div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                         </div>
                    </div>

                    <div className="space-y-4">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-accent" /> Shipping Domicile Address
                        </span>
                        <div className="text-sm text-gray-600 bg-gray-50 p-8 rounded-[2rem] border border-gray-100 leading-relaxed italic font-serif">
                            {selectedOrder.address}
                        </div>
                    </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
