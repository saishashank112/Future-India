import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Printer } from 'lucide-react';

interface OrderItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_code: string;
  customer_name: string;
  email: string;
  customer_email: string;
  phone: string;
  shipping_details: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: string;
}

const AdminInvoice = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const printMode = searchParams.get('print') === '1';
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    // Use the single-order endpoint with items enriched
    fetch(`http://localhost:5001/api/admin/orders/${id}`)
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setOrder(json.data);
          try {
            const parsed = JSON.parse(json.data.items || '[]');
            setItems(parsed);
          } catch {
            setItems([]);
          }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching order for invoice:', err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (printMode && order && !loading) {
      setTimeout(() => window.print(), 600);
    }
  }, [printMode, order, loading]);

  const getShippingAddress = () => {
    if (!order?.shipping_details) return 'N/A';
    try {
      const parsed = JSON.parse(order.shipping_details);
      if (parsed.address) return parsed.address;
      return order.shipping_details;
    } catch {
      return order.shipping_details;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#8B1A1A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 text-sm font-medium">Loading Invoice...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 text-sm">Order not found.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0">
      {/* Action Bar - hidden on print */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-end gap-3 print:hidden px-4">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 bg-[#8B1A1A] text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#6b1414] transition-colors shadow-md"
        >
          <Printer className="w-4 h-4" />
          Print Invoice
        </button>
      </div>

      {/* Invoice Card */}
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden print:shadow-none print:rounded-none">
        {/* Header */}
        <div className="bg-[#8B1A1A] text-white p-8 print:p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-serif font-bold tracking-wide">Future India Exim</h1>
              <p className="text-red-200 text-xs uppercase tracking-[0.3em] mt-1">Premium Food Export Business</p>
              <p className="text-red-200 text-xs mt-1">Erode - 638001, Tamil Nadu, India</p>
            </div>
            <div className="text-right">
              <p className="text-red-200 text-xs uppercase tracking-widest">Tax Invoice</p>
              <p className="text-white font-bold text-lg mt-1">#{order.order_code}</p>
              <p className="text-red-200 text-xs mt-1">{new Date(order.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8 bg-gray-50 border-b border-gray-100 print:p-6">
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Customer Details</p>
            <p className="font-bold text-gray-800 text-sm">{order.customer_name || 'Guest User'}</p>
            <p className="text-gray-500 text-xs mt-1">{order.customer_email || order.email || 'N/A'}</p>
            <p className="text-gray-500 text-xs">{order.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shipping Address</p>
            <p className="text-gray-600 text-xs leading-relaxed">{getShippingAddress()}</p>
          </div>
          <div>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Order Status</p>
            <span className="inline-block bg-[#8B1A1A]/10 text-[#8B1A1A] px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
              {order.status || 'Pending'}
            </span>
            <p className="text-gray-400 text-xs mt-2">Payment: COD / Online</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="p-8 print:p-6">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4">Order Items</p>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b-2 border-gray-100">
                <th className="pb-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">#</th>
                <th className="pb-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Product</th>
                <th className="pb-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest">Category</th>
                <th className="pb-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-center">Qty</th>
                <th className="pb-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Unit Price</th>
                <th className="pb-3 text-[9px] font-bold text-gray-400 uppercase tracking-widest text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400 text-xs italic">No product items found for this order.</td>
                </tr>
              ) : items.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-4 text-gray-400 text-xs">{idx + 1}</td>
                  <td className="py-4 font-semibold text-gray-800">{item.name}</td>
                  <td className="py-4 text-gray-500 text-xs">{item.category || 'N/A'}</td>
                  <td className="py-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-4 text-right text-gray-600">₹{(item.price || 0).toLocaleString('en-IN')}</td>
                  <td className="py-4 text-right font-bold text-gray-800">₹{((item.price || 0) * item.quantity).toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end mt-8">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>₹{(order.total_amount || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-medium">Free</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Tax (GST 0%)</span>
                <span>₹0</span>
              </div>
              <div className="flex justify-between text-base font-bold text-[#8B1A1A] pt-3 border-t-2 border-[#8B1A1A]">
                <span>Grand Total</span>
                <span>₹{(order.total_amount || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 pb-8 print:px-6 print:pb-6 border-t border-gray-100 pt-6 flex justify-between items-center text-xs text-gray-400">
          <p>Thank you for doing business with <strong className="text-[#8B1A1A]">Future India Exim</strong>!</p>
          <p>futureindiaexim.com</p>
        </div>
      </div>
    </div>
  );
};

export default AdminInvoice;
