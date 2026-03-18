import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, MapPin, Tag, ShoppingCart, Layers, Plus, Minus, Zap, CheckCircle2, Box } from 'lucide-react';
import PremiumImage from './PremiumImage';
import { useModal } from '../../context/ModalContext';
import { useLanguage } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ProductDetailModal = () => {
  const { isDetailModalOpen, closeDetailModal, activeProduct } = useModal();
  const { formatCurrency } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const typeTabs = ['details', 'standards', 'packaging'] as const;
  type TabType = typeof typeTabs[number];
  const [activeTab, setActiveTab] = useState<TabType>('details');

  if (!activeProduct) return null;

  const parseCerts = (certsStr: string) => {
    return certsStr ? certsStr.split(',').map(s => s.trim()) : [];
  };

  const productPrice = activeProduct.price || 0;

  const handleAddToCart = async () => {
    await addToCart(activeProduct, quantity);
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      closeDetailModal();
    }, 1500);
  };

  const handleBuyNow = async () => {
     await addToCart(activeProduct, quantity);
     closeDetailModal();
     navigate('/cart');
  };



  return (
    <AnimatePresence>
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDetailModal}
            className="absolute inset-0 bg-primary/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-6xl bg-white rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col lg:flex-row min-h-[600px] max-h-[95vh]"
          >
            {/* Left side: Image Gallery */}
            <div className="lg:w-1/2 bg-gray-50 relative flex flex-col p-8 md:p-12 lg:pr-6 m-2 rounded-[2rem]">
               <div className="relative aspect-square w-full rounded-3xl overflow-hidden shadow-sm mb-6 bg-white flex-shrink-0 border border-gray-100">
                  <PremiumImage src={activeProduct.image} alt={activeProduct.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest text-primary shadow-sm flex items-center gap-2">
                     <ShieldCheck className="w-3.5 h-3.5 text-accent" /> Verified Quality
                  </div>
               </div>
               
               {/* Mock Thumbnails */}
               <div className="grid grid-cols-4 gap-4 mt-auto">
                   {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${i === 1 ? 'border-accent shadow-md opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}>
                          <PremiumImage src={activeProduct.image} alt="thumbnail" className="w-full h-full object-cover" />
                      </div>
                   ))}
               </div>
            </div>

            {/* Right side: Content */}
            <div className="flex-1 p-8 md:p-12 lg:pl-6 overflow-y-auto relative flex flex-col">
              <button 
                onClick={closeDetailModal}
                className="absolute top-6 right-6 p-3 rounded-full hover:bg-gray-100 transition-colors z-10 bg-white shadow-sm border border-gray-100"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="space-y-8 pb-8">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1.5 bg-accent/10 rounded-full text-[9px] font-bold text-accent uppercase tracking-widest">{activeProduct.category}</span>
                    <span className="px-3 py-1.5 bg-green-50 rounded-full text-[9px] font-bold text-green-500 uppercase tracking-widest flex items-center gap-1">
                       <CheckCircle2 className="w-3 h-3" /> In Stock
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-5xl font-serif font-bold text-primary italic mb-2 leading-tight">{activeProduct.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                     <MapPin className="w-4 h-4 text-accent" /> {activeProduct.origin}
                  </div>
                </div>

                {/* Pricing & MOQ Grid */}
                <div className="grid grid-cols-2 gap-6 bg-gray-50 p-6 rounded-3xl border border-gray-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       <Tag className="w-4 h-4" /> Export Price
                    </div>
                    <div className="text-3xl font-serif font-bold text-primary">
                        {productPrice > 0 ? formatCurrency(productPrice) : activeProduct.priceRange}
                        <span className="text-sm text-gray-400 font-sans tracking-normal"> / Kg</span>
                    </div>
                  </div>
                  <div className="space-y-1 border-l border-gray-200 pl-6">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       <Box className="w-4 h-4" /> Min. Volume
                    </div>
                    <div className="text-3xl font-serif font-bold text-primary">
                        {activeProduct.moq}
                        <span className="text-sm text-gray-400 font-sans tracking-normal"> Kg</span>
                    </div>
                  </div>
                </div>

                {/* Quantity Control */}
                <div className="space-y-3">
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1 border-b border-gray-50 pb-2">Purchase Quantity (Multiplier x MOQ)</div>
                   <div className="flex items-center gap-4">
                      <div className="flex items-center bg-gray-50 rounded-2xl border border-gray-100 p-2">
                         <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 bg-white rounded-xl hover:bg-gray-100 hover:text-red-500 shadow-sm transition-all text-primary"><Minus className="w-5 h-5" /></button>
                         <div className="w-16 text-center font-bold text-xl text-primary">{quantity}</div>
                         <button onClick={() => setQuantity(quantity + 1)} className="p-3 bg-white rounded-xl hover:bg-gray-100 hover:text-green-500 shadow-sm transition-all text-primary"><Plus className="w-5 h-5" /></button>
                      </div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                         Total Base: <span className="text-primary text-sm">{parseInt(activeProduct.moq.replace(/\D/g, '') || '0') * quantity} Kg</span>
                      </div>
                   </div>
                </div>

                {/* Tabs */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex gap-4 mb-6 border-b border-gray-100">
                        {typeTabs.map(tab => (
                            <button
                               key={tab}
                               onClick={() => setActiveTab(tab)}
                               className={`pb-3 text-[10px] font-bold uppercase tracking-widest border-b-2 transition-all ${activeTab === tab ? 'border-accent text-primary' : 'border-transparent text-gray-400 hover:text-primary hover:border-gray-200'}`}
                            >
                               {tab === 'details' ? 'Overview' : tab === 'standards' ? 'Export Standards' : 'Packaging & Logistics'}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[140px]">
                       {activeTab === 'details' && (
                           <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <p className="text-sm text-gray-500 leading-relaxed italic border-l-2 border-accent pl-6 py-1">
                                "{activeProduct.description || 'Premium grade commodity sourced from high-yield farm clusters. Guaranteed quality with international standard packaging.'}"
                              </p>
                              <div className="flex flex-wrap gap-2 pt-2">
                                 {parseCerts(activeProduct.certs || 'ISO 9001, FDA Approved').map(c => (
                                    <span key={c} className="text-[9px] font-bold text-accent bg-accent/5 px-3 py-1.5 rounded border border-accent/10 uppercase">{c}</span>
                                 ))}
                              </div>
                           </div>
                       )}
                       {activeTab === 'standards' && (
                           <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                               <div className="flex justify-between items-center p-3 border-b border-gray-50"><span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Purity Grade</span><span className="text-sm text-primary font-bold">99.5% Minimum</span></div>
                               <div className="flex justify-between items-center p-3 border-b border-gray-50"><span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Moisture Content</span><span className="text-sm text-primary font-bold">7% Maximum</span></div>
                               <div className="flex justify-between items-center p-3 border-b border-gray-50"><span className="text-xs text-gray-500 font-bold uppercase tracking-widest">Adulteration</span><span className="text-sm text-primary font-bold">0% Absolutely Pure</span></div>
                           </div>
                       )}
                       {activeTab === 'packaging' && (
                           <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300 text-sm text-gray-500 font-medium leading-relaxed">
                               <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                                  <Layers className="w-5 h-5 text-accent mt-0.5" />
                                  <p>Standard export packaging in 25kg or 50kg multi-wall paper bags with inner poly-liner to prevent moisture ingress, shipped safely within 20ft or 40ft standard dry containers.</p>
                               </div>
                           </div>
                       )}
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 mt-auto">
                  <button 
                    onClick={handleAddToCart}
                    className={`py-4.5 rounded-2xl border-2 transition-all flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest uppercase ${
                      showSuccess 
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'border-primary/20 bg-white text-primary hover:bg-gray-50 hover:border-primary'
                    }`}
                  >
                    {showSuccess ? <><CheckCircle2 className="w-4 h-4" /> Added to Basket</> : <><ShoppingCart className="w-4 h-4" /> Add to Cart</>}
                  </button>
                  <button 
                    onClick={handleBuyNow}
                    className="py-4.5 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 text-[10px] font-bold tracking-widest uppercase hover:bg-accent hover:shadow-accent/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4" /> Secure Checkout
                  </button>
                </div>
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ProductDetailModal;
