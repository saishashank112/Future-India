import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  ShoppingBag,
  Clock,
  ChevronRight,
  TrendingUp,
  Download,
  Trash2,
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company_name?: string;
  country?: string;
  created_at: string;
  order_count: number;
  total_spent: number;
}

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCustomers = () => {
    setIsLoading(true);
    fetch('http://localhost:5001/api/admin/users')
      .then(res => res.json())
      .then(json => {
        if (json.data) setCustomers(json.data);
      })
      .catch(err => console.error('Error fetching customers:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const deleteCustomer = async (id: number) => {
      if (!confirm('Are you sure you want to delete this partner protocol? This action is irreversible.')) return;
      try {
          const res = await fetch(`http://localhost:5001/api/admin/users/${id}`, { method: 'DELETE' });
          if (res.ok) {
              setCustomers(prev => prev.filter(c => c.id !== id));
              setSelectedCustomer(null);
          }
      } catch (err) { console.error(err); }
  };

  const toggleBlock = async (id: number, currentStatus: string | undefined) => {
      const isBlocked = currentStatus === 'BLOCKED';
      try {
          const res = await fetch(`http://localhost:5001/api/admin/users/${id}/block`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ blocked: !isBlocked })
          });
          if (res.ok) fetchCustomers();
      } catch (err) { console.error(err); }
  };

  const filteredCustomers = customers.filter(c => 
    c.name?.toLowerCase().includes(search.toLowerCase()) || 
    c.email?.toLowerCase().includes(search.toLowerCase())
  );

  const stats = useMemo(() => {
      const lastWeek = new Date(Date.now() - 7*24*60*60*1000);
      return [
        { label: 'Total Partners', value: customers.length, icon: User, color: 'primary' },
        { label: 'Network Reach', value: `${new Set(customers.map(c => c.country)).size} Nations`, icon: Globe, color: 'accent' },
        { label: 'Trade Volume', value: `₹${customers.reduce((acc, c) => acc + (c.total_spent || 0), 0).toLocaleString()}`, icon: TrendingUp, color: 'green' },
        { label: 'Recent Leads', value: customers.filter(c => new Date(c.created_at) > lastWeek).length, icon: Clock, color: 'blue' }
      ];
  }, [customers]);

  return (
    <div className="space-y-8 pb-12 font-sans">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary italic">Client Directory</h1>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Global trade partner database and performance metrics</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
              <input 
                type="text" 
                placeholder="Search partners..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-[10px] font-bold text-primary focus:ring-1 focus:ring-accent outline-none w-64" 
              />
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-accent transition-all">
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4">
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                     stat.color === 'primary' ? 'bg-primary/10 text-primary' :
                     stat.color === 'accent' ? 'bg-accent/10 text-accent' :
                     stat.color === 'green' ? 'bg-green-50 text-green-600' :
                     'bg-blue-50 text-blue-600'
                 }`}>
                     <stat.icon className="w-6 h-6" />
                 </div>
                 <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                    <div className="text-lg font-serif font-bold text-primary italic">{stat.value}</div>
                 </div>
            </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50/50 border-b border-gray-100">
                <th className="py-6 px-8">Trade Identity</th>
                <th className="py-6 px-8">Corporate Origin</th>
                <th className="py-6 px-8">Trade History</th>
                <th className="py-6 px-8">Security</th>
                <th className="py-6 px-8 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                  <tr><td colSpan={5} className="py-20 text-center text-primary italic">Decrypting datasets...</td></tr>
              ) : filteredCustomers.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/50 transition-all group">
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center font-serif font-bold italic ${c.country === 'BLOCKED' ? 'bg-red-50 text-red-500 border-red-100' : 'bg-gray-50 text-primary border-gray-100'}`}>
                            {c.name?.[0] || 'U'}
                        </div>
                        <div>
                            <span className={`text-xs font-bold block leading-none mb-1 ${c.country === 'BLOCKED' ? 'text-red-500 line-through' : 'text-primary'}`}>{c.name}</span>
                            <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{c.email}</span>
                        </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1 italic">{c.company_name || 'Individual Trade'}</span>
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                            <Globe className="w-2.5 h-2.5 text-accent" />
                            {c.country || 'N/A'}
                        </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-bold text-primary">{c.order_count} Orders</span>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                     <span className={`px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-widest ${
                        c.country === 'BLOCKED' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                     }`}>
                        {c.country === 'BLOCKED' ? 'PROTOCOL SUSPENDED' : 'OPERATIONAL'}
                     </span>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <button 
                        onClick={() => setSelectedCustomer(c)}
                        className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all shadow-sm border border-gray-100 group/btn"
                    >
                        <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedCustomer && (
            <div className="fixed inset-0 z-[200] flex items-center justify-center bg-primary/80 backdrop-blur-md p-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="w-full max-w-4xl bg-white rounded-[3rem] shadow-4xl overflow-hidden relative flex flex-col md:flex-row max-h-[90vh]"
                >
                    <button 
                        onClick={() => setSelectedCustomer(null)}
                        className="absolute top-8 right-8 w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-primary hover:bg-red-50 hover:text-red-500 transition-all z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="md:w-5/12 bg-gray-50 p-12 border-r border-gray-100 flex flex-col gap-10">
                        <div>
                           <h3 className="text-2xl font-serif font-bold text-primary italic mb-2">Partner Analysis</h3>
                           <div className="px-4 py-1.5 bg-accent text-primary rounded-full text-[9px] font-bold uppercase tracking-widest inline-block">Established {new Date(selectedCustomer.created_at).getFullYear()}</div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-6 bg-white rounded-3xl border border-gray-100 shadow-sm space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary"><User className="w-5 h-5" /></div>
                                    <div className="flex-1">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Corporate Name</span>
                                        <span className="text-sm font-bold text-primary italic font-serif leading-none">{selectedCustomer.name}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4 pt-4 border-t border-gray-50">
                                    <div className="w-10 h-10 bg-accent/5 rounded-xl flex items-center justify-center text-accent"><Mail className="w-5 h-5" /></div>
                                    <div className="flex-1 overflow-hidden">
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Commercial Email</span>
                                        <span className="text-xs font-bold text-primary truncate block">{selectedCustomer.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-accent/5 rounded-xl flex items-center justify-center text-accent"><Phone className="w-5 h-5" /></div>
                                    <div>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Protocol Contact</span>
                                        <span className="text-sm font-bold text-primary">{selectedCustomer.phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto space-y-3 pt-6 border-t border-gray-100">
                             <button 
                                onClick={() => toggleBlock(selectedCustomer.id, selectedCustomer.country)}
                                className={`w-full py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm ${
                                    selectedCustomer.country === 'BLOCKED' 
                                    ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-600 hover:text-white' 
                                    : 'bg-orange-50 text-orange-600 border border-orange-100 hover:bg-orange-600 hover:text-white'
                                }`}
                             >
                                {selectedCustomer.country === 'BLOCKED' ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                                {selectedCustomer.country === 'BLOCKED' ? 'Restore Protocol' : 'Suspend Protocol'}
                             </button>
                             <button 
                                onClick={() => deleteCustomer(selectedCustomer.id)}
                                className="w-full py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                             >
                                <Trash2 className="w-4 h-4" />
                                Wipe Records
                             </button>
                        </div>
                    </div>

                    <div className="flex-1 p-12 overflow-y-auto">
                        <div className="mb-12">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mb-4 block">Performance Ledger</span>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-8 bg-primary text-white rounded-[2.5rem] shadow-xl shadow-primary/20">
                                    <p className="text-4xl font-serif font-bold italic">₹{(selectedCustomer.total_spent || 0).toLocaleString()}</p>
                                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-2">Cumulative Trade Value</p>
                                </div>
                                <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100">
                                    <p className="text-4xl font-serif font-bold text-primary italic">{selectedCustomer.order_count}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-2">Successful Dispatches</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2 mb-6">
                                <Clock className="w-4 h-4 text-accent" /> Timeline Events
                            </h4>
                            <div className="space-y-4">
                                <div className="flex items-center gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm border border-gray-100"><TrendingUp className="w-5 h-5" /></div>
                                    <div>
                                        <p className="text-xs font-bold text-primary">Initial Protocol Established</p>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Logged: {new Date(selectedCustomer.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCustomers;
