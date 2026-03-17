import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, Phone, Globe, ShoppingBag, Layers } from 'lucide-react';
import { useState, useEffect } from 'react';
import PremiumImage from './PremiumImage';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: string;
  initialImage?: string;
}

const countries = [
  "India", "United States", "United Kingdom", "United Arab Emirates", "Saudi Arabia", 
  "Germany", "France", "Japan", "China", "Brazil", "Australia", "Canada", "Singapore", 
  "Vietnam", "Thailand", "Malaysia", "Indonesia", "Egypt", "South Africa", "Russia"
].sort();

const EnquiryModal = ({ isOpen, onClose, initialProduct = "", initialImage = "" }: EnquiryModalProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    countryCode: '+91',
    country: '',
    product: initialProduct,
    food_item: initialProduct, // Default displayed food name
    quantity: '',
    unit: 'Kilogram',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (initialProduct) {
      setFormData(prev => ({ 
        ...prev, 
        product: initialProduct,
        food_item: initialProduct 
      }));
    }
  }, [initialProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          country: `${formData.country} (${formData.countryCode} ${formData.mobile})`,
          food_item: formData.food_item,
          type: formData.unit,
          message: formData.message
        }),
      });

      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setSubmitted(false);
          onClose();
        }, 2500);
      }
    } catch (error) {
      console.error('Error submitting enquiry:', error);
    } finally {
      setLoading(false);
    }
  };

  const productImages: Record<string, string> = {
    'Turmeric Finger': 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5',
    'Black Pepper': 'https://images.unsplash.com/photo-1599940859674-a7fef05b94ae',
    'Cumin Seeds': 'https://images.unsplash.com/photo-1599307734111-923f1bdc8621',
    'Organic Turmeric Finger': 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5'
  };

  const productImage = initialImage || productImages[formData.food_item] || 'https://images.unsplash.com/photo-1506484334358-16e6d1c8106a';

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col md:flex-row min-h-[600px] max-h-[90vh]"
          >
            {/* Left side: Information/Image */}
            <div className="md:w-5/12 bg-gray-50 relative overflow-hidden hidden md:block border-r border-gray-100">
              <PremiumImage src={productImage} alt="Product" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent flex flex-col justify-end p-10 text-white">
                <span className="text-accent font-bold tracking-[0.2em] uppercase text-[10px] mb-2">Selected Product</span>
                <h4 className="text-3xl font-serif font-bold mb-4">{formData.food_item || 'Export Quality Goods'}</h4>
                <div className="space-y-4 opacity-80">
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-accent" />
                    <span>Global Shipping Available</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Layers className="w-4 h-4 text-accent" />
                    <span>Customizable Packaging</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Form */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto relative">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-3 rounded-full hover:bg-gray-100 transition-colors z-10"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center animate-bounce">
                    <Send className="w-10 h-10" />
                  </div>
                  <h3 className="text-3xl font-serif font-bold text-primary italic">Enquiry Received</h3>
                  <p className="text-gray-500 max-w-sm">Thank you for your interest. Our export managers are processing your request and will provide a quote within 12 hours.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-primary mb-3">Export Enquiry</h3>
                    <p className="text-gray-400 text-sm font-medium">Please provide your requirements for a detailed commercial quotation.</p>
                  </div>

                  <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                      <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all text-sm font-medium" placeholder="Enter your name" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Email Address</label>
                      <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all text-sm font-medium" placeholder="email@company.com" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Target Country</label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        <select required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} className="w-full pl-12 pr-5 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all text-sm font-medium appearance-none">
                          <option value="">Select Country</option>
                          {countries.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Mobile No.</label>
                      <div className="flex gap-2">
                        <select value={formData.countryCode} onChange={e => setFormData({...formData, countryCode: e.target.value})} className="w-24 px-2 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all text-xs font-bold text-primary">
                          <option value="+91">🇮🇳 +91</option>
                          <option value="+1">🇺🇸 +1</option>
                          <option value="+44">🇬🇧 +44</option>
                          <option value="+971">🇦🇪 +971</option>
                        </select>
                        <input required type="tel" value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="flex-1 px-5 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all text-sm font-medium" placeholder="Mobile Number" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Food Item</label>
                      <div className="relative">
                        <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none" />
                        <input required type="text" value={formData.food_item} onChange={e => setFormData({...formData, food_item: e.target.value})} className="w-full pl-12 pr-5 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all text-sm font-medium" placeholder="e.g. Organic Turmeric Finger" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Quantity & Unit</label>
                      <div className="flex gap-2">
                        <input required type="number" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} className="flex-1 px-5 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all text-sm font-medium" placeholder="e.g. 500" />
                        <select value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} className="w-32 px-2 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all text-xs font-bold text-primary">
                          <option value="Kilogram">Kg</option>
                          <option value="Metric Ton">MT</option>
                          <option value="Containers">FCL</option>
                        </select>
                      </div>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Requirement Details</label>
                      <textarea rows={2} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-transparent focus:border-accent focus:bg-white focus:outline-none transition-all text-sm font-medium resize-none" placeholder="Describe your specifics (packaging, certifications, etc.)" />
                    </div>
                    
                    <button disabled={loading} type="submit" className="md:col-span-2 btn-primary py-4.5 flex items-center justify-center space-x-3 text-sm font-bold tracking-widest uppercase mt-4 hover:shadow-2xl transition-all group">
                      {loading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <span>Submit Official Enquiry</span>
                          <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default EnquiryModal;
