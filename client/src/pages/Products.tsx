import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, ArrowUpRight, ShoppingCart, Tag } from 'lucide-react';
import PremiumImage from '../components/ui/PremiumImage';
import { useModal } from '../context/ModalContext';
import { useLanguage } from '../context/LanguageContext';
import type { Product } from '../context/ModalContext';

const categories = ['All', 'Spices', 'Seeds', 'Powders'];

const Products = () => {
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { openEnquiryModal, openDetailModal } = useModal();
  const { t } = useLanguage();

  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(json => {
        if (json.data) setProductsList(json.data);
      })
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  const filteredProducts = productsList.filter(p => 
    (activeCategory === 'All' || p.category === activeCategory) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pt-32 pb-24 bg-background">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-16">
          <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">{t('our_portfolio')}</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-10">Global Commodity Exchange</h1>
          
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeCategory === cat ? 'bg-primary text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            
            <div className="relative w-full lg:w-[350px]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
              <input 
                type="text" 
                placeholder="Find a product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-5 py-3 rounded-xl border-none bg-gray-50 focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all font-medium text-primary text-sm shadow-inner"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <motion.div
              layout
              key={product.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-500"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <PremiumImage src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                  <button 
                    onClick={() => openDetailModal(product)}
                    className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center transform scale-0 group-hover:scale-100 transition-all duration-500 shadow-xl"
                  >
                    <ArrowUpRight className="w-6 h-6" />
                  </button>
                </div>
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold text-primary uppercase tracking-[0.1em]">
                  {product.category}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-serif font-bold text-primary mb-4 group-hover:text-accent transition-colors line-clamp-1">{product.name}</h3>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-accent/10 rounded flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-accent" />
                      <span className="text-[10px] font-bold text-accent uppercase">Price</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{product.priceRange} / Kg</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-primary/5 rounded flex items-center gap-1.5">
                      <ShoppingCart className="w-3 h-3 text-primary" />
                      <span className="text-[10px] font-bold text-primary uppercase">MOQ</span>
                    </div>
                    <span className="text-xs font-semibold text-gray-600">{product.moq} Kg</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                  <button 
                    onClick={() => openDetailModal(product)}
                    className="flex-1 text-center py-2.5 rounded-lg border border-primary/10 text-[10px] font-bold text-primary hover:bg-gray-50 transition-all uppercase"
                  >
                    Details
                  </button>
                  <button 
                    onClick={() => openEnquiryModal(product.name)}
                    className="flex-1 bg-primary text-white py-2.5 rounded-lg text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-accent transition-all uppercase"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Enquiry</span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <h3 className="text-2xl font-serif font-bold text-primary mb-4">No products found</h3>
            <p className="text-gray-500 mb-8">Try adjusting your search or filters.</p>
            <button 
              onClick={() => {setActiveCategory('All'); setSearchQuery('');}}
              className="btn-outline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
