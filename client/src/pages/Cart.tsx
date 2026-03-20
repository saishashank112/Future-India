import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck, Package, ChevronRight, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { Link, useNavigate } from 'react-router-dom';
import PremiumImage from '../components/ui/PremiumImage';

const Cart = () => {
  const { items, subtotal, updateQuantity, removeFromCart } = useCart();
  const { formatCurrency } = useLanguage();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-48 pb-24 px-6 bg-[#F8F9FA]">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto text-center"
        >
          <div className="relative mb-8">
            <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center mx-auto text-gray-200 border border-gray-100 shadow-xl group">
              <ShoppingBag className="w-14 h-14 group-hover:rotate-12 transition-transform duration-500" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary/5 rounded-full blur-3xl -z-10" />
          </div>
          
          <h1 className="text-4xl font-serif font-bold text-primary italic mb-6">Trade Basket Empty</h1>
          <p className="text-gray-400 font-medium leading-relaxed mb-10 max-w-sm mx-auto">
            Your international trade ledger is awaiting high-quality Indian commodities. Explore our portfolio to initialize export protocols.
          </p>
          
          <Link to="/products" className="inline-flex items-center gap-4 px-10 py-5 bg-primary text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:bg-accent hover:shadow-accent/20 transition-all group">
            <span>Explore Portfolio</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32 bg-[#F8F9FA]">
      <div className="max-w-[1400px] mx-auto px-6">
        <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-accent">
                <Package className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Logistics Hub</span>
             </div>
             <h1 className="text-5xl md:text-6xl font-serif font-bold text-primary italic leading-tight">Trade Basket</h1>
             <p className="text-gray-400 font-medium uppercase tracking-[0.1em] text-[10px] bg-white border border-gray-100 px-4 py-1 rounded-full inline-block">
                Secure Export Protocols Initialized
             </p>
          </div>
          <div className="hidden md:flex items-center gap-4 text-primary bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-white">
             <div className="text-right">
                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Basket Value</p>
                <p className="text-xl font-serif font-bold italic">{formatCurrency(subtotal)}</p>
             </div>
             <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
             </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Item List */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div 
                  layout
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden group hover:shadow-xl hover:border-primary/10 transition-all duration-500"
                >
                  <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center">
                    {/* Image */}
                    <div className="w-full md:w-36 aspect-square rounded-[1.5rem] overflow-hidden bg-gray-50 border border-gray-100 relative group-hover:scale-[1.02] transition-transform duration-500">
                      <PremiumImage src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest text-primary border border-gray-100 shadow-sm">
                        {item.category}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-grow text-center md:text-left space-y-3">
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-primary italic leading-snug">{item.name}</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                          Product Code: EXM-{item.product_id}{item.id.toString().slice(-4)}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                        <div className="flex items-center gap-2 text-primary/60">
                          <Tag className="w-3.5 h-3.5 text-accent" />
                          <span className="text-xs font-bold uppercase tracking-widest">{formatCurrency(item.price)} <span className="text-[10px] text-gray-300 font-medium">/Kg</span></span>
                        </div>
                        <div className="flex items-center gap-2 text-primary/60">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span className="text-[9px] font-bold uppercase tracking-widest">Quality Guaranteed</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-center md:items-end gap-6 md:ml-auto">
                      <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100 p-1.5 shadow-inner">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm hover:bg-red-50 hover:text-red-500 transition-all disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-14 text-center font-bold text-primary text-lg font-serif italic">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm hover:bg-green-50 hover:text-green-500 transition-all font-serif italic"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em] leading-none mb-1">Extended Value</p>
                          <p className="text-xl font-serif font-bold text-primary italic">{formatCurrency(item.price * item.quantity)}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="p-3.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-[1.25rem] border border-transparent hover:border-red-100 transition-all"
                          title="Remove from basket"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            <div className="pt-4 flex flex-col md:flex-row items-center justify-between gap-6 px-4">
               <Link to="/products" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-accent transition-colors flex items-center gap-2 group">
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  Return to Commodities Portfolio
               </Link>
               <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest italic">
                  * Prices are based on current international market benchmarks
               </p>
            </div>
          </div>

          {/* Checkout Breakdown */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-36">
            <div className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-gray-100 shadow-2xl overflow-hidden shadow-primary/5">
              <div className="p-6 md:p-10 space-y-8 md:space-y-10">
                <header className="pb-6 border-b border-gray-50">
                   <h3 className="text-xl md:text-2xl font-serif font-bold text-primary italic">Export Protocol</h3>
                   <p className="text-[9px] md:text-[10px] font-bold text-gray-300 uppercase tracking-widest mt-1">Transaction Summary</p>
                </header>
                
                <div className="space-y-5 md:space-y-6">
                  <div className="flex justify-between items-center group">
                    <span className="text-gray-400 uppercase tracking-[0.1em] text-[10px] font-bold">Total Commodity Value</span>
                    <span className="text-primary font-bold font-serif italic text-base md:text-lg">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 uppercase tracking-[0.1em] text-[10px] font-bold">Logistics & Packaging</span>
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                       <span className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-green-500" />
                       <span className="text-green-600 font-bold uppercase text-[8px] tracking-widest">Complimentary</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="space-y-0.5">
                       <span className="text-gray-400 uppercase tracking-[0.1em] text-[10px] font-bold">Transit Insurance</span>
                       <p className="text-[8px] text-gray-300 uppercase font-bold tracking-widest">Covering CIF terms</p>
                    </div>
                    <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Included</span>
                  </div>
                </div>

                <div className="pt-6 md:pt-8 border-t border-gray-50">
                  <div className="flex justify-between items-end mb-6 md:mb-10">
                    <div className="space-y-1">
                       <span className="text-primary font-serif font-bold text-lg md:text-xl italic leading-none">Net Total</span>
                       <p className="text-[8px] font-bold text-gray-300 uppercase tracking-[0.2em] leading-none px-0.5">All Taxes Included</p>
                    </div>
                    <span className="text-3xl md:text-4xl font-serif font-bold text-accent italic -mb-1">{formatCurrency(subtotal)}</span>
                  </div>

                  <button 
                    onClick={() => navigate('/checkout')}
                    className="w-full h-16 md:h-20 bg-primary text-white rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center gap-3 md:gap-5 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase shadow-2xl shadow-primary/20 group hover:bg-accent hover:shadow-accent/20 transition-all px-4"
                  >
                    <span>Proceed to Secure Port</span>
                    <ArrowRight className="w-4 h-4 md:w-5 h-5 group-hover:translate-x-2 transition-transform duration-500" />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 border-t border-gray-100 p-8 flex flex-col gap-5">
                 <div className="flex items-start gap-4">
                    <Truck className="w-5 h-5 text-primary mt-1" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Global Logistics Network</p>
                       <p className="text-[9px] text-gray-400 font-medium">Direct vessel dispatch to major global ports including Dubai, Singapore, and Rotterdam.</p>
                    </div>
                 </div>
                 <div className="flex items-start gap-4">
                    <ShieldCheck className="w-5 h-5 text-accent mt-1" />
                    <div className="space-y-1">
                       <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Verified Trade Compliance</p>
                       <p className="text-[9px] text-gray-400 font-medium">Full documentation support (COO, Phyto-sanitary, B/L) included with every order.</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
