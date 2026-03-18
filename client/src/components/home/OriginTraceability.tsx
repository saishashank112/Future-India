import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Info, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const OriginTraceability = () => {
  const { t } = useLanguage();
  
  const regions = useMemo(() => [
    { 
      id: 'south', 
      name: t('south_india'), 
      product: 'Black Pepper & Turmeric', 
      details: 'Coastal Karnataka and Kerala. Traditional harvesting methods passed down through generations.', 
      pos: { top: '75%', left: '50%' },
      image: 'https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5'
    },
    { 
      id: 'north', 
      name: t('north_india'), 
      product: 'Basmati Rice & Wheat', 
      details: 'Sourced from the fertile plains of Punjab and Haryana. High-altitude Himalayan water irrigation.', 
      pos: { top: '25%', left: '45%' },
      image: 'https://images.unsplash.com/photo-1586201327102-337b8dd20.jpg'
    },
    { 
      id: 'east', 
      name: t('east_india'), 
      product: 'Spices & Tea', 
      details: 'Assam and Darjeeling regions. Unique climate for aromatic spices and world-class tea.', 
      pos: { top: '45%', left: '75%' },
      image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12'
    },
    { 
      id: 'west', 
      name: t('west_india'), 
      product: 'Oil Seeds & Grains', 
      details: 'Gujarat and Maharashtra. Modern processing facilities near the Mundra and JNPT ports.', 
      pos: { top: '55%', left: '35%' },
      image: 'https://images.unsplash.com/photo-1621460244432-132ad8530263'
    }
  ], [t]);

  const [selectedRegion, setSelectedRegion] = useState(regions[0]);
  const [showFarmDetails, setShowFarmDetails] = useState(false);

  return (
    <section className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          {/* Left: Map */}
          <div className="hidden lg:block w-full lg:w-1/2 relative">
            <div className="relative aspect-[4/5] max-w-[500px] mx-auto p-4 border-2 border-primary/10 rounded-[3rem] bg-white/50 backdrop-blur-sm shadow-2xl">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] blur-xl" />
              
              {/* India Map Placeholder - Stylized SVG or Image */}
              <div className="absolute inset-4 flex items-center justify-center overflow-hidden rounded-[2.5rem]">
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/e/e0/India_map_blank.svg" 
                  alt="India Map" 
                  className="w-full h-full opacity-20 grayscale invert filter brightness-0"
                />
              </div>
 
              {/* Pins */}
              {regions.map((region) => (
                <motion.button
                  key={region.id}
                  onClick={() => setSelectedRegion(region)}
                  className="absolute z-10 group"
                  style={region.pos}
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                >
                  <div className={`w-5 h-5 rounded-full border-2 border-white transition-all duration-300 ${
                    selectedRegion.id === region.id ? 'bg-accent scale-150 shadow-[0_0_20px_rgba(251,191,36,0.6)]' : 'bg-primary group-hover:bg-accent'
                  }`} />
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-1 rounded shadow-lg text-[10px] font-bold text-primary">
                    {region.name}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
 
          {/* Right: Info Panel */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <span className="text-accent font-bold tracking-widest uppercase text-xs mb-4 block">{t('trace_origin_label')}</span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6 italic">{t('trace_title')}</h2>
                <p className="text-gray-600 leading-relaxed font-light">
                  {t('trace_subtitle')}
                </p>
              </div>
 
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedRegion.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card p-10 relative overflow-hidden group border border-primary/5 shadow-xl"
                >
                  <div className="relative z-10 flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/3 h-48 rounded-2xl overflow-hidden shadow-inner">
                      <img src={selectedRegion.image} alt={selectedRegion.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    </div>
                    <div className="w-full md:w-2/3">
                      <div className="flex items-center space-x-2 text-accent mb-3">
                        <MapPin className="w-4 h-4" />
                        <span className="font-bold text-[10px] uppercase tracking-widest">{selectedRegion.name}</span>
                      </div>
                      <h3 className="text-3xl font-serif font-bold text-primary mb-4 italic">{selectedRegion.product}</h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-8 font-light italic">
                        "{selectedRegion.details}"
                      </p>
                      <button 
                        onClick={() => setShowFarmDetails(true)}
                        className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-widest hover:text-accent transition-colors group/btn"
                      >
                        <span>{t('view_farm_details')}</span>
                        <ArrowUpRight className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Info className="w-24 h-24" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Farm Details Modal */}
      <AnimatePresence>
        {showFarmDetails && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFarmDetails(false)}
              className="absolute inset-0 bg-primary/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white p-10 rounded-[2.5rem] shadow-3xl max-w-lg w-full text-center"
            >
              <h3 className="text-3xl font-serif font-bold text-primary mb-6 italic">{selectedRegion.name} Facility</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Our facilities in {selectedRegion.name} are equipped with state-of-the-art processing units. 
                Currently processing <span className="text-accent font-bold">{selectedRegion.product}</span> with 
                advanced quality controls and direct farm-to-port logistics.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-10">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Status</div>
                  <div className="text-sm font-bold text-green-500">Active Sourcing</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <div className="text-[10px] text-gray-400 uppercase font-bold mb-1">Capacity</div>
                  <div className="text-sm font-bold text-primary">500 Tons/Month</div>
                </div>
              </div>
              <button 
                onClick={() => setShowFarmDetails(false)}
                className="btn-primary w-full py-4 text-xs tracking-widest font-bold uppercase"
              >
                Close Details
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default OriginTraceability;
