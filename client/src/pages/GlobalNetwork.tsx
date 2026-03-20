import { motion } from 'framer-motion';
import { Globe2, Ship, Clock, Award, MapPin } from 'lucide-react';

const GlobalNetwork = () => {
  const stats = [
    { label: 'Countries Served', value: '30+', icon: Globe2 },
    { label: 'Years Experience', value: '10+', icon: Clock },
    { label: 'Delivery Rate', value: '99%', icon: Ship },
    { label: 'Ports Connected', value: '15+', icon: Award },
  ];

  const countries = [
    "UAE", "Germany", "USA", "Singapore", "Saudi Arabia",
    "United Kingdom", "Netherlands", "Japan", "South Korea",
    "Vietnam", "Malaysia", "Canada", "Australia", "France"
  ];

  return (
    <div className="pt-24 pb-12 bg-background overflow-hidden min-h-screen">
      <div className="container mx-auto px-6">

        {/* Hero Section */}
        <section className="mb-16 text-center max-w-4xl mx-auto uppercase">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-accent font-black tracking-[0.3em] uppercase text-[10px] mb-4 block"
          >
            Real-Time Logistics
          </motion.span>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-black text-primary mb-6 tracking-tighter"
          >
            A Global Network <br /> of Reliability.
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-lg text-primary/60 leading-relaxed font-bold tracking-widest max-w-2xl mx-auto"
          >
            FACILITATING SOVEREIGN AGRICULTURAL TRADE THROUGH GLOBAL PORTS WITH PRECISION MONITORING.
          </motion.p>
        </section>

        {/* Global Network Visual */}
        <div className="relative mb-20 bg-black rounded-[3rem] overflow-hidden border border-white/5 py-16 md:py-24 shadow-2xl">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none" />
          
          <div className="container mx-auto px-6 relative z-10 text-center">
            <div className="relative w-full max-w-[900px] mx-auto aspect-video flex items-center justify-center">
               <div className="absolute inset-0 bg-accent/5 blur-[150px] rounded-full" />
               
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_Map_Blank.svg" 
                 alt="World Map" 
                 className="w-full opacity-10 filter brightness-200 contrast-150 grayscale pointer-events-none"
               />
               
               {/* Animated Shipping Nodes */}
               {[
                 { top: '35%', left: '78%', delay: 0 },
                 { top: '25%', left: '48%', delay: 0.5 },
                 { top: '38%', left: '60%', delay: 1 },
                 { top: '45%', left: '82%', delay: 1.5 }
               ].map((node, i) => (
                 <div key={i} className="absolute" style={{ top: node.top, left: node.left }}>
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ repeat: Infinity, duration: 4, delay: node.delay }}
                      className="w-2 md:w-3 h-2 md:h-3 bg-accent rounded-full shadow-[0_0_15px_rgba(212,175,55,1)]" 
                    />
                 </div>
               ))}

               {/* Origin Indicator: India */}
               <div className="absolute top-[45%] left-[73%]">
                 <div className="w-4 h-4 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,0.8)] z-20" />
                 <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-30" />
               </div>
            </div>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20 px-4 md:px-0">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 text-center group hover:bg-white hover:shadow-xl transition-all duration-500"
            >
              <div className="w-12 h-12 bg-primary/5 text-accent rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-accent group-hover:text-white transition-all">
                <stat.icon className="w-6 h-6" />
              </div>

              <div className="text-3xl font-black font-serif text-primary mb-1 tracking-tighter">
                {stat.value}
              </div>

              <div className="text-[10px] text-primary/40 uppercase tracking-[0.2em] font-black">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Strategic Hubs */}
        <div className="max-w-4xl mx-auto px-4">
          <h4 className="text-center font-black text-primary uppercase tracking-[0.3em] text-[10px] mb-10">
            Strategic Export Destinations
          </h4>

          <div className="flex flex-wrap justify-center gap-3">
            {countries.map((country) => (
              <motion.div
                key={country}
                whileHover={{ scale: 1.05, backgroundColor: '#f9fafb' }}
                className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-sm text-primary font-bold flex items-center space-x-2 transition-all"
              >
                <MapPin className="w-3 h-3 text-accent opacity-70" />
                <span className="uppercase tracking-widest">{country}</span>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default GlobalNetwork;
