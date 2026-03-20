import { motion } from 'framer-motion';
import { Globe2, Ship, Clock } from 'lucide-react';

const GlobalPresence = () => {

  const stats = [
    { label: 'Countries', value: '42+', icon: Globe2 },
    { label: 'On-Time', value: '99.2%', icon: Clock },
    { label: 'Ports', value: '15+', icon: Ship },
  ];

  const shipments = [
    { target: 'UAE (DUBAI)', status: 'IN TRANSIT', time: '02h 14m' },
    { target: 'GERMANY (HAMBURG)', status: 'DISPATCHED', time: '05h 42m' },
    { target: 'SINGAPORE', status: 'PROCESSING', time: '21h 05m' },
  ];

  return (
    <section className="relative py-10 md:py-12 bg-black border-y border-white/5 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad86d5e7a390?auto=format&fit=crop&q=80&w=2000" 
          alt="Logistics Background" 
          className="w-full h-full object-cover opacity-[0.05]"
        />
      </div>
      <div className="w-full px-0 lg:px-12 relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-0 lg:gap-16">
          
          {/* Left: Operational Metrics */}
          <div className="w-full lg:w-[40%] px-6 lg:px-0 z-10 py-10 lg:py-0">
            <div className="space-y-8">
              <div>
                <span className="text-accent font-black tracking-[0.2em] uppercase text-[10px] mb-2 block">Global Operations</span>
                <h2 className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-4 tracking-tight uppercase">
                  Agri-Trade <br />Intelligence.
                </h2>
                <p className="text-white/40 text-sm md:text-base leading-relaxed font-medium max-w-md">
                   Sovereign supply chain connectivity leveraging India's strategic agricultural nodes for global distribution.
                </p>
              </div>

              {/* Dashboard Metrics Strip */}
              <div className="flex items-center space-x-8 py-6 border-y border-white/10">
                {stats.map((stat) => (
                  <div key={stat.label} className="flex flex-col">
                    <span className="text-2xl font-bold font-mono text-white tracking-tighter">{stat.value}</span>
                    <span className="text-[9px] text-white/30 uppercase font-black tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </div>

              {/* Terminal Logs View */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-black text-accent uppercase tracking-[0.2em]">Live Export Stream</h4>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-bold text-green-500 uppercase">System Active</span>
                  </div>
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 rounded-sm divide-y divide-white/5">
                  {shipments.map((shipment, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 font-mono">
                      <div className="flex items-center space-x-3">
                        <div className="w-1 h-3 bg-accent" />
                        <span className="text-[11px] font-bold text-white/90">{shipment.target}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="text-[9px] font-bold text-white/30">{shipment.status}</span>
                        <span className="text-[9px] text-white/20">{shipment.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Large World Map (Map First on Mobile handled by flex-col-reverse) */}
          <div className="w-full lg:w-[60%] lg:h-[600px] relative mt-10 lg:mt-0 flex items-center justify-center">
             <div className="absolute inset-0 bg-accent/5 blur-[120px] rounded-full" />
             
             <div className="relative w-full max-w-[800px] aspect-video lg:aspect-square flex items-center justify-center p-4">
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/e/ec/World_Map_Blank.svg" 
                 alt="World Map" 
                 className="w-full opacity-5 filter brightness-200 contrast-200 pointer-events-none"
               />
               
               {/* Animated Shipping Lanes from India (Approx 45% Top, 73% Left for World Map SVG) */}
               {/* Destination nodes */}
               {[
                 { top: '35%', left: '78%', delay: 0 }, // USA East
                 { top: '25%', left: '48%', delay: 0.5 }, // Europe
                 { top: '38%', left: '60%', delay: 1 }, // UAE
                 { top: '45%', left: '82%', delay: 1.5 }, // SE Asia
               ].map((node, i) => (
                 <div key={i} className="absolute" style={{ top: node.top, left: node.left }}>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 3, delay: node.delay }}
                      className="w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_rgba(212,175,55,1)]" 
                    />
                 </div>
               ))}

               {/* Origin India */}
               <div className="absolute top-[45%] left-[73%]">
                 <div className="w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)] z-20" />
                 <div className="absolute inset-0 bg-white rounded-full animate-ping" />
               </div>

               {/* SVG Paths for Curved Lines */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                 <defs>
                   <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                     <stop offset="0%" stopColor="white" stopOpacity="0" />
                     <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.5" />
                     <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="1" />
                   </linearGradient>
                 </defs>
                 
                 {/* India to Europe */}
                 <motion.path 
                   d="M 600,280 Q 500,200 400,150" 
                   stroke="url(#lineGrad)" strokeWidth="1" fill="transparent" 
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                   transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                 />
                 {/* India to UAE */}
                 <motion.path 
                   d="M 600,280 Q 550,260 500,240" 
                   stroke="url(#lineGrad)" strokeWidth="1" fill="transparent" 
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                   transition={{ repeat: Infinity, duration: 4, delay: 1, ease: "linear" }}
                 />
                 {/* India to SE Asia */}
                 <motion.path 
                   d="M 600,280 Q 650,300 700,320" 
                   stroke="url(#lineGrad)" strokeWidth="1" fill="transparent" 
                   initial={{ pathLength: 0, opacity: 0 }}
                   animate={{ pathLength: 1, opacity: [0, 1, 0] }}
                   transition={{ repeat: Infinity, duration: 4, delay: 2, ease: "linear" }}
                 />
               </svg>
             </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;
