import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, Tag, MapPin, Zap, CheckCircle2 } from 'lucide-react';
import PremiumImage from '../components/ui/PremiumImage';
import { useModal } from '../context/ModalContext';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../context/ModalContext';
import { getApiUrl } from '../config/api';
import { DUMMY_PRODUCTS } from '../data/dummyData';

const categories = ['All', 'Spices', 'Fruits', 'Vegetables', 'Grains', 'Seeds', 'Powders'];

const Products = () => {
  const [productsList, setProductsList] = useState<Product[]>(DUMMY_PRODUCTS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { openDetailModal } = useModal();
  const { t, formatCurrency } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Fetching products...');
    fetch(getApiUrl('/products'))
      .then(res => res.json())
      .then(json => {
        console.log('API Response:', json);
        if (json.data && Array.isArray(json.data) && json.data.length > 0) {
          console.log('Updating products list with', json.data.length, 'items');
          setProductsList(json.data);
        } else {
          console.log('API returned empty or invalid data, keeping dummy data');
        }
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        console.log('Error encountered, staying with dummy data');
      });
  }, []);

  const filteredProducts = productsList.filter(p => {
    const categoryMatch = activeCategory === 'All' || p.category.toLowerCase().trim() === activeCategory.toLowerCase().trim();
    const searchMatch = p.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
    return categoryMatch && searchMatch;
  });

  const [addedId, setAddedId] = useState<number | null>(null);

  const handleAddToCart = async (product: Product) => {
    await addToCart(product, 1);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const handleBuyNow = async (product: Product) => {
     await addToCart(product, 1);
     navigate('/cart');
  };

  return (
    <div className="pt-32 pb-24 bg-background">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="mb-16">
          <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">{t('our_portfolio')}</span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-10">Global Commodity Exchange</h1>
          
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    activeCategory === cat ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-gray-400 border-gray-100 hover:bg-gray-50 hover:text-primary'
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
                className="w-full pl-12 pr-5 py-4 rounded-xl border border-gray-100 bg-white focus:outline-none focus:ring-1 focus:ring-accent/50 transition-all font-medium text-primary text-sm shadow-sm"
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
              className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 relative flex flex-col"
            >
              <div 
                  className="relative aspect-[4/3] overflow-hidden bg-gray-50 cursor-pointer"
                  onClick={() => openDetailModal(product)}
              >
                <PremiumImage src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-bold text-primary uppercase tracking-widest shadow-sm">
                  {product.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <div className="flex-grow">
                  <h3 
                    onClick={() => openDetailModal(product)}
                    className="text-lg font-serif font-bold text-primary mb-5 cursor-pointer hover:text-accent transition-colors line-clamp-2 leading-snug"
                  >
                    {product.name}
                  </h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between border-b justify-between border-gray-50 pb-2">
                        <div className="flex items-center gap-2 text-primary">
                          <Tag className="w-3.5 h-3.5 text-accent" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Pricing</span>
                        </div>
                        <span className="text-sm font-bold text-primary">{product.price ? formatCurrency(product.price) : product.priceRange} <span className="text-[10px] font-normal text-gray-400">/Kg</span></span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                        <div className="flex items-center gap-2 text-primary">
                          <ShoppingCart className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Min. Volume</span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-600">{product.moq}</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                          <MapPin className="w-3.5 h-3.5 text-primary" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Origin</span>
                        </div>
                        <span className="text-[11px] font-bold text-gray-600 truncate max-w-[100px] text-right" title={product.origin}>{product.origin}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button 
                    onClick={() => handleAddToCart(product)}
                    className={`flex-1 py-3 rounded-xl transition-all text-[10px] border font-bold uppercase tracking-widest flex items-center justify-center gap-2 ${
                      addedId === product.id 
                      ? 'bg-green-500 text-white border-green-500' 
                      : 'bg-gray-50 text-primary border-gray-100 hover:bg-primary hover:text-white hover:border-primary'
                    }`}
                  >
                    {addedId === product.id ? <><CheckCircle2 className="w-3.5 h-3.5" /> Added</> : 'Add to Cart'}
                  </button>
                  <button 
                    onClick={() => handleBuyNow(product)}
                    className="flex-1 py-3 rounded-xl bg-primary text-white hover:bg-accent transition-all text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    <span>Buy Now</span>
                    <Zap className="w-3 h-3" />
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
              className="px-8 py-3 rounded-full border border-gray-200 text-sm font-bold uppercase tracking-widest hover:border-primary transition-all text-primary"
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
