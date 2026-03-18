import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3,
  Calendar,
  Clock,
  Globe,
  MessageSquare,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2
} from 'lucide-react';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/admin/dashboard')
      .then(res => res.json())
      .then(json => {
        if (json.data) {
          setDashboardData(json.data);
        }
      })
      .catch(err => console.error('Error fetching dashboard metrics:', err));
  }, []);

  const stats = [
    { label: 'Total Enquiries', value: dashboardData?.stats?.totalEnquiries || 0, icon: MessageSquare, color: 'bg-blue-500', trend: 'Live', up: true },
    { label: 'Active Inventory', value: `${dashboardData?.stats?.activeProducts || 0} Items`, icon: Package, color: 'bg-green-500', trend: 'Live', up: true },
    { label: 'Global Reach', value: `${dashboardData?.stats?.countriesReached || 0} Countries`, icon: Globe, color: 'bg-accent', trend: 'Live', up: true },
    { label: 'Total Revenue', value: `₹${(dashboardData?.stats?.annualRevenue || 0).toLocaleString()}`, icon: BarChart3, color: 'bg-purple-500', trend: 'Live', up: true },
  ];

  const recentEnquiries = dashboardData?.recentEnquiries || [];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-bold text-primary mb-1 italic">Executive Overview</h1>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-[9px]">Proprietary performance tracking for Future India Exim.</p>
        </div>
        <div className="flex gap-4">
            <button className="px-5 py-2.5 rounded-xl bg-white border border-gray-100 text-[9px] font-bold text-primary uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 font-sans">
                <Calendar className="w-3 h-3 text-accent" />
                This Fiscal Year
            </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50 hover:shadow-xl transition-all group overflow-hidden relative"
          >
            <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-xl shadow-${stat.color.split('-')[1]}-500/20 group-hover:rotate-6 transition-transform`}>
              <stat.icon className="w-5 h-5" />
            </div>
            
            <div className="flex items-end justify-between font-sans">
                <div>
                   <div className="text-3xl font-bold text-primary mb-1 tabular-nums">{stat.value}</div>
                   <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold ${stat.up ? 'text-green-500' : 'text-red-500'} bg-gray-50 px-2.5 py-1 rounded-full border border-gray-100`}>
                    {stat.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                    {stat.trend}
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Enquiries Table */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-serif font-bold text-primary italic">Live Trade Traffic</h3>
                <button className="text-[9px] font-bold text-accent uppercase tracking-[0.2em] hover:underline flex items-center gap-2 font-sans">
                    View Full Ledger <ArrowUpRight className="w-2.5 h-2.5" />
                </button>
            </div>
            
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="text-left border-b border-gray-50 pb-6 font-sans">
                    <th className="text-[8px] font-bold text-gray-300 uppercase tracking-widest pb-6 px-3">Commodity Client</th>
                    <th className="text-[8px] font-bold text-gray-300 uppercase tracking-widest pb-6 px-3">Volume</th>
                    <th className="text-[8px] font-bold text-gray-300 uppercase tracking-widest pb-6 px-3">Region</th>
                    <th className="text-[8px] font-bold text-gray-300 uppercase tracking-widest pb-6 px-3">Lifecycle</th>
                    <th className="text-[8px] font-bold text-gray-300 uppercase tracking-widest pb-6 px-3 text-right">Activity</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-sans">
                {recentEnquiries.length === 0 && (
                   <tr><td colSpan={5} className="py-6 px-3 text-center text-gray-400 font-bold uppercase tracking-widest text-xs">No Recent Enquiries</td></tr>
                )}
                {recentEnquiries.map((enq: any) => (
                    <tr key={enq.id} className="group hover:bg-gray-50/50 transition-all cursor-pointer">
                    <td className="py-6 px-3">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center italic font-serif text-primary text-base border border-primary/5">
                                {enq.name[0]}
                            </div>
                            <div>
                                <div className="font-bold text-primary text-xs group-hover:text-accent transition-colors">{enq.name}</div>
                                <div className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{enq.food_item}</div>
                            </div>
                        </div>
                    </td>
                    <td className="py-6 px-3">
                        <div className="text-[11px] font-bold text-primary">{enq.type}</div>
                    </td>
                    <td className="py-6 px-3">
                        <div className="flex items-center gap-2">
                        <Globe className="w-3 h-3 text-gray-300" />
                        <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{enq.country}</span>
                        </div>
                    </td>
                    <td className="py-6 px-3">
                        <span className={`px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest bg-blue-50 text-blue-600`}>
                        {enq.status || 'NEW'}
                        </span>
                    </td>
                    <td className="py-6 px-3 text-right">
                        <div className="text-[9px] font-bold text-gray-300 uppercase flex items-center justify-end gap-1.5">
                            <Clock className="w-3 h-3" />
                            {new Date(enq.created_at).toLocaleDateString()}
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

        {/* Market Insights */}
        <div className="bg-primary rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
                <span className="text-accent font-bold tracking-[0.3em] uppercase text-[8px] mb-4 block font-sans">Quick Insight</span>
                <h3 className="text-2xl font-serif font-bold mb-6 italic">Global demand for <br/> <span className="text-accent">Organic Turmeric</span> is up by 15.4%</h3>
                <p className="text-white/50 text-xs font-light leading-relaxed mb-8">
                    European markets are showing increased interest in curcumin content above 5.5%. Consider scaling Sangli cluster sourcing.
                </p>
                <div className="space-y-3 font-sans">
                    <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/10">
                        <span className="text-[9px] font-bold uppercase tracking-widest">EU Compliance</span>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between p-3.5 bg-white/5 rounded-xl border border-white/10 opacity-50">
                        <span className="text-[9px] font-bold uppercase tracking-widest">US FDA Renewal</span>
                        <Clock className="w-3.5 h-3.5 text-yellow-400" />
                    </div>
                </div>
            </div>
            
            <button className="relative z-10 mt-10 w-full py-4 bg-white text-primary rounded-2xl font-bold text-[9px] uppercase tracking-[0.2em] shadow-xl hover:bg-accent hover:text-white transition-all font-sans">
                Download Intelligence Report
            </button>

            {/* Decorative element */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[80px] -z-0 translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
