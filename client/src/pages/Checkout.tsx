import { Truck, MessageCircle, Send, Globe, MapPin, Navigation } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { items, subtotal, clearCart } = useCart();
  const { formatCurrency } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    country: user?.country || '',
    address: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGetLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ ...prev, address: `Latitude: ${latitude}, Longitude: ${longitude} (Location Captured)` }));
      }, (error) => {
        console.error("Location error:", error);
        alert("Unable to retrieve location. Please check browser permissions.");
      });
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        alert("Please login to proceed with order");
        return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || 1, // Mock user ID if not logged in
          totalAmount: subtotal,
          shippingDetails: formData,
          items: items.map(item => ({
            product_id: item.product_id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image
          }))
        })
      });

      const data = await res.json();
      if (res.ok) {
        clearCart();
        navigate('/payment', { state: { amount: subtotal, orderCode: data.orderCode } });
      }
    } catch (error) {
      console.error('Order Submission Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="pt-32 pb-24 bg-background">
      <div className="max-w-[1400px] mx-auto px-6">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary italic mb-4">Checkout Details</h1>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs font-bold underline underline-offset-8 decoration-accent/30 decoration-2">Please provide your shipping and contact information.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2 space-y-12">
            
            {/* Shipping Section */}
            <section className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-sm border border-gray-100">
               <div className="flex items-center gap-6 mb-12">
                   <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                        <Truck className="w-7 h-7" />
                   </div>
                   <div>
                        <h3 className="text-3xl font-serif font-bold text-primary italic">Shipping Address</h3>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Enter where you want the products delivered.</p>
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Full Name</label>
                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-bold text-primary shadow-inner" placeholder="Your full name" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Country</label>
                        <input required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} type="text" className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-bold text-primary shadow-inner" placeholder="Receiver’s Country" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Phone Number</label>
                        <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-bold text-primary shadow-inner" placeholder="Direct Contact / WhatsApp" />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Street Address</label>
                            <button 
                                type="button"
                                onClick={handleGetLocation}
                                className="flex items-center gap-1.5 text-[9px] font-bold text-accent uppercase tracking-widest hover:underline"
                            >
                                <Navigation className="w-3 h-3" /> Use Current Location
                            </button>
                        </div>
                        <div className="relative group">
                            <textarea 
                                required 
                                value={formData.address} 
                                onChange={e => setFormData({...formData, address: e.target.value})} 
                                rows={3} 
                                className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-bold text-primary shadow-inner resize-none pl-12" 
                                placeholder="Enter your full delivery address..." 
                            />
                            <MapPin className="w-4 h-4 text-gray-300 absolute left-5 top-6 group-focus-within:text-accent transition-colors" />
                        </div>
                    </div>
               </div>
            </section>

          </div>

          {/* Sidebar Area */}
          <div className="lg:sticky lg:top-32 space-y-12">
            <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl space-y-10">
               <h3 className="text-2xl font-serif font-bold text-primary italic border-b border-gray-50 pb-6">Order Items</h3>
               
               <div className="space-y-8">
                   {items.map(item => (
                       <div key={item.id} className="flex justify-between items-center group">
                           <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden relative shrink-0">
                                   <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                               </div>
                               <div>
                                   <div className="text-[10px] font-bold text-primary uppercase">{item.name}</div>
                                   <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{item.quantity} Units</div>
                               </div>
                           </div>
                           <span className="text-xs font-bold text-primary">{formatCurrency(item.price * item.quantity)}</span>
                       </div>
                   ))}
               </div>

               <div className="space-y-6 pt-10 border-t border-gray-50">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Items</span>
                        <span className="text-lg font-serif font-bold text-primary italic">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center text-green-500">
                        <span className="text-[10px] font-bold uppercase tracking-widest">Shipping</span>
                        <span className="text-sm font-bold italic">$0.00</span>
                    </div>
                    <div className="flex justify-between items-end mt-4 pt-6 border-t-2 border-accent/20">
                        <span className="text-primary font-serif font-bold text-3xl italic">Grand Total</span>
                        <span className="text-3xl font-serif font-bold text-accent italic">{formatCurrency(subtotal)}</span>
                    </div>
               </div>

               <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-6 rounded-[2.5rem] flex items-center justify-center gap-4 text-xs font-bold tracking-widest uppercase shadow-2xl group overflow-hidden"
               >
                 {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                 ) : (
                    <>
                        <span>Complete Order</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </>
                 )}
               </button>
            </div>

            <div className="bg-primary p-12 rounded-[3.5rem] shadow-xl text-white relative overflow-hidden group">
               <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
               <div className="relative z-10 space-y-6">
                   <h4 className="text-2xl font-serif font-bold italic leading-tight">Need Logistics Assistance?</h4>
                   <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] leading-relaxed">Connect directly with our Trade Facilitation Officers on WhatsApp.</p>
                   <a target="_blank" href="https://wa.me/918037882249" className="flex items-center gap-3 text-accent text-xs font-bold uppercase tracking-widest hover:translate-x-2 transition-transform cursor-pointer">
                       <MessageCircle className="w-5 h-5" />
                       Talk to Port Control →
                   </a>
               </div>
               <div className="absolute -bottom-10 -right-10 opacity-10">
                    <Globe className="w-40 h-40 animate-pulse" />
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
