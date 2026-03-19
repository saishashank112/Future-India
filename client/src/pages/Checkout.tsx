import { Truck, MessageCircle, Send, Globe, MapPin, Navigation } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
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
    latitude: null as number | null,
    longitude: null as number | null,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLocation = (): Promise<{lat: number, lng: number}> => {
    return new Promise((resolve, reject) => {
      if (!("geolocation" in navigator)) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => reject(err),
        { timeout: 10000 }
      );
    });
  };

  const handleGetLocation = async () => {
    try {
      const { lat, lng } = await fetchLocation();
      setFormData(prev => ({ 
        ...prev, 
        latitude: lat, 
        longitude: lng,
        address: prev.address || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)} (Captured)`
      }));
    } catch (error) {
      console.error("Location error:", error);
      alert("Unable to fetch precise location. Please enter address manually.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        alert("Please login to proceed with order");
        return;
    }
    
    setIsSubmitting(true);

    let finalLat = formData.latitude;
    let finalLng = formData.longitude;

    // Auto-fetch location if not already captured
    if (!finalLat) {
        try {
            const loc = await fetchLocation();
            finalLat = loc.lat;
            finalLng = loc.lng;
        } catch (e) {
            console.warn("Auto-location failed, proceeding with manual address");
        }
    }

    try {
      const res = await fetch('http://localhost:5001/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          totalAmount: subtotal,
          shippingDetails: {
              ...formData,
              latitude: finalLat,
              longitude: finalLng
          },
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
        navigate('/payment', { state: { amount: subtotal, orderCode: data.orderCode, orderId: data.orderId } });
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
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary italic mb-4">Trade Checkout</h1>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs font-bold underline underline-offset-8 decoration-accent/30 decoration-2">Provide your logistical endpoints for export protocol.</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-16 items-start">
          <div className="lg:col-span-2 space-y-12">
            
            <section className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-sm border border-gray-100">
               <div className="flex items-center gap-6 mb-12">
                   <div className="w-14 h-14 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                        <Truck className="w-7 h-7" />
                   </div>
                   <div>
                        <h3 className="text-3xl font-serif font-bold text-primary italic">Export Destination</h3>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Global delivery protocol endpoints</p>
                   </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Receiver Identity</label>
                        <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} type="text" className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-bold text-primary shadow-inner" placeholder="Full legal name" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Country / ISO</label>
                        <input required value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} type="text" className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-bold text-primary shadow-inner" placeholder="Target nation" />
                    </div>
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">Commercial Hotline</label>
                        <input required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} type="tel" className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-bold text-primary shadow-inner" placeholder="+XX XXXXXXXXXX" />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Domicile Address</label>
                        </div>
                        <div className="relative group">
                            <textarea 
                                required 
                                value={formData.address} 
                                onChange={e => setFormData({...formData, address: e.target.value})} 
                                rows={3} 
                                className="w-full px-8 py-5 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-sm font-bold text-primary shadow-inner resize-none pl-12" 
                                placeholder="Full street address and logistical details..." 
                            />
                            <MapPin className="w-4 h-4 text-gray-300 absolute left-5 top-6 group-focus-within:text-accent transition-colors" />
                        </div>
                    </div>
               </div>
            </section>
          </div>

          <div className="lg:sticky lg:top-32 space-y-12">
            <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-2xl space-y-10">
               <h3 className="text-2xl font-serif font-bold text-primary italic border-b border-gray-50 pb-6">Consignment</h3>
               
               <div className="space-y-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                   {items.map(item => (
                       <div key={item.id} className="flex justify-between items-center group">
                           <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                                   <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                               </div>
                               <div>
                                   <div className="text-[10px] font-bold text-primary uppercase">{item.name}</div>
                                   <div className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">x{item.quantity} Volume</div>
                               </div>
                           </div>
                           <span className="text-xs font-bold text-primary tabular-nums">{formatCurrency(item.price * item.quantity)}</span>
                       </div>
                   ))}
               </div>

               <div className="space-y-6 pt-10 border-t border-gray-50">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Consignment Value</span>
                        <span className="text-lg font-serif font-bold text-primary italic">{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-end mt-4 pt-6 border-t-2 border-accent/20">
                        <span className="text-primary font-serif font-bold text-3xl italic">Settlement</span>
                        <span className="text-3xl font-serif font-bold text-accent italic">{formatCurrency(subtotal)}</span>
                    </div>
               </div>

               <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-6 rounded-[2.5rem] flex items-center justify-center gap-4 text-xs font-bold tracking-widest uppercase shadow-2xl group transition-all"
               >
                 {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                 ) : (
                    <>
                        <span>Place Export Order</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform text-accent" />
                    </>
                 )}
               </button>
            </div>

            <div className="bg-primary p-12 rounded-[3.5rem] shadow-xl text-white relative overflow-hidden group">
               <div className="relative z-10 space-y-6">
                   <h4 className="text-2xl font-serif font-bold italic leading-tight text-accent">Real-time Location Protocol</h4>
                   <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em] leading-relaxed">Location data is automatically synchronized upon order placement for logistical transparency.</p>
               </div>
               <div className="absolute -bottom-10 -right-10 opacity-10">
                    <Globe className="w-40 h-40" />
               </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
