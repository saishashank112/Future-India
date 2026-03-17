import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, ShieldCheck, MapPin, Tag, ShoppingCart, Globe, Layers } from 'lucide-react';
import PremiumImage from './PremiumImage';
import { useModal } from '../../context/ModalContext';
import { useLanguage } from '../../context/LanguageContext';

const ProductDetailModal = () => {
  const { isDetailModalOpen, closeDetailModal, activeProduct, openEnquiryModal } = useModal();
  const { formatCurrency } = useLanguage();

  if (!activeProduct) return null;

  const parseCerts = (certsStr: string) => {
    return certsStr ? certsStr.split(',').map(s => s.trim()) : [];
  };

  const getNumericPrice = (range: string) => {
    const match = range.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
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
            className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row min-h-[600px] max-h-[90vh]"
          >
            {/* Left side: Image */}
            <div className="md:w-5/12 bg-gray-50 relative overflow-hidden hidden md:block border-r border-gray-100">
              <PremiumImage src={activeProduct.image} alt={activeProduct.name} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-10 text-white">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span className="text-accent font-bold tracking-[0.2em] uppercase text-[10px]">Verified Quality</span>
                </div>
                <h4 className="text-3xl font-serif font-bold mb-4">{activeProduct.name}</h4>
                <p className="text-sm text-white/70 italic leading-relaxed">
                   Direct from the source. Processed under strict HYA/ISO standards to ensure peak maturity and nutrient density.
                </p>
              </div>
            </div>

            {/* Right side: Content */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto relative">
              <button 
                onClick={closeDetailModal}
                className="absolute top-8 right-8 p-3 rounded-full hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="space-y-10">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-accent/10 rounded-full text-[9px] font-bold text-accent uppercase tracking-widest">{activeProduct.category}</span>
                    <span className="px-3 py-1 bg-primary/5 rounded-full text-[9px] font-bold text-primary uppercase tracking-widest">{activeProduct.grade || 'A-Grade'}</span>
                  </div>
                  <h3 className="text-4xl font-serif font-bold text-primary italic">{activeProduct.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       <Tag className="w-3.5 h-3.5" />
                       Price Indicator
                    </div>
                    <div className="text-2xl font-bold text-primary">
                        {formatCurrency(getNumericPrice(activeProduct.priceRange))}
                        <span className="text-xs text-gray-400 font-normal"> / Kg</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                       <ShoppingCart className="w-3.5 h-3.5" />
                       Minimum Order
                    </div>
                    <div className="text-2xl font-bold text-primary">
                        {activeProduct.moq}
                        <span className="text-xs text-gray-400 font-normal"> Kg</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    <Layers className="w-4 h-4 text-accent" />
                    Product Specifications
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center border border-transparent hover:border-accent/10 transition-colors">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Origin</span>
                      <span className="text-xs font-bold text-primary flex items-center gap-1.5 uppercase">
                        <MapPin className="w-3 h-3 text-accent" /> {activeProduct.origin}
                      </span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center border border-transparent hover:border-accent/10 transition-colors">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Purity</span>
                      <span className="text-xs font-bold text-primary uppercase">99.5% Min</span>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center border border-transparent hover:border-accent/10 transition-colors md:col-span-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">Certifications</span>
                      <div className="flex gap-2">
                        {parseCerts(activeProduct.certs || '').map(c => (
                           <span key={c} className="text-[9px] font-bold text-accent bg-accent/5 px-2 py-1 rounded border border-accent/10 uppercase">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-4 h-4 text-accent" />
                    Market Details
                  </h4>
                  <p className="text-sm text-gray-500 leading-relaxed italic border-l-2 border-accent pl-6 py-1">
                    "{activeProduct.description || 'Premium grade commodity sourced from high-yield farm clusters. Guaranteed quality with international standard packaging.'}"
                  </p>
                </div>

                <div className="flex gap-4 pt-6">
                  <button 
                    onClick={() => {
                        closeDetailModal();
                        openEnquiryModal(activeProduct.name);
                    }}
                    className="flex-1 btn-primary py-4.5 flex items-center justify-center gap-3 text-xs font-bold tracking-widest uppercase hover:shadow-2xl transition-all shadow-xl"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Get Free Quote</span>
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
