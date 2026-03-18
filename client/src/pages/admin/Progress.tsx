import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, BarChart3, PieChart, Activity, Download, Calendar } from 'lucide-react';

interface Metrics {
  production: number;
  revenue: number;
  profit: number;
  growth: string;
  enquiries: number;
}

const AdminProgress = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);

  useEffect(() => {
    fetch('http://localhost:5001/api/metrics')
      .then(res => res.json())
      .then(json => setMetrics(json.data))
      .catch(err => console.error('Error fetching metrics:', err));
  }, []);

  if (!metrics) return <div className="p-12 text-center font-bold text-gray-400">Loading Intelligence Assets...</div>;

  return (
    <div className="space-y-12">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-serif font-bold text-primary mb-2 italic">Performance Analytics</h1>
          <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">Real-time production and revenue tracking.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
            <Calendar className="w-4 h-4" />
            Last 30 Days
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-white text-[10px] font-bold uppercase tracking-widest shadow-xl hover:bg-accent transition-all">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </header>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { label: 'Total Revenue', value: `$${(metrics.revenue / 1000).toFixed(1)}K`, trend: '+12.5%', icon: BarChart3, color: 'text-green-500' },
          { label: 'Net Profit', value: `$${(metrics.profit / 1000).toFixed(1)}K`, trend: '+8.2%', icon: PieChart, color: 'text-accent' },
          { label: 'Production', value: `${metrics.production}T`, trend: '+5.4%', icon: Activity, color: 'text-blue-500' },
          { label: 'Enquiries', value: metrics.enquiries.toString(), trend: metrics.growth, icon: TrendingUp, color: 'text-purple-500' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-green-500 bg-green-50 px-3 py-1 rounded-full">{stat.trend}</span>
            </div>
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</h3>
            <p className="text-3xl font-serif font-bold text-primary italic">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-serif font-bold text-primary mb-8 italic">Revenue Growth</h3>
          <div className="h-64 flex items-end gap-4">
            {[40, 60, 45, 90, 75, 80, 100].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div 
                  className="w-full bg-accent rounded-t-xl transition-all duration-500 group-hover:bg-primary" 
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] font-bold text-gray-300 uppercase">W{i+1}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
          <h3 className="text-xl font-serif font-bold text-primary mb-8 italic">Production Efficiency</h3>
          <div className="space-y-8">
            {[
              { name: 'Turmeric Extraction', progress: 85 },
              { name: 'Pepper Processing', progress: 92 },
              { name: 'Basmati Cleaning', progress: 78 },
            ].map((p, i) => (
              <div key={i} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-primary uppercase tracking-wider">{p.name}</span>
                  <span className="text-xs font-bold text-accent">{p.progress}%</span>
                </div>
                <div className="h-2 w-full bg-gray-50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all duration-1000" 
                    style={{ width: `${p.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProgress;
