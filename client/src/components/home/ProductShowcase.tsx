import { getApiUrl } from '../../config/api';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck, MapPin, MessageSquare, Tag, ShoppingCart } from 'lucide-react';
import PremiumImage from '../ui/PremiumImage';
import { useModal } from '../../context/ModalContext';
import { useLanguage } from '../../context/LanguageContext';

interface Product {
  id: number;
  name: string;
  category: string;
  priceRange: string;
  moq: string;
  image: string;
  grade: string;
  origin: string;
  certs: string;
  description: string;
}

const ProductShowcase = () => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { openEnquiryModal } = useModal();
  const { t, formatCurrency } = useLanguage();

  useEffect(() => {
    fetch(getApiUrl('/products'))
      .then(res => res.json())
      .then(json => {
        if (json.data) setProductsList(json.data);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const parseCerts = (certsStr: string) => {
    return certsStr ? certsStr.split(',').map(s => s.trim()) : [];
  };

  const getNumericPrice = (range?: string) => {
    if (!range) return 0;
    // Extract first number from "₹120 - ₹150"
    const match = range.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  return (
    <section className="py-32 bg-white" id="products">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-accent font-bold tracking-widest uppercase text-[10px] mb-4 block">Premium Catalog</span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-8 leading-tight italic">{t('catalog_title')}</h2>
          <p className="text-lg text-gray-500 font-light leading-relaxed">
            {t('catalog_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {productsList.map((product: Product) => (
            <div 
              key={product.id}
              className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden bg-white shadow-sm ${
                expandedId === product.id ? 'border-primary/5 shadow-2xl' : 'border-gray-50'
              }`}
            >
              <div 
                className="flex flex-col md:flex-row cursor-pointer group"
                onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
              >
                <div className="w-full md:w-2/5 h-64 md:h-auto overflow-hidden bg-gray-50">
                  <PremiumImage src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="w-full md:w-3/5 p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-accent font-bold text-[9px] uppercase tracking-[0.2em]">{product.category}</div>
                      <div className="flex gap-2">
                        <Tag className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[10px] font-bold text-primary">
                          {formatCurrency(getNumericPrice(product.priceRange))}
                        </span>
                      </div>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-primary mb-6 transition-colors group-hover:text-accent italic">{product.name}</h3>
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      <div className="space-y-1">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Grade</span>
                        <span className="font-semibold text-primary block text-xs">{product.grade}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">Origin</span>
                        <span className="font-semibold text-primary block text-xs flex items-center gap-1.5">
                          <MapPin className="w-3 h-3 text-accent" /> {product.origin}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <button className="flex items-center space-x-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                      <span>{expandedId === product.id ? 'View Less' : 'View Details'}</span>
                      <ChevronDown className={`w-3.5 h-3.5 text-accent transition-transform duration-500 ${expandedId === product.id ? 'rotate-180' : ''}`} />
                    </button>
                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                    </div>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {expandedId === product.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.5, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden bg-gray-50/50"
                  >
                    <div className="px-10 pb-10 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10 pt-8">
                        <div>
                          <h4 className="font-bold text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-6 font-sans">Quality Target</h4>
                          <ul className="space-y-4 text-xs text-primary font-bold">
                            <li className="flex items-center gap-1.5">MOQ: <span className="text-accent underline">{product.moq}</span></li>
                            <li className="flex items-center gap-1.5">Purity: <span>99.5% Min</span></li>
                            <li className="flex items-center gap-1.5">Inspection: <span className="text-gray-400">SGS / Third Party</span></li>
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-bold text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-6 font-sans">Compliance</h4>
                          <div className="flex flex-wrap gap-2">
                            {parseCerts(product.certs).map(c => (
                              <span key={c} className="px-3 py-1.5 bg-white border border-gray-100 rounded-lg text-[9px] font-bold text-primary uppercase tracking-wider shadow-sm">{c}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-6 font-sans">Packaging</h4>
                          <ul className="space-y-3 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <li className="flex items-center gap-2 italic">Standard 25/50 Kg PP Bags</li>
                            <li className="flex items-center gap-2 italic">Custom OEM Branding</li>
                            <li className="flex items-center gap-2 italic">Laminated Moisture Proof</li>
                          </ul>
                        </div>
                      </div>
                      
                      <p className="text-gray-500 text-sm leading-relaxed mb-10 font-light italic border-l-2 border-accent pl-8 py-2">
                        "{product.description}"
                      </p>

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button 
                          onClick={() => openEnquiryModal(product.name)}
                          className="btn-primary flex-1 py-4 flex items-center justify-center gap-3 text-xs"
                        >
                          <MessageSquare className="w-5 h-5" />
                          <span>{t('get_enquiry')}</span>
                        </button>
                        <button className="btn-outline flex-1 py-4 flex items-center justify-center gap-3 text-xs bg-white">
                          <ShoppingCart className="w-5 h-5" />
                          <span>Reserve Batch</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;
