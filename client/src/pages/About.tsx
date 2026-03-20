import { motion } from 'framer-motion';
import { Eye, ShieldCheck, Zap, Award, ClipboardCheck, Ship, Users } from 'lucide-react';

const About = () => {
  const stats = [
    { label: "Elite Farmers", value: "8,500+", icon: Users, color: "bg-blue-100/50 text-blue-700" },
    { label: "Global Ports", value: "42", icon: Ship, color: "bg-orange-100/50 text-orange-700" },
    { label: "Quality Awards", value: "12", icon: Award, color: "bg-emerald-100/50 text-emerald-700" },
    { label: "Export Purity", value: "100%", icon: ShieldCheck, color: "bg-accent/20 text-accent-foreground" }
  ];

  const philosophy = [
    { 
      title: "Our Mission", 
      text: "Empowering the origin, streamlining the destination through radical transparency.", 
      icon: Zap,
      accent: "border-l-blue-600"
    },
    { 
      title: "Our Vision", 
      text: "To be the apex provider of premium spice and grain clusters globally.", 
      icon: Eye,
      accent: "border-l-orange-600"
    },
    { 
      title: "Our Pledge", 
      text: "Traceability beyond the label. Quality verified by third-party protocols.", 
      icon: ClipboardCheck,
      accent: "border-l-emerald-600"
    }
  ];

  return (
    <div className="bg-white text-primary overflow-x-hidden font-serif">
      
      {/* SECTION 1: HIGH CONTRAST MINIMAL HERO */}
      <section className="relative min-h-[60vh] flex items-center justify-center px-6 overflow-hidden pt-10 md:pt-20">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6 md:mb-8">
              <span className="text-primary/40 font-bold tracking-[0.5em] uppercase text-[10px]">The Legacy Report</span>
            </div>
            
            <h1 className="text-4xl md:text-8xl font-bold leading-tight tracking-tight mb-8 text-primary uppercase">
              RADICAL <br/>
              <span className="text-accent underline decoration-primary/10 underline-offset-[12px]">TRANSPARENCY.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-primary/60 max-w-2xl mx-auto font-light leading-relaxed italic">
              "We define the standard of Indian exports by documenting every touchpoint."
            </p>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: BOLD STATS (Responsive 2x2 Grid on Mobile) */}
      <section className="relative py-10 md:py-16 px-6 max-w-7xl mx-auto overflow-hidden rounded-[4rem]">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&q=80&w=2000" 
            alt="Farmers Background" 
            className="w-full h-full object-cover opacity-[0.03]"
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              className="bg-gray-50/80 backdrop-blur-sm p-5 md:p-10 rounded-[2.5rem] border border-gray-100 flex flex-col justify-between group h-full hover:bg-white hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-10 ${stat.color}`}>
                <stat.icon className="w-4 h-4 md:w-6 md:h-6" />
              </div>
              <div>
                <span className="text-2xl md:text-4xl font-bold block mb-2 text-primary tracking-tighter uppercase">{stat.value}</span>
                <span className="text-[9px] md:text-[11px] font-bold text-primary/40 uppercase tracking-widest leading-tight">{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 3: CORE TRIAD (Mobile Stack) */}
      <section className="relative py-12 md:py-24 px-6 bg-white border-y border-gray-50 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02] pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad86d5e7a390?auto=format&fit=crop&q=80&w=2000" 
            alt="Port Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 md:gap-32 items-center relative z-10">
          <div className="lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left">
            <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] block">Company Pillar</span>
            <h2 className="text-3xl md:text-6xl font-bold leading-tight text-primary uppercase">Integrity as <br className="hidden md:block"/> Backbone.</h2>
            <div className="w-16 h-1 bg-accent mx-auto lg:ml-0" />
            <p className="text-primary/60 text-base md:text-lg font-light leading-relaxed max-w-md mx-auto lg:ml-0">
              Future India Exim is engineered to bring India's best to the global consumer with absolute safety.
            </p>
          </div>

          <div className="lg:w-1/2 w-full space-y-4">
            {philosophy.map((item, idx) => (
              <div 
                key={idx}
                className={`p-6 md:p-10 bg-gray-50/30 border-l-4 ${item.accent} rounded-r-3xl flex items-center gap-6 group hover:bg-white hover:shadow-md transition-all`}
              >
                <div className="flex-1">
                  <h4 className="font-bold text-lg md:text-xl mb-2 text-primary uppercase tracking-tight">{item.title}</h4>
                  <p className="text-primary/60 text-xs md:text-sm font-light leading-relaxed">{item.text}</p>
                </div>
                <item.icon className="w-5 h-5 md:w-6 md:h-6 text-gray-200 group-hover:text-primary transition-all flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: PIPELINE (High Visibility Mobile Ready) */}
      <section className="py-12 md:py-24 px-6">
        <div className="max-w-5xl mx-auto text-center mb-10 md:mb-20">
          <h2 className="text-2xl md:text-5xl font-bold text-primary italic uppercase tracking-tighter">The Execution Flow</h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          {[
            { step: "01", title: "Harvest Selection", desc: "Sourcing elite batches from certified cluster farmers only." },
            { step: "02", title: "Batch Verification", desc: "Rigorous 3rd party lab testing for zero residue and purity." },
            { step: "03", title: "Global Logistics", desc: "Priority dispatch through our established shipping lanes." }
          ].map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-12 p-6 md:p-8 bg-gray-50 rounded-[2rem] md:rounded-[2.5rem] border border-gray-100 hover:border-accent/30 transition-all text-center md:text-left"
            >
              <div className="text-4xl md:text-7xl font-bold text-accent/40 italic flex-shrink-0 leading-none">
                {p.step}
              </div>
              <div className="space-y-2 md:space-y-3">
                <h3 className="text-xl md:text-2xl font-bold text-primary font-serif italic uppercase tracking-tight">{p.title}</h3>
                <p className="text-sm md:text-base text-primary/60 font-light leading-relaxed">{p.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
