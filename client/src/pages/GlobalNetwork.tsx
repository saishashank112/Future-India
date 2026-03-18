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
    <div className="pt-32 pb-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="mb-24 text-center max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block"
          >
            Our Presence
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-serif font-bold text-primary mb-8"
          >
            A Global Network of Trust.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 leading-relaxed font-light"
          >
            Leveraging India's strategic agricultural position to serve the most demanding quality standards across five continents.
          </motion.p>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="glass-card p-8 text-center"
            >
              <div className="w-12 h-12 bg-primary/5 text-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="text-3xl font-bold font-serif text-primary mb-2">{stat.value}</div>
              <div className="text-xs text-gray-400 uppercase tracking-widest font-bold">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Map Visualization Placeholder - Hidden on mobile */}
        <div className="hidden lg:block relative aspect-video w-full max-w-5xl mx-auto mb-24 rounded-3xl overflow-hidden bg-[#051c14] shadow-2xl group">
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_Map_Blank.svg" 
            alt="World Map" 
            className="w-full h-full object-contain opacity-20 filter invert"
          />
          {/* Animated Pins */}
          {[
            { top: '35%', left: '48%' }, // India
            { top: '30%', left: '62%' }, // Middle East
            { top: '25%', left: '18%' }, // USA
            { top: '22%', left: '50%' }, // Europe
            { top: '40%', left: '75%' }, // SE Asia
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-accent rounded-full"
              style={pos}
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
            >
              <div className="absolute inset-0 bg-accent rounded-full animate-ping" />
            </motion.div>
          ))}
          
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 flex flex-col justify-end p-12">
            <h3 className="text-2xl font-serif font-bold text-white mb-2">Connecting India to the World</h3>
            <p className="text-white/60 text-sm max-w-lg">From the ports of Mundra and JNPT, our specialized logistics ensure that every shipment maintains international freshness standards.</p>
          </div>
        </div>

        {/* Countries Tags */}
        <div className="max-w-4xl mx-auto">
          <h4 className="text-center font-bold text-primary uppercase tracking-widest text-sm mb-10">Export Destinations</h4>
          <div className="flex flex-wrap justify-center gap-4">
            {countries.map((country, idx) => (
              <motion.div
                key={country}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-primary font-medium hover:border-accent hover:text-accent transition-all cursor-default flex items-center space-x-2 group"
              >
                <MapPin className="w-3 h-3 text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span>{country}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalNetwork;
