import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ShieldCheck, Truck, ArrowLeft, FileDown, MessageSquare, Tag, ShoppingCart, CheckCircle2 } from 'lucide-react';
import PremiumImage from '../components/ui/PremiumImage';
import { useModal } from '../context/ModalContext';
import { useLanguage } from '../context/LanguageContext';

const ProductDetail = () => {
  const [activeTab, setActiveTab] = useState('description');
  const { openEnquiryModal } = useModal();
  const { t } = useLanguage();
  const { id } = useParams();

  // Mock data for the specific product (In real app, fetch based on id)
  const product = {
    id: id || 1,
    name: 'Organic Turmeric Finger',
    category: 'Spices',
    priceRange: '₹120 – ₹150',
    moq: '500',
    unit: 'Kg',
    images: ['https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5'],
    specs: [
      { label: 'Grade', value: 'A1 Premium / FAQ' },
      { label: 'Moisture', value: 'Max 10%' },
      { label: 'Curcumin', value: '5.5% Min' },
      { label: 'Origin', value: 'Erode, Tamil Nadu' },
      { label: 'Loadability', value: '18 MT per 20ft FCL' },
      { label: 'Crop Year', value: '2025 (Current)' },
    ],
    features: [
      { icon: Globe, title: 'Global Compliance', text: 'Meets EU & US FDA norms.' },
      { icon: ShieldCheck, title: 'Quality Assured', text: 'SGS/Bureau Veritas certified.' },
      { icon: Truck, title: 'Fast Logistics', text: 'Port-to-Port in 15-30 days.' },
    ]
  };

  return (
    <div className="pt-32 pb-24 bg-background">
      <div className="max-w-[1240px] mx-auto px-6">
        <Link to="/products" className="inline-flex items-center space-x-3 text-primary font-bold text-xs uppercase tracking-widest mb-12 hover:text-accent transition-all group">
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
          <span>Return to Catalogue</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Product Images */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="aspect-square rounded-[2rem] overflow-hidden bg-white border border-gray-100 shadow-xl"
            >
              <PremiumImage src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="aspect-square rounded-xl overflow-hidden bg-white border border-gray-50 opacity-50 hover:opacity-100 cursor-pointer transition-all hover:shadow-lg">
                  <PremiumImage src={product.images[0]} alt="Thumbnail" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="mb-10">
              <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 leading-tight">{product.name}</h1>
              
              {/* Pricing & MOQ Badges */}
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="px-5 py-3 bg-accent/10 border border-accent/20 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-accent uppercase tracking-wider">Target Price</div>
                    <div className="text-sm font-bold text-primary">{product.priceRange} / {product.unit}</div>
                  </div>
                </div>
                
                <div className="px-5 py-3 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <ShoppingCart className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Min. Order</div>
                    <div className="text-sm font-bold text-primary">{product.moq} {product.unit}</div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <span className="flex items-center text-[10px] font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100 uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3 mr-2" />
                  Premium Export Grade
                </span>
                <span className="flex items-center text-[10px] font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 uppercase tracking-widest">
                  <Globe className="w-3 h-3 mr-2" />
                  Origin: {product.specs[3].value}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-10 pb-10 border-b border-gray-100 mb-10">
              {product.specs.map((spec) => (
                <div key={spec.label} className="space-y-1">
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-[0.2em]">{spec.label}</div>
                  <div className="text-lg font-bold text-primary">{spec.value}</div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={() => openEnquiryModal(product.name)}
                className="btn-primary flex-1 py-4 flex items-center justify-center space-x-3 text-sm shadow-xl"
              >
                <MessageSquare className="w-5 h-5" />
                <span>{t('get_enquiry')}</span>
              </button>
              <button className="btn-outline flex-1 py-4 flex items-center justify-center space-x-3 text-sm bg-white">
                <FileDown className="w-5 h-5" />
                <span>Technical Sheet</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-6 p-8 bg-white rounded-[2rem] shadow-sm border border-gray-100">
              {product.features.map((feature) => (
                <div key={feature.title} className="text-center">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 mx-auto flex items-center justify-center mb-3">
                    <feature.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="text-[9px] font-bold text-primary uppercase tracking-widest mb-1">{feature.title}</div>
                  <div className="text-[8px] text-gray-400 leading-tight uppercase font-medium">{feature.text}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-24">
          <div className="flex space-x-1 border-b border-gray-100 mb-12">
            {['description', 'export standards', 'packaging'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-4 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab ? 'text-primary' : 'text-gray-400 hover:text-primary'
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-accent rounded-t-full" />
                )}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div 
                  key="desc"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6 text-gray-500 font-light leading-relaxed"
                >
                  <p className="text-xl font-serif text-primary italic leading-snug border-l-4 border-accent pl-6">
                    "Our {product.name} is meticulously processed to retain its natural essential oils and vibrant characteristics, sourced directly from verified farming clusters in {product.specs[3].value}."
                  </p>
                  <p>
                    Future India Exim ensures that every batch meets rigorous international food safety standards. We maintain complete vertical integration from farm levels, providing transparency and consistency that global buyers demand. Our processing units utilize advanced dehumidification and temperature-controlled storage to prevent any loss of potency.
                  </p>
                </motion.div>
              )}
              {activeTab === 'export standards' && (
                <motion.div 
                  key="standards"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                >
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-primary">Technical Parameters</h3>
                    <ul className="space-y-3">
                      {['Moisture: Max 10%', 'Purity: 99.5% Min', 'Foreign Matter: Max 0.5%', 'Total Ash: Max 7%', 'Acid Insoluble Ash: Max 1%'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-accent" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-serif font-bold text-primary">Compliance</h3>
                    <ul className="space-y-3">
                      {['Aflatoxin: As per EU norms', 'Salmonella: Absent in 25g', 'Pesticide Residue: Verified', 'Non-GMO Certified', 'Phytosanitary Certified'].map((item, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
              {activeTab === 'packaging' && (
                <motion.div 
                  key="packing"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {[
                    { title: 'Standard Bag', desc: '25kg New PP/Jute Bags with inner liner.' },
                    { title: 'Bulk Export', desc: '500kg - 1000kg Jumbo Bags available.' },
                    { title: 'Consumer Ready', desc: 'Custom 500g - 5kg retail packaging.' }
                  ].map((p, i) => (
                    <div key={i} className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
                      <h4 className="font-serif font-bold text-primary mb-2">{p.title}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed font-light uppercase tracking-wider">{p.desc}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
