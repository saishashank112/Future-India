import { getApiUrl } from '../../config/api';
import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Printer, 
  MapPin, 
  ChevronLeft,
  Package,
  User,
  Share2,
  ChevronDown,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface OrderItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
  image?: string;
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
  payment_status: string;
  created_at: string;
  items: string;
}

const AdminInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const printModeFromUrl = searchParams.get('print') === '1';
  
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(getApiUrl(`/admin/orders/${id}`))
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setOrder(json.data);
          try {
            const parsed = JSON.parse(json.data.items || '[]');
            setItems(parsed);
          } catch { setItems([]); }
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching order:', err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (printModeFromUrl && order && !loading) {
      const timer = setTimeout(() => window.print(), 1000);
      return () => clearTimeout(timer);
    }
  }, [printModeFromUrl, order, loading]);

  const getShippingAddress = () => {
    if (!order?.shipping_details) return 'N/A';
    try {
      const parsed = JSON.parse(order.shipping_details);
      return parsed.address || order.shipping_details;
    } catch { return order.shipping_details; }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-2 border-primary border-t-accent rounded-full animate-spin mx-auto" />
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Generating Payload...</p>
      </div>
    </div>
  );

  if (!order) return <div className="p-20 text-center font-serif italic text-primary underline">Document Protocol Not Found</div>;

  return (
    <>
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
          .print-container {
            width: 210mm;
            min-height: 297mm;
            padding: 20mm;
            margin: 0 auto;
            background: white !important;
          }
        }
      `}</style>

      {/* MOBILE / SCREEN RENDER LAYER */}
      <div className="min-h-screen bg-[#F8F9FA] pb-24 md:pb-12 no-print font-sans">
        {/* Sticky Mobile Header */}
        <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 p-4 flex items-center justify-between md:hidden">
            <button onClick={() => navigate(-1)} className="p-2 text-primary">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Commercial Instrument</p>
                <p className="text-xs font-bold text-primary italic font-serif leading-none">#{order.order_code}</p>
            </div>
            <div className="w-10" />
        </div>

        {/* Action Bar (Desktop) */}
        <div className="max-w-4xl mx-auto px-6 py-12 hidden md:flex justify-between items-end">
            <div>
                <h1 className="text-4xl font-serif font-bold text-primary italic leading-none">Commercial Registry</h1>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-3">Entity Dispatch Architecture v1.0</p>
            </div>
            <button 
                onClick={() => window.print()}
                className="flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-accent transition-all shadow-2xl shadow-primary/20 group"
            >
                <Printer className="w-4 h-4 group-hover:scale-110 transition-transform text-accent" />
                Synchronize Print
            </button>
        </div>

        {/* Narrative Card Flow (Main Screen View) */}
        <div className="max-w-4xl mx-auto px-4 space-y-6 md:space-y-8">
            {/* Identity Card */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] -mr-8 -mt-8" />
                <div className="flex justify-between items-start relative z-10">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white font-serif font-bold text-3xl italic shadow-lg">FI</div>
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-primary leading-tight italic">Future India Exim</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-widest ${
                                    order.payment_status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                    {order.payment_status}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-8">
                     <div>
                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Internal Reference</span>
                         <span className="text-sm font-bold text-primary font-serif italic truncate block">#{order.order_code}</span>
                     </div>
                     <div>
                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Protocol Timestamp</span>
                         <span className="text-sm font-bold text-primary truncate block">{new Date(order.created_at).toLocaleDateString()}</span>
                     </div>
                     <div className="hidden md:block">
                         <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Trade Category</span>
                         <span className="text-xs font-bold text-accent uppercase tracking-widest">Global Food Export</span>
                     </div>
                </div>
            </motion.div>

            {/* Customer & Destination Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100"
                >
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                        <User className="w-4 h-4 text-accent" /> Consignee Intelligence
                    </span>
                    <p className="text-xl font-serif font-bold text-primary italic mb-1">{order.customer_name}</p>
                    <p className="text-xs text-gray-500 font-medium mb-1">{order.customer_email || order.email}</p>
                    <p className="text-xs text-gray-500 font-medium">{order.phone}</p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100"
                >
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-6">
                        <MapPin className="w-4 h-4 text-accent" /> Dispatch endpoint
                    </span>
                    <p className="text-xs text-gray-600 font-serif italic leading-relaxed">{getShippingAddress()}</p>
                </motion.div>
            </div>

            {/* Expandable Goods Table */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden"
            >
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-between p-8 md:p-10 hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                            <Package className="w-5 h-5 text-accent" />
                        </div>
                        <div className="text-left">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Cargo Manifest</span>
                            <p className="text-xs font-bold text-gray-400">{items.length} Product Vectors Logged</p>
                        </div>
                    </div>
                    <ChevronDown className={`w-6 h-6 text-gray-300 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-gray-50 px-8 pb-8 space-y-4"
                        >
                            {items.map((item, idx) => (
                                <div key={idx} className="bg-white p-6 rounded-3xl border border-gray-100 flex justify-between items-center group">
                                    <div>
                                        <p className="text-sm font-bold text-primary font-serif italic">{item.name}</p>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Qty: {item.quantity} · Rate: ₹{item.price.toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary transition-colors group-hover:text-accent font-serif">₹{(item.price * item.quantity).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Totals Card */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-primary text-white rounded-[3rem] p-10 md:p-12 shadow-2xl shadow-primary/30 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl pointer-events-none" />
                <div className="text-center md:text-left relative z-10">
                    <span className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] block mb-2">Net Commercial Liability</span>
                    <h3 className="text-4xl md:text-6xl font-serif font-bold italic tracking-tighter">₹{order.total_amount.toLocaleString()}</h3>
                </div>
                <div className="flex flex-col gap-3 w-full md:w-auto relative z-10">
                    <div className="flex justify-between md:justify-end gap-x-12 text-[10px] font-bold uppercase tracking-widest border-b border-white/10 pb-3">
                        <span className="text-white/40">Logistics</span>
                        <span className="text-accent">INCLUDED</span>
                    </div>
                    <div className="flex justify-between md:justify-end gap-x-12 text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-white/40">Tax Arch (GST)</span>
                        <span className="italic">0.00%</span>
                    </div>
                </div>
            </motion.div>

            {/* Sticky Actions (Mobile Only) */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 md:hidden flex gap-4 z-50">
                <button 
                  onClick={() => window.print()}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all"
                >
                    <Download className="w-4 h-4 text-accent" /> Save / Print
                </button>
                <button className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-primary">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>
        </div>

        <footer className="mt-20 py-12 text-center hidden md:block border-t border-gray-100">
             <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">© 2026 Future India Exim · All Trade Data Encrypted</p>
        </footer>
      </div>

      {/* PRINT RENDER LAYER (A4 CANVAS) */}
      <div className="hidden print:block print-container font-serif bg-white text-black">
          {/* Print Header */}
          <div className="flex justify-between items-start border-b-[3px] border-black pb-10">
              <div className="space-y-4">
                  <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-black text-white flex items-center justify-center text-xl font-bold italic">FI</div>
                      <h2 className="text-3xl font-bold uppercase tracking-tight">Future India Exim</h2>
                  </div>
                  <div className="text-[12pt] space-y-0.5 leading-tight">
                      <p>Erode - 638001, Tamil Nadu, India</p>
                      <p>futureindiaexim.com | logistics@futureindiaexim.com</p>
                  </div>
              </div>
              <div className="text-right border-l-[1px] border-gray-200 pl-10">
                  <h3 className="text-[10pt] font-sans font-bold uppercase tracking-[0.2em] mb-2">Invoice Details</h3>
                  <div className="text-[14pt] space-y-1">
                      <p className="font-bold">ID: {order.order_code}</p>
                      <p className="text-gray-600">Date: {new Date(order.created_at).toLocaleDateString('en-GB')}</p>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-2 gap-10 py-12">
               <div className="space-y-3">
                  <span className="text-[9pt] font-sans font-bold uppercase tracking-widest text-gray-500">Consignee</span>
                  <div className="text-[13pt] leading-tight font-bold">
                      <p>{order.customer_name}</p>
                      <p className="text-[11pt] font-normal text-gray-600 mt-2">{order.customer_email || order.email}</p>
                      <p className="text-[11pt] font-normal text-gray-600">{order.phone}</p>
                  </div>
               </div>
               <div className="space-y-3">
                  <span className="text-[9pt] font-sans font-bold uppercase tracking-widest text-gray-500">Destination</span>
                  <p className="text-[12pt] leading-snug italic text-gray-700">{getShippingAddress()}</p>
               </div>
          </div>

          {/* Commercial Table */}
          <div className="mt-6">
              <table className="w-full text-left">
                  <thead>
                      <tr className="border-b-[2px] border-black text-[10pt] font-sans font-bold uppercase tracking-widest">
                          <th className="py-4">Item Description</th>
                          <th className="py-4 text-center">Qty</th>
                          <th className="py-4 text-right">Unit Price</th>
                          <th className="py-4 text-right">Value (INR)</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                      {items.map((item, idx) => (
                          <tr key={idx} className="text-[12pt]">
                              <td className="py-6 font-bold">{item.name}</td>
                              <td className="py-6 text-center italic">{item.quantity}</td>
                              <td className="py-6 text-right">₹{item.price.toLocaleString()}</td>
                              <td className="py-6 text-right font-bold">₹{(item.price * item.quantity).toLocaleString()}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>

          {/* Totals & Notes */}
          <div className="mt-12 flex justify-between gap-20">
              <div className="flex-1 space-y-6 pt-10">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-100 italic text-[10pt] text-gray-600">
                      Note: This commercial instrument establishes the legal transfer of agricultural cargo. 
                      All trade protocols adhere to standard export guidelines. Registered with Future India Exim Intelligence Repository.
                  </div>
                  <div className="flex flex-col items-center w-64 pt-12 border-t border-black/10">
                      <div className="italic font-serif text-lg font-bold mb-1">Approved Agent</div>
                      <div className="text-[9pt] font-sans font-bold uppercase tracking-widest opacity-50">Commercial Authority</div>
                  </div>
              </div>
              <div className="w-[300px] pt-4 space-y-4">
                  <div className="flex justify-between text-[11pt] font-sans font-bold uppercase tracking-widest border-b border-gray-100 pb-2">
                       <span className="text-gray-400">Gross Subtotal</span>
                       <span>₹{order.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11pt] font-sans font-bold uppercase tracking-widest border-b border-gray-100 pb-2">
                       <span className="text-gray-400">Logistics Cost</span>
                       <span className="text-green-600 italic">Prepaid</span>
                  </div>
                  <div className="flex justify-between pt-6">
                       <span className="text-[12pt] font-sans font-bold uppercase tracking-[0.2em]">Net Total</span>
                       <span className="text-[32pt] font-bold leading-none tracking-tighter italic">₹{order.total_amount.toLocaleString()}</span>
                  </div>
              </div>
          </div>

          {/* Static Footer */}
          <div className="absolute bottom-[20mm] left-[20mm] right-[20mm] border-t-[1px] border-gray-200 pt-8 flex justify-between items-center text-[9pt] font-sans font-bold text-gray-400 uppercase tracking-widest">
              <p>Certified Electronic Transaction · Document Verified</p>
              <p>Page 01 / 01</p>
          </div>
      </div>
    </>
  );
};

export default AdminInvoice;
