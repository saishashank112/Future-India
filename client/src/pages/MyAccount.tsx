import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, LogOut, Package, ChevronRight, Settings, Mail, Phone, Globe, Building2, Save, X, ChevronDown, ChevronUp, Clock, CreditCard, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { User } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

const MyAccount = () => {
  const { user, logout, updateProfile } = useAuth();
  const { formatCurrency } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders'>('profile');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [orders, setOrders] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedOrders, setExpandedOrders] = useState<Record<number, boolean>>({});

  const toggleOrder = (id: number) => {
    setExpandedOrders(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  const [formData, setFormData] = useState<Partial<User>>({
     name: user?.name || '',
     email: user?.email || '',
     phone: user?.phone || '',
     company_name: user?.company_name || '',
     country: user?.country || '',
  });

  useEffect(() => {
    if (!user) {
       navigate('/login');
       return;
    }

    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      company_name: user.company_name || '',
      country: user.country || '',
    });

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

  const handleLogout = () => {
      logout();
      navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-32 pb-24 px-6 font-serif">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:items-start">
          
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-8 text-center border-b border-gray-50 bg-gradient-to-b from-primary/5 to-transparent">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center border border-primary/10 shadow-lg text-primary mx-auto">
                    <UserIcon className="w-10 h-10" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-4 border-white rounded-full" />
                </div>
                <h2 className="text-xl font-bold text-primary italic truncate px-2">
                  {user.name || 'Commercial Partner'}
                </h2>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 rounded-full mt-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[9px] font-bold text-primary uppercase tracking-widest font-sans">
                    {user.role} Account
                  </span>
                </div>
              </div>

              <nav className="p-4 space-y-2 font-sans">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === 'profile' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-500 hover:bg-gray-50 hover:text-primary'}`}
                >
                   <div className="flex items-center gap-3">
                      <Settings className="w-4 h-4" /> Identity & Security
                   </div>
                   {activeTab === 'profile' && <ChevronRight className="w-3 h-3" />}
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-[10px] uppercase font-bold tracking-widest transition-all ${activeTab === 'orders' ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-gray-500 hover:bg-gray-50 hover:text-primary'}`}
                >
                   <div className="flex items-center gap-3">
                      <Package className="w-4 h-4" /> Trade History
                   </div>
                   {activeTab === 'orders' && <ChevronRight className="w-3 h-3" />}
                </button>
                <div className="pt-4 mt-4 border-t border-gray-50">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 p-4 rounded-xl text-[10px] uppercase font-bold tracking-widest text-red-500 hover:bg-red-50 transition-all group"
                  >
                     <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" /> 
                     Terminate Session
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden"
              >
                {activeTab === 'profile' ? (
                  <div className="p-8 md:p-12">
                     <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-gray-50">
                        <div>
                           <h3 className="text-2xl font-bold text-primary italic mb-2">My Profile</h3>
                           <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed font-sans">
                             Personal Identity & Account Credentials
                           </p>
                        </div>
                        {!isEditing ? (
                          <button 
                            onClick={() => setIsEditing(true)} 
                            className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-primary text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm font-sans"
                          >
                            <Settings className="w-4 h-4" />
                            Edit Profile
                          </button>
                        ) : (
                          <div className="flex items-center gap-3 font-sans">
                            <button 
                              onClick={() => setIsEditing(false)}
                              className="px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all"
                            >
                              <X className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={handleUpdateProfile}
                              className="flex items-center gap-2 px-6 py-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:shadow-lg shadow-primary/20 transition-all"
                            >
                              <Save className="w-4 h-4" />
                              Save Profile
                            </button>
                          </div>
                        )}
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-gray-400 group">
                              <UserIcon className={`w-4 h-4 ${isEditing ? 'text-primary' : ''}`} />
                              <label className="text-[10px] font-bold uppercase tracking-widest font-sans">Full Name</label>
                           </div>
                           <input 
                             disabled={!isEditing}
                             value={formData.name || ''}
                             onChange={e => setFormData({...formData, name: e.target.value})}
                             className={`w-full px-0 py-2 bg-transparent border-b text-sm font-bold text-primary outline-none transition-all ${isEditing ? 'border-primary' : 'border-gray-100'}`} 
                           />
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-gray-400">
                              <Mail className={`w-4 h-4 ${isEditing ? 'text-primary' : ''}`} />
                              <label className="text-[10px] font-bold uppercase tracking-widest font-sans">Email</label>
                           </div>
                           <input 
                             disabled={!isEditing}
                             value={formData.email || ''}
                             onChange={e => setFormData({...formData, email: e.target.value})}
                             className={`w-full px-0 py-2 bg-transparent border-b text-sm font-bold text-primary outline-none transition-all ${isEditing ? 'border-primary' : 'border-gray-100'}`} 
                           />
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-gray-400">
                              <Phone className={`w-4 h-4 ${isEditing ? 'text-primary' : ''}`} />
                              <label className="text-[10px] font-bold uppercase tracking-widest font-sans">Phone</label>
                           </div>
                           <input 
                             disabled={!isEditing}
                             value={formData.phone || ''}
                             onChange={e => setFormData({...formData, phone: e.target.value})}
                             className={`w-full px-0 py-2 bg-transparent border-b text-sm font-bold text-primary outline-none transition-all ${isEditing ? 'border-primary' : 'border-gray-100'}`} 
                           />
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-gray-400">
                              <Globe className={`w-4 h-4 ${isEditing ? 'text-primary' : ''}`} />
                              <label className="text-[10px] font-bold uppercase tracking-widest font-sans">Country</label>
                           </div>
                           <input 
                             disabled={!isEditing}
                             value={formData.country || ''}
                             onChange={e => setFormData({...formData, country: e.target.value})}
                             className={`w-full px-0 py-2 bg-transparent border-b text-sm font-bold text-primary outline-none transition-all ${isEditing ? 'border-primary' : 'border-gray-100'}`} 
                           />
                        </div>
                        <div className="space-y-4">
                           <div className="flex items-center gap-3 text-gray-400">
                              <Building2 className={`w-4 h-4 ${isEditing ? 'text-primary' : ''}`} />
                              <label className="text-[10px] font-bold uppercase tracking-widest font-sans">Company Name</label>
                           </div>
                           <input 
                             disabled={!isEditing}
                             value={formData.company_name || ''}
                             onChange={e => setFormData({...formData, company_name: e.target.value})}
                             className={`w-full px-0 py-2 bg-transparent border-b text-sm font-bold text-primary outline-none transition-all ${isEditing ? 'border-primary' : 'border-gray-100'}`} 
                           />
                        </div>
                     </div>
                  </div>
                ) : (
                  <div className="p-8 md:p-12">
                     <header className="mb-12">
                        <h3 className="text-2xl font-bold text-primary italic mb-2">Trade History</h3>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">
                          Chronological Logistics Archive
                        </p>
                     </header>

                     {orders.length === 0 ? (
                        <div className="text-center py-24 bg-gray-50/50 rounded-[2rem] border border-dashed border-gray-200">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto text-gray-300 mb-6 shadow-sm">
                                <Package className="w-8 h-8" />
                            </div>
                            <h4 className="text-lg font-bold text-primary italic mb-2">No Active Logistics</h4>
                            <p className="text-[10px] uppercase font-bold tracking-widest text-gray-400 max-w-xs mx-auto font-sans">
                              Your trade ledger is currently empty. Explore our portfolio to commence trade.
                            </p>
                            <button 
                              onClick={() => navigate('/products')}
                              className="mt-8 px-8 py-4 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:shadow-lg transition-all font-sans"
                            >
                              Browse Products
                            </button>
                        </div>
                     ) : (
                        <div className="space-y-8">
                           {orders.map(order => {
                              const isExpanded = expandedOrders[order.id];
                              const orderItems = order.items ? JSON.parse(order.items) : [];
                              return (
                                <div key={order.id} className="bg-white border-b border-gray-100 py-8 space-y-8">
                                  {/* Order Header - Always Visible */}
                                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                     <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                          <h4 className="text-2xl font-bold text-[#A81D23] uppercase tracking-tight">#{order.order_code}</h4>
                                          <div className="flex gap-2 font-sans">
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase tracking-widest">pending payment</span>
                                            <span className="px-2.5 py-1 bg-gray-100 text-gray-500 rounded text-[9px] font-bold uppercase tracking-widest">{order.status || 'pending_delivery'}</span>
                                            <button onClick={() => toggleOrder(order.id)} className="ml-1 text-gray-400 hover:text-primary transition-colors">
                                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                          </div>
                                        </div>
                                        <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">
                                           {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </div>
                                     </div>
                                  </div>

                                  {/* Item Summary One-liner */}
                                  <div className="space-y-2">
                                    {orderItems.map((item: any, idx: number) => (
                                      <div key={idx} className="flex justify-between items-center text-xs font-medium text-primary/80">
                                         <div>{item.name} <span className="text-gray-400 italic ml-1">× {item.quantity}</span></div>
                                         <div className="font-bold">{formatCurrency(item.price * item.quantity)}</div>
                                      </div>
                                    ))}
                                    <div className="flex justify-between items-end pt-5 mt-3 border-t border-gray-50">
                                       <div className="text-xs font-bold text-primary uppercase tracking-widest">Cash on Delivery</div>
                                       <div className="text-right flex items-baseline gap-2">
                                          <span className="text-xl font-bold text-[#A81D23]">{formatCurrency(order.total_amount)}</span>
                                       </div>
                                    </div>
                                  </div>

                                  {/* Expandable Sections */}
                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden space-y-10 pt-8 border-t border-dashed border-gray-100 mt-4"
                                      >
                                        {/* Detailed Products List */}
                                        <div className="space-y-5">
                                          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest border-b border-gray-100 pb-3">
                                            <Package className="w-4 h-4" /> Products
                                          </div>
                                          <div className="space-y-4">
                                            {orderItems.map((item: any, idx: number) => (
                                              <div key={idx} className="flex justify-between items-center py-2 text-sm">
                                                <div className="text-primary font-bold">{item.name}</div>
                                                <div className="text-primary/70">Qty: {item.quantity} · <span className="font-bold">{formatCurrency(item.price)}</span></div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Delivery Tracker */}
                                        <div className="space-y-6">
                                          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest border-b border-gray-100 pb-3">
                                            <Clock className="w-4 h-4" /> Delivery Status
                                          </div>
                                          <div className="relative flex justify-between items-start pt-6 mb-4 max-w-lg font-sans">
                                            <div className="absolute top-4 left-0 right-0 h-1 bg-gray-100" />
                                            {['Pending', 'Processing', 'Shipped', 'Delivered'].map((step, idx) => {
                                              const currentStatus = order.status ? order.status.toUpperCase() : 'PENDING';
                                              
                                              // Determine numeric progress level
                                              let level = 0;
                                              if (currentStatus.includes('PROCESS') || currentStatus.includes('PACK')) level = 1;
                                              if (currentStatus.includes('SHIP') || currentStatus.includes('OUT')) level = 2;
                                              if (currentStatus.includes('DELIVER')) level = 3;

                                              const isActive = idx <= level;
                                              return (
                                                <div key={step} className="relative z-10 flex flex-col items-center gap-3">
                                                   <div className={`w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-xs font-bold ${isActive ? 'bg-[#A81D23] text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                      {isActive ? '✓' : idx + 1}
                                                   </div>
                                                   <span className={`text-[9px] md:text-[10px] uppercase font-bold tracking-tight ${isActive ? 'text-primary' : 'text-gray-400'}`}>{step}</span>
                                                </div>
                                              );
                                            })}
                                          </div>
                                        </div>

                                        {/* Payment Details Table */}
                                        <div className="space-y-5">
                                          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest border-b border-gray-100 pb-3">
                                            <CreditCard className="w-4 h-4" /> Payment Details
                                          </div>
                                          <div className="grid grid-cols-2 gap-y-4 text-xs font-sans">
                                            <div className="text-gray-500">Method</div>
                                            <div className="text-primary font-bold text-right">Cash on Delivery</div>
                                            <div className="text-gray-500">Status</div>
                                            <div className="text-primary font-bold text-right italic">{order.status || 'pending_delivery'}</div>
                                            <div className="text-gray-500">Total</div>
                                            <div className="text-primary font-bold text-right text-sm">{formatCurrency(order.total_amount)}</div>
                                          </div>
                                        </div>

                                        {/* Shipping Address */}
                                        <div className="space-y-5">
                                          <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest border-b border-gray-100 pb-3">
                                            <MapPin className="w-4 h-4" /> Shipping Address
                                          </div>
                                          <div className="text-xs text-gray-600 font-medium leading-relaxed font-sans">
                                            <p className="text-primary font-bold text-sm mb-1">{user.name}</p>
                                            <p>{user.country || 'Global'}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                              <Phone className="w-4 h-4 text-accent" />
                                              <span>{user.phone}</span>
                                            </div>
                                          </div>
                                        </div>

                                        <button 
                                          onClick={() => toggleOrder(order.id)}
                                          className="w-fit mx-auto flex items-center gap-2 text-[10px] py-4 font-bold text-gray-400 hover:text-primary transition-all font-sans uppercase tracking-widest"
                                        >
                                           Show Less <ChevronUp className="w-3 h-3" />
                                        </button>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                           })}
                        </div>
                     )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default MyAccount;
