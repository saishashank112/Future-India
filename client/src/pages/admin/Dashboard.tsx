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
  const stats = [
    { label: 'Total Enquiries', value: '1,248', icon: MessageSquare, color: 'bg-blue-500', trend: '+12%', up: true },
    { label: 'Active Inventory', value: '42 Items', icon: Package, color: 'bg-green-500', trend: '+5%', up: true },
    { label: 'Global Reach', value: '28 Countries', icon: Globe, color: 'bg-accent', trend: '+2', up: true },
    { label: 'Annual Revenue', value: '$4.2M', icon: BarChart3, color: 'bg-purple-500', trend: '-2%', up: false },
  ];

  const recentEnquiries = [
    { id: 1, name: 'Hans Müller', product: 'Turmeric Finger', country: 'Germany', status: 'New', time: '2 hours ago', volume: '5 MT' },
    { id: 2, name: 'Fatima Al-Sayed', product: 'Black Pepper', country: 'UAE', status: 'Contacted', time: '5 hours ago', volume: '2 MT' },
    { id: 3, name: 'John Doe', product: 'Shelled Groundnuts', country: 'USA', status: 'Closed', time: '1 day ago', volume: '15 MT' },
    { id: 4, name: 'Zhang Wei', product: 'Cumin Seeds', country: 'China', status: 'New', time: '2 days ago', volume: '800 Kg' },
  ];

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary mb-2 italic">Executive Overview</h1>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Proprietary performance tracking for Future India Exim.</p>
        </div>
        <div className="flex gap-4">
            <button className="px-6 py-3 rounded-2xl bg-white border border-gray-100 text-[10px] font-bold text-primary uppercase tracking-widest shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-accent" />
                This Fiscal Year
            </button>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-50 hover:shadow-2xl transition-all group overflow-hidden relative"
          >
            <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-${stat.color.split('-')[1]}-500/20 group-hover:rotate-6 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            
            <div className="flex items-end justify-between">
                <div>
                   <div className="text-4xl font-bold text-primary mb-2 tabular-nums">{stat.value}</div>
                   <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</div>
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-green-500' : 'text-red-500'} bg-gray-50 px-3 py-1 rounded-full border border-gray-100`}>
                    {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {stat.trend}
                </div>
            </div>

            {/* Subtle background decoration */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gray-50 rounded-full opacity-50 group-hover:scale-150 transition-transform" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Recent Enquiries Table */}
        <div className="xl:col-span-2 bg-white rounded-[3rem] p-12 shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-12">
                <h3 className="text-2xl font-serif font-bold text-primary italic">Live Trade Traffic</h3>
                <button className="text-[10px] font-bold text-accent uppercase tracking-[0.2em] hover:underline flex items-center gap-2">
                    View Full Ledger <ArrowUpRight className="w-3 h-3" />
                </button>
            </div>
            
            <div className="overflow-x-auto">
            <table className="w-full">
                <thead>
                <tr className="text-left border-b border-gray-50 pb-8">
                    <th className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pb-8 px-4">Commodity Client</th>
                    <th className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pb-8 px-4">Volume</th>
                    <th className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pb-8 px-4">Region</th>
                    <th className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pb-8 px-4">Lifecycle</th>
                    <th className="text-[9px] font-bold text-gray-300 uppercase tracking-widest pb-8 px-4 text-right">Activity</th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                {recentEnquiries.map((enq) => (
                    <tr key={enq.id} className="group hover:bg-gray-50/50 transition-all cursor-pointer">
                    <td className="py-8 px-4">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center italic font-serif text-primary text-lg border border-primary/5">
                                {enq.name[0]}
                            </div>
                            <div>
                                <div className="font-bold text-primary text-sm group-hover:text-accent transition-colors">{enq.name}</div>
                                <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{enq.product}</div>
                            </div>
                        </div>
                    </td>
                    <td className="py-8 px-4">
                        <div className="text-xs font-bold text-primary">{enq.volume}</div>
                    </td>
                    <td className="py-8 px-4">
                        <div className="flex items-center gap-2">
                        <Globe className="w-3.5 h-3.5 text-gray-300" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{enq.country}</span>
                        </div>
                    </td>
                    <td className="py-8 px-4">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest ${
                        enq.status === 'New' ? 'bg-blue-50 text-blue-600' :
                        enq.status === 'Contacted' ? 'bg-yellow-50 text-yellow-600' :
                        'bg-green-50 text-green-600'
                        }`}>
                        {enq.status}
                        </span>
                    </td>
                    <td className="py-8 px-4 text-right">
                        <div className="text-[10px] font-bold text-gray-300 uppercase flex items-center justify-end gap-2">
                            <Clock className="w-3.5 h-3.5" />
                            {enq.time}
                        </div>
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>
        </div>

        {/* Market Insights */}
        <div className="bg-primary rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="relative z-10">
                <span className="text-accent font-bold tracking-[0.3em] uppercase text-[9px] mb-6 block">Quick Insight</span>
                <h3 className="text-3xl font-serif font-bold mb-8 italic">Global demand for <br/> <span className="text-accent">Organic Turmeric</span> is up by 15.4%</h3>
                <p className="text-white/50 text-sm font-light leading-relaxed mb-10">
                    European markets are showing increased interest in curcumin content above 5.5%. Consider scaling Sangli cluster sourcing.
                </p>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                        <span className="text-[10px] font-bold uppercase tracking-widest">EU Compliance</span>
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                    </div>
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10 opacity-50">
                        <span className="text-[10px] font-bold uppercase tracking-widest">US FDA Renewal</span>
                        <Clock className="w-4 h-4 text-yellow-400" />
                    </div>
                </div>
            </div>
            
            <button className="relative z-10 mt-12 w-full py-5 bg-white text-primary rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-accent hover:text-white transition-all">
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
