import { getApiUrl } from '../../config/api';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShieldCheck, MapPin, MessageSquare, Tag, ShoppingCart } from 'lucide-react';
import PremiumImage from '../ui/PremiumImage';
import { useModal } from '../../context/ModalContext';
import { useLanguage } from '../../context/LanguageContext';
import { DUMMY_PRODUCTS } from '../../data/dummyData';

interface Product {
  id: number;
  name: string;
  category: string;
  grade: string;
  origin: string;
  priceRange: string;
  moq: string;
  certs: string;
  image: string;
  description: string;
}

const ProductShowcase = () => {
  const [productsList, setProductsList] = useState<Product[]>(DUMMY_PRODUCTS as unknown as Product[]);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const { openEnquiryModal } = useModal();
  const { t, formatCurrency } = useLanguage();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    fetch(getApiUrl('/products'))
      .then(res => res.json())
      .then(json => {
        if (json.data && json.data.length > 0) setProductsList(json.data);
      })
      .catch(err => console.error('Error fetching products:', err));
      
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const getNumericPrice = (range?: string) => {
    if (!range) return 0;
    const match = range.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  const displayedProducts = isMobile ? productsList.slice(0, 3) : productsList.slice(0, 4);

  return (
    <section className="py-20 bg-white" id="products">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-accent font-bold tracking-widest uppercase text-[10px] mb-4 block">Premium Catalog</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">{t('catalog_title')}</h2>
          <p className="text-base text-gray-500 font-light leading-relaxed">
            {t('catalog_subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedProducts.map((product: Product) => (
            <div 
              key={product.id}
              className={`rounded-[2.5rem] border transition-all duration-500 overflow-hidden bg-white shadow-sm ${
                expandedId === product.id ? 'border-primary/5 shadow-2xl' : 'border-gray-50'
              }`}
            >
              <div 
                className="flex flex-col cursor-pointer group"
                onClick={() => setExpandedId(expandedId === product.id ? null : product.id)}
              >
                <div className="w-full h-56 overflow-hidden bg-gray-50">
                  <PremiumImage src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="w-full p-6 flex flex-col justify-between">
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
                    <h3 className="text-xl font-serif font-bold text-primary mb-4 transition-colors group-hover:text-accent leading-tight">{product.name}</h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
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
                      <div className="flex flex-wrap gap-x-8 gap-y-4 mb-8 pt-4">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">MOQ:</span>
                          <span className="text-sm font-bold text-primary">{product.moq}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Certs:</span>
                          <span className="text-[10px] font-bold text-accent uppercase">{product.certs}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-500 text-sm leading-relaxed mb-10 font-light border-l-2 border-accent pl-8 py-2">
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
