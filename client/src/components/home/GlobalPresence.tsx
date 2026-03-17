import { motion } from 'framer-motion';
import { Globe2, Ship, Clock, Award } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const GlobalPresence = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t('countries_served'), value: '42+', icon: Globe2 },
    { label: t('on_time_delivery'), value: '99.2%', icon: Clock },
    { label: t('annual_tonnage'), value: '15k+', icon: Ship },
    { label: t('global_certs'), value: '12', icon: Award },
  ];

  const shipments = [
    { target: 'UAE', status: 'In Transit', time: '2h ago' },
    { target: 'Germany', status: 'Delivered', time: '5h ago' },
    { target: 'Singapore', status: 'Processing', time: '1d ago' },
  ];

  return (
    <section className="py-24 bg-[#051c14] text-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <div>
            <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">International Trade</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">{t('global_presence_title')}</h2>
            <p className="text-white/60 mb-12 leading-relaxed">
              {t('global_presence_description')}
            </p>

            <div className="grid grid-cols-2 gap-8 mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="group cursor-default">
                  <div className="flex items-center space-x-3 mb-2">
                    <stat.icon className="w-5 h-5 text-accent group-hover:scale-110 transition-transform" />
                    <span className="text-3xl font-bold font-serif">{stat.value}</span>
                  </div>
                  <span className="text-xs text-white/40 uppercase tracking-widest">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-bold text-accent uppercase tracking-widest mb-6">{t('live_export_feed')}</h4>
              {shipments.map((shipment, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-2 h-2 rounded-full ${shipment.status === 'Delivered' ? 'bg-green-500' : 'bg-accent animate-pulse'}`} />
                    <span className="text-sm font-medium">Shipment to {shipment.target}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xs text-white/40">{shipment.status}</span>
                    <span className="text-[10px] text-white/20 uppercase font-bold">{shipment.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="relative">
            {/* World Map Background (Stylized) */}
            <div className="relative aspect-square md:aspect-video bg-primary/20 rounded-full blur-[100px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10" />
            
            <div className="relative group">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_Map_Blank.svg" 
                alt="World Map" 
                className="w-full opacity-10 filter brightness-200"
              />
              
              {/* Pulsing Dots */}
              <div className="absolute top-[35%] left-[70%] w-3 h-3 bg-accent rounded-full animate-ping" />
              <div className="absolute top-[40%] left-[20%] w-3 h-3 bg-accent rounded-full animate-ping" />
              <div className="absolute top-[70%] left-[45%] w-3 h-3 bg-accent rounded-full animate-ping" />
              <div className="absolute top-[45%] left-[48%] w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
              
              {/* Connecting Lines (CSS Visual) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                <path d="M 48% 45% Q 60% 30% 70% 35%" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M 48% 45% Q 30% 35% 20% 40%" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
                <path d="M 48% 45% Q 45% 60% 45% 70%" fill="none" stroke="white" strokeWidth="1" strokeDasharray="4 2" />
              </svg>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;
