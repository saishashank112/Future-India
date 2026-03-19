import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3,
  Globe,
  MessageSquare,
  Package,
  ArrowUpRight,
  Activity,
  Zap
} from 'lucide-react';
import { getApiUrl } from '../../config/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(getApiUrl('/admin/dashboard'))
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setDashboardData(json.data);
        }
      })
      .catch(err => console.error('Error fetching dashboard metrics:', err));
  }, []);

  const stats = [
    { label: 'Enquiries', value: dashboardData?.stats?.totalEnquiries || 0, icon: MessageSquare, color: 'bg-blue-500', trend: 'Live', up: true },
    { label: 'Inventory', value: dashboardData?.stats?.activeProducts || 0, icon: Package, color: 'bg-green-500', trend: 'Live', up: true },
    { label: 'Network', value: dashboardData?.stats?.countriesReached || 0, icon: Globe, color: 'bg-accent', trend: 'Live', up: true },
    { label: 'Revenue', value: dashboardData?.stats ? `₹${(dashboardData.stats.annualRevenue || 0).toLocaleString()}` : '₹0', icon: BarChart3, color: 'bg-purple-500', trend: 'Live', up: true },
  ];

  const recentEnquiries = dashboardData?.recentEnquiries || [];

  return (
    <div className="space-y-4 md:space-y-8 px-1 md:px-0 pb-20 md:pb-0 font-sans">
      <header className="flex justify-between items-end mb-2">
        <div>
          <h1 className="text-xl md:text-3xl font-serif font-bold text-primary mb-0.5 italic leading-none">Intelligence Hub</h1>
          <p className="text-gray-400 font-bold uppercase tracking-widest text-[8px] md:text-[9px]">Administrative Monitoring Protocol • Real-time</p>
        </div>
        <div className="hidden md:flex gap-4">
           {/* Add any desktop-only header actions here */}
        </div>
      </header>

      {/* ADAPTIVE STATS GRID - Force 2-column on mobile */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => stat.label === 'Enquiries' && navigate('/admin/enquiries')}
            className="bg-white p-3 md:p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between min-h-[110px] md:min-h-[160px] active:scale-95 transition-all overflow-hidden relative cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2 md:mb-6">
               <div className={`w-8 h-8 md:w-12 md:h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                 <stat.icon className="w-4 h-4 md:w-5 h-5" />
               </div>
               <div className="flex items-center gap-0.5 text-[7px] md:text-[9px] font-black text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full uppercase">
                  <Activity className="w-2 h-2" /> {stat.trend}
               </div>
            </div>
            
            <div className="space-y-0.5">
               <div className="text-sm md:text-2xl font-bold text-primary truncate tabular-nums">{stat.value}</div>
               <div className="text-[7px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute -right-2 -bottom-2 opacity-5">
               <stat.icon className="w-12 h-12 md:w-20 md:h-20" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-8">
        {/* Live Traffic Feed */}
        <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="flex justify-between items-center p-4 md:p-8 border-b border-gray-50">
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                   <h3 className="text-sm md:text-xl font-serif font-bold text-primary italic">Trade Stream</h3>
                </div>
                <button onClick={() => navigate('/admin/enquiries')} className="text-[8px] font-bold text-accent uppercase tracking-widest flex items-center gap-1">
                    Full Ledger <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
            </div>
            
            <div className="p-2 md:p-0 overflow-x-auto">
              <table className="w-full">
                <thead className="hidden md:table-header-group">
                  <tr className="text-left border-b border-gray-50 bg-gray-50/50">
                    <th className="text-[8px] font-bold text-gray-400 uppercase tracking-widest py-4 px-6">Partner / Cargo</th>
                    <th className="text-[8px] font-bold text-gray-400 uppercase tracking-widest py-4 px-6 text-right">Route</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {recentEnquiries.length === 0 ? (
                    <tr><td colSpan={2} className="py-12 text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em]">Standby Profile Active</td></tr>
                  ) : (
                    recentEnquiries.map((enq: any) => (
                      <tr key={enq.id} onClick={() => navigate('/admin/enquiries')} className="hover:bg-gray-50/50 transition-colors cursor-pointer group">
                        <td className="p-4 md:px-6 md:py-5">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center font-serif text-primary text-base font-bold shadow-sm group-hover:bg-accent group-hover:text-white transition-all">
                                {enq.name[0]}
                             </div>
                             <div className="min-w-0">
                                <p className="text-[11px] font-bold text-primary truncate leading-none mb-1">{enq.name}</p>
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest truncate">{enq.food_item}</p>
                             </div>
                          </div>
                        </td>
                        <td className="p-4 md:px-6 md:py-5 text-right">
                           <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gray-50 border border-gray-100 text-gray-500 text-[8px] font-bold uppercase tracking-tighter">
                              <Globe className="w-2.5 h-2.5" /> {enq.country}
                           </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
        </div>

        {/* Operational Shortcuts */}
        <div className="space-y-4">
           <div className="bg-primary rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-between min-h-[220px]">
              <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                     <Zap className="w-4 h-4 text-accent fill-accent" />
                     <span className="text-accent font-black tracking-[0.2em] uppercase text-[9px] font-sans">Analytics Vault</span>
                  </div>
                  <h4 className="text-xl font-serif font-bold italic mb-2">Refine Strategy</h4>
                  <p className="text-white/40 text-[10px] font-light leading-relaxed mb-6">
                      Execute deep audits on current trade vectors and regional revenue throughput.
                  </p>
              </div>
              
              <button 
                onClick={() => navigate('/admin/reports')}
                className="relative z-10 w-full py-4 bg-white text-primary rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] shadow-2xl hover:bg-accent hover:text-white transition-all active:scale-95"
              >
                  Initiate Audit Report
              </button>

              <div className="absolute -right-8 -top-8 w-40 h-40 bg-accent/20 rounded-full blur-3xl -z-0" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
