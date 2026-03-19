import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User as UserIcon, 
  LogOut, 
  Package, 
  Settings, 
  Mail, 
  Phone, 
  Globe, 
  Building2, 
  Save, 
  X, 
  Clock, 
  MapPin,
  TrendingUp,
  Activity,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  id?: number;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  order_code: string;
  total_amount: number;
  status: string;
  payment_status: string;
  created_at: string;
  items: string;
  shipping_details?: string;
}

// Simple Sparkline Component (Mini Chart)
const MiniSparkline = ({ color = "#A81D23" }) => (
  <svg className="w-12 h-6" viewBox="0 0 50 20">
    <path 
      d="M0,15 L10,12 L20,18 L30,5 L40,10 L50,0" 
      fill="none" 
      stroke={color} 
      strokeWidth="2" 
      strokeLinecap="round"
    />
  </svg>
);

const MyAccount = () => {
  const { user, logout, updateProfile } = useAuth();
  const { formatCurrency } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('orders'); // Default to History for "Execution" focus
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

  const toggleOrder = (id: number) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const [formData, setFormData] = useState<Partial<User>>(() => ({
     name: user?.name || '',
     email: user?.email || '',
     phone: user?.phone || '',
     company_name: user?.company_name || '',
     country: user?.country || '',
  }));

  useEffect(() => {
    if (!user) {
       navigate('/login');
       return;
    }
    if ((user.role as string) === 'admin') {
       navigate('/admin');
       return;
    }

    const fetchOrders = async () => {
       try {
          const res = await fetch(`http://localhost:5001/api/orders/${user.id}`);
          const data = await res.json();
          if (res.ok) setOrders(data.data || []);
       } catch (err) {
          console.error("Order fetch error", err);
       }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
     e.preventDefault();
     const success = await updateProfile(formData);
     if (success) setIsEditing(false);
  };

  if (!user) return null;


  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 md:pt-32 pb-24 md:pb-12 px-4 md:px-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        
        {/* OPERATIONAL HEADER (High Efficiency) */}
        <div className="flex justify-between items-center mb-2 px-1">
          <div>
            <h1 className="text-xl md:text-2xl font-serif font-bold text-primary italic leading-none">Command Center</h1>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time trade protocol • v2.0</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-2 p-3 bg-white border border-gray-100 rounded-xl text-red-500 shadow-sm active:scale-95 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* 2-COLUMN GRID SYSTEM (Items 1-4) - Above the Fold */}
        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {/* Tile 1: Settlement Progress */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                <TrendingUp className="w-4 h-4" />
              </div>
              <MiniSparkline />
            </div>
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Total Settlement</span>
              <span className="text-sm md:text-base font-bold text-primary italic font-serif">
                {formatCurrency(orders.reduce((sum, o) => sum + o.total_amount, 0))}
              </span>
            </div>
          </div>

          {/* Tile 2: Active Protocol */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-[120px]">
            <div className="flex justify-between items-start">
              <div className="w-8 h-8 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                <Activity className="w-4 h-4" />
              </div>
              <div className="px-2 py-0.5 bg-green-50 text-green-600 text-[7px] font-bold uppercase rounded-full">Active</div>
            </div>
            <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Commercial Status</span>
              <span className="text-sm md:text-base font-bold text-primary uppercase tracking-tighter">Verified Trader</span>
            </div>
          </div>

          {/* Tile 3: Network Reach */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-[120px]">
             <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                <Globe className="w-4 h-4" />
             </div>
             <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Trade Domicile</span>
              <span className="text-sm md:text-base font-bold text-primary truncate block font-serif italic">{user.country || 'Global'}</span>
            </div>
          </div>

          {/* Tile 4: Identity Reference */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between h-[120px]">
             <div className="w-8 h-8 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
                <UserIcon className="w-4 h-4" />
             </div>
             <div>
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1 leading-none">Partner Name</span>
              <span className="text-sm font-bold text-primary truncate block font-serif italic">{user.name?.split(' ')[0] || 'Partner'}</span>
            </div>
          </div>
        </div>

        {/* COMPRESSED ACTION BAR */}
        <div className="flex bg-gray-100 p-1 rounded-2xl md:max-w-xs transition-all">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`flex-1 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'orders' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary'}`}
          >
            <Package className="w-3 h-3" /> Trade History
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex-1 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${activeTab === 'profile' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary'}`}
          >
            <Settings className="w-3 h-3" /> Identity
          </button>
        </div>

        {/* DYNAMIC CONTENT REGION */}
        <AnimatePresence mode="wait">
          {activeTab === 'orders' ? (
            <motion.div 
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              {orders.length === 0 ? (
                <div className="bg-white p-10 rounded-[2.5rem] border-2 border-dashed border-gray-100 text-center">
                   <Package className="w-10 h-10 text-gray-200 mx-auto mb-4" />
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">No Active Vectors Found</p>
                </div>
              ) : (
                orders.map(order => {
                  const isExpanded = expandedOrders[order.id];
                  const orderItems: OrderItem[] = order.items ? JSON.parse(order.items) : [];
                  return (
                    <div key={order.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm transition-all">
                       <button 
                        onClick={() => toggleOrder(order.id)}
                        className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-gray-50/50 transition-colors"
                       >
                         <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-3">
                               <span className="text-xs font-bold text-primary font-serif italic">#{order.order_code}</span>
                               <span className={`px-2 py-0.5 rounded text-[7px] font-bold uppercase ${
                                 order.payment_status === 'Approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                               }`}>
                                 {order.payment_status || 'Unpaid'}
                               </span>
                            </div>
                            <div className="flex items-center gap-2 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                               <Clock className="w-2.5 h-2.5" /> {new Date(order.created_at).toLocaleDateString()}
                            </div>
                         </div>
                         <div className="text-right space-y-1">
                            <div className="text-sm font-bold text-[#A81D23]">{formatCurrency(order.total_amount)}</div>
                            <div className="text-[7px] font-bold text-accent uppercase tracking-widest flex items-center justify-end gap-1">
                               Status: <span className="text-primary">{order.status || 'PENDING'}</span>
                            </div>
                         </div>
                       </button>

                       {/* PERSISTENT CTA / SUMMARY (Above More Details) */}
                       <div className="px-4 pb-4 flex gap-2">
                           <div className="flex-1 bg-gray-50 border border-gray-100 py-2 px-3 rounded-xl flex items-center justify-between">
                               <span className="text-[8px] font-bold text-gray-400 uppercase truncate pr-2">
                                 {orderItems[0]?.name} {orderItems.length > 1 ? `+ ${orderItems.length-1} more` : ''}
                               </span>
                               <Package className="w-3 h-3 text-primary/20" />
                           </div>
                           <button 
                              onClick={() => toggleOrder(order.id)}
                              className="px-4 bg-primary text-white rounded-xl text-[8px] font-bold uppercase tracking-widest flex items-center gap-1 active:scale-95 transition-all"
                           >
                              {isExpanded ? 'Collapse' : 'Details'} <ArrowUpRight className="w-2.5 h-2.5 text-accent" />
                           </button>
                       </div>

                       <AnimatePresence>
                         {isExpanded && (
                           <motion.div 
                             initial={{ height: 0, opacity: 0 }}
                             animate={{ height: 'auto', opacity: 1 }}
                             exit={{ height: 0, opacity: 0 }}
                             className="px-4 pb-6 pt-2 border-t border-gray-50 bg-gray-50/30"
                           >
                              <div className="grid grid-cols-2 gap-3 mb-6">
                                  <div className="p-3 bg-white rounded-2xl border border-gray-100">
                                      <span className="text-[7px] font-bold text-gray-400 uppercase block mb-1">Financial Protocol</span>
                                      <p className="text-[9px] font-bold text-primary">{order.payment_status}</p>
                                  </div>
                                  <div className="p-3 bg-white rounded-2xl border border-gray-100">
                                      <span className="text-[7px] font-bold text-gray-400 uppercase block mb-1">Commercial Value</span>
                                      <p className="text-[9px] font-bold text-primary">{formatCurrency(order.total_amount)}</p>
                                  </div>
                              </div>
                              
                              <div className="space-y-2">
                                 <span className="text-[8px] font-bold text-primary uppercase tracking-[0.2em] block mb-2 px-1">Manifest Items</span>
                                 {orderItems.map((item, idx) => (
                                   <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                      <span className="text-[9px] font-bold text-primary italic font-serif leading-none">{item.name} <span className="text-gray-300 ml-1 italic font-normal">×{item.quantity}</span></span>
                                      <span className="text-[9px] font-bold text-primary">{formatCurrency(item.price * item.quantity)}</span>
                                   </div>
                                 ))}
                              </div>

                              <div className="mt-6 p-4 bg-primary text-white rounded-2xl shadow-lg relative overflow-hidden">
                                 <div className="absolute right-0 top-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12" />
                                 <div className="flex items-center gap-3 relative z-10">
                                    <MapPin className="w-4 h-4 text-accent" />
                                    <div className="flex-1">
                                      <span className="text-[7px] font-bold text-white/50 uppercase block mb-1 tracking-widest">End-to-End Destination</span>
                                      <p className="text-[9px] font-medium leading-relaxed italic">{JSON.parse(order.shipping_details || '{}').address || 'Global Hub'}</p>
                                    </div>
                                 </div>
                              </div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>
                  );
                })
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] border border-gray-100 p-6 md:p-8 space-y-6"
            >
               <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-primary italic font-serif">Security & Identity</h3>
                  <button 
                    onClick={() => setIsEditing(!isEditing)}
                    className="p-2 bg-gray-50 text-primary rounded-lg active:scale-95 transition-all"
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {[
                    { label: 'Name', value: formData.name, key: 'name', icon: UserIcon },
                    { label: 'Email', value: formData.email, key: 'email', icon: Mail },
                    { label: 'Mobile', value: formData.phone, key: 'phone', icon: Phone },
                    { label: 'Domicile', value: formData.country, key: 'country', icon: Globe },
                    { label: 'Entity', value: formData.company_name, key: 'company_name', icon: Building2 },
                  ].map(f => (
                    <div key={f.key} className="space-y-1.5 px-1 relative">
                       <div className="flex items-center gap-2 mb-1">
                          <f.icon className="w-3 h-3 text-accent" />
                          <label className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{f.label}</label>
                       </div>
                       <input 
                         disabled={!isEditing}
                         value={f.value || ''}
                         onChange={e => setFormData({...formData, [f.key]: e.target.value})}
                         className={`w-full bg-transparent border-b text-[11px] font-bold placeholder:text-gray-100 outline-none transition-all py-1 ${isEditing ? 'border-primary text-primary' : 'border-gray-50 text-gray-500'}`}
                       />
                       {isEditing && <span className="absolute right-0 bottom-1 w-1 h-1 bg-primary rounded-full animate-pulse" />}
                    </div>
                  ))}
               </div>

               {isEditing && (
                 <button 
                   onClick={handleUpdateProfile}
                   className="w-full bg-primary text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-accent transition-all shadow-xl shadow-primary/20"
                 >
                   <Save className="w-4 h-4" /> Finalize Changes
                 </button>
               )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* STICKY BOTTOM ACTION (More Details) - Fixed in viewport for single screen completion */}
        <div className="fixed bottom-24 left-0 right-0 px-8 z-40 md:hidden pointer-events-none">
            <div className="max-w-[140px] ml-auto">
                <button 
                  onClick={() => navigate('/products')}
                  className="w-full bg-accent text-primary p-4 rounded-[2rem] shadow-2xl flex flex-col items-center pointer-events-auto active:scale-95 transition-all border border-white/20"
                >
                    <Package className="w-5 h-5 mb-1" />
                    <span className="text-[8px] font-black uppercase leading-none tracking-tighter">New Trade</span>
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default MyAccount;
