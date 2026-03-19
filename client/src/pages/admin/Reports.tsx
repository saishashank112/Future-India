import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  ShoppingBag, 
  DollarSign, 
  BarChart3, 
  Download, 
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

interface AnalyticPoint {
  month?: string;
  week?: string;
  revenue: number;
  count: number;
}

interface ReportData {
  weeklyRevenue: AnalyticPoint[];
  monthlyRevenue: AnalyticPoint[];
}

const Reports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    fetch('http://localhost:5001/api/admin/reports')
      .then(res => res.json())
      .then(json => {
        if (isMounted && json.data) setReportData(json.data);
      })
      .catch(err => console.error('Error fetching reports:', err))
      .finally(() => { if (isMounted) setLoading(false); });
    return () => { isMounted = false; };
  }, []);

  const downloadCSV = () => {
    if (!reportData) return;
    const headers = ['Period', 'Revenue', 'Orders'];
    const rows = reportData.monthlyRevenue.map((m) => [m.month || '', m.revenue, m.count]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map((e) => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "future_india_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4 md:space-y-8 pb-32 md:pb-12 px-1 md:px-0 font-sans">
      <header className="flex flex-row items-center justify-between gap-4 mb-2">
        <div className="flex-1">
           <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[7px] md:text-[8px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1.5 hover:text-primary transition-all active:scale-90">
              <ChevronLeft className="w-2 md:w-2.5 h-2 md:h-2.5" /> Intelligence Center
           </button>
           <h1 className="text-xl md:text-3xl font-serif font-bold text-primary italic leading-none">Audit Protocol</h1>
           <p className="text-[7px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sovereign Trade Analysis Matrix</p>
        </div>
        <button 
            onClick={downloadCSV}
            className="w-10 h-10 md:w-12 md:h-12 bg-primary text-white rounded-xl shadow-xl active:scale-95 transition-all flex items-center justify-center border border-white/10"
        >
            <Download className="w-4 h-4 text-accent" />
        </button>
      </header>

      {/* COMPACT SUMMARY TILES - Optimized for 318px */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
        {[
          { label: 'Fiscal REV', value: `₹${(reportData?.weeklyRevenue?.[0]?.revenue || 0).toLocaleString()}`, sub: '+12.5% Vol', icon: DollarSign, color: 'text-green-500', trend: 'up' },
          { label: 'Logistics', value: reportData?.weeklyRevenue?.[0]?.count || 0, sub: '+4 vectors', icon: ShoppingBag, color: 'text-blue-500', trend: 'up' },
          { label: 'Gross VOL', value: '42.5 Tons', sub: 'Active Transits', icon: TrendingUp, color: 'text-accent', trend: 'up' },
          { label: 'Conversion', value: '3.2%', sub: '-0.4% Target', icon: BarChart3, color: 'text-purple-500', trend: 'down' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-3 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between min-h-[90px] md:min-h-[140px]"
          >
            <div className="flex items-center justify-between pointer-events-none">
              <div className={`w-7 h-7 md:w-11 md:h-11 rounded-lg md:rounded-xl bg-gray-50 flex items-center justify-center ${stat.color} shadow-inner`}>
                <stat.icon className="w-3.5 h-3.5 md:w-5 h-5" />
              </div>
              <div className={`text-[6px] md:text-[8px] font-black ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'} bg-gray-50 px-1.5 py-0.5 rounded-full border border-gray-100`}>
                 {stat.trend === 'up' ? '▲' : '▼'}
              </div>
            </div>
            <div className="mt-2 md:mt-0">
              <div className="text-[6px] md:text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{stat.label}</div>
              <div className="text-[10px] md:text-xl font-bold text-primary italic font-serif leading-none mb-1">{stat.value}</div>
              <div className="text-[5px] md:text-[8px] font-bold text-gray-300 uppercase tracking-tighter truncate">{stat.sub}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ANALYTICS VECTORS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-8">
        <div className="bg-white p-3 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4 md:mb-8 px-1">
               <h3 className="text-[10px] md:text-lg font-serif font-bold text-primary italic tracking-tight">Revenue Throughput</h3>
               <div className="px-1.5 py-0.5 bg-accent/10 text-accent text-[6px] font-black uppercase rounded-md tracking-widest border border-accent/5">12M Audit</div>
            </div>
            <div className="h-[180px] md:h-[300px]">
                <ResponsiveContainer width="99%" height="100%">
                    <AreaChart data={reportData?.monthlyRevenue?.slice().reverse()}>
                        <defs>
                            <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#c5a059" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#c5a059" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                        <XAxis dataKey="month" hide />
                        <YAxis hide />
                        <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '8px', fontWeight: 700 }} />
                        <Area type="monotone" dataKey="revenue" stroke="#A81D23" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-3 md:p-8 rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4 md:mb-8 px-1">
               <h3 className="text-[10px] md:text-lg font-serif font-bold text-primary italic tracking-tight">Logistics Distribution</h3>
               <div className="px-1.5 py-0.5 bg-primary/5 text-primary text-[6px] font-black uppercase rounded-md tracking-widest border border-primary/5">4W Audit</div>
            </div>
            <div className="h-[180px] md:h-[300px]">
                <ResponsiveContainer width="99%" height="100%">
                    <BarChart data={reportData?.weeklyRevenue?.slice().reverse()}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                        <XAxis dataKey="week" hide />
                        <YAxis hide />
                        <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '8px', fontWeight: 700 }} />
                        <Bar dataKey="count" fill="#0c4a35" radius={[4, 4, 0, 0]} barSize={12} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
