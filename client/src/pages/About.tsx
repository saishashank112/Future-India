import { motion } from 'framer-motion';
import { Target, Eye, ShieldCheck, CheckCircle2, TrendingUp, Ship, ClipboardCheck, Sparkles } from 'lucide-react';
import PremiumImage from '../components/ui/PremiumImage';

const About = () => {
  const pipelineSteps = [
    { icon: Sparkles, title: "Sourcing", text: "Directly from certified farm clusters." },
    { icon: ClipboardCheck, title: "QC Check", text: "Rigorous 3-stage lab testing." },
    { icon: TrendingUp, title: "Processing", text: "Clean & Grade in automated units." },
    { icon: Ship, title: "Dispatch", text: "Seamless port-to-port logistics." },
  ];

  return (
    <div className="pt-32 pb-24 bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-6 mb-32">
        <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div>
            <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-primary mb-8 leading-tight">
              Cultivating Trust, Exporting Excellence.
            </h1>
            <p className="text-xl text-gray-500 leading-relaxed font-light mb-10">
              Future India Exim was born from a simple vision: to bring the richness of India's agricultural heritage to the global stage with uncompromising transparency and ethics.
            </p>
            <div className="flex gap-10">
              <div>
                <div className="text-3xl font-bold text-primary">2015</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Founding Year</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">8500+</div>
                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Farmer Network</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl relative z-10">
              <PremiumImage src="https://images.unsplash.com/photo-1500382017468-9049fed747ef" alt="Farm Landscape" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-accent/20 rounded-full blur-3xl -z-0" />
          </div>
        </div>
      </section>

      {/* Mission/Vision Section */}
      <section className="bg-primary/5 py-32 mb-32">
        <div className="container mx-auto px-6">
          <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { 
                icon: Target, 
                title: "Our Mission", 
                text: "To bridge the gap between Indian farmers and global markets through technology, transparency, and top-tier logistics." 
              },
              { 
                icon: Eye, 
                title: "Our Vision", 
                text: "To become the world's most trusted name in premium agricultural exports, recognized for quality and ethical practices." 
              },
              { 
                icon: ShieldCheck, 
                title: "Our Pledge", 
                text: "Zero contamination, complete traceability, and fair remuneration for every stakeholder in our supply chain." 
              }
            ].map((card, idx) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-12 rounded-[2.5rem] shadow-sm border border-black/5 hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-8 group-hover:bg-accent transition-colors">
                  <card.icon className="w-8 h-8 text-accent group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary mb-6">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed font-light text-sm">{card.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline Section (Layout Fix) */}
      <section className="container mx-auto px-6 mb-32">
        <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row gap-24 items-center">
          <div className="w-full lg:w-1/2 space-y-10">
            <div>
              <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">Supply Chain</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-primary mb-8 leading-tight italic">Expertise That Scales <br/> Across Continents.</h2>
              <p className="text-lg text-gray-500 font-light leading-relaxed">
                We manage the entire export pipeline in-house to ensure radical quality control and total traceability from farm cluster to final port.
              </p>
            </div>
            
            <ul className="space-y-8">
              {[
                "Modern quality control laboratories at source.",
                "Direct partnerships with 50+ localized farm clusters.",
                "Advanced dehumidification & temperature control units.",
                "Global compliance for EU, GCC & US markets."
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-5">
                  <div className="w-6 h-6 rounded-lg bg-accent/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-bold text-primary uppercase tracking-wider">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="grid grid-cols-2 gap-8 relative z-10">
              {pipelineSteps.map((step, idx) => (
                <div key={idx} className={`p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-lg transition-all ${idx % 2 !== 0 ? 'mt-12' : ''}`}>
                  <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center mb-6">
                    <step.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="text-lg font-serif font-bold text-primary mb-2 italic">0{idx + 1}. {step.title}</h4>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed uppercase tracking-widest">{step.text}</p>
                </div>
              ))}
            </div>
            {/* Visual background element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-[5rem] -rotate-6 -z-0" />
          </div>
        </div>
      </section>

      {/* Final Section */}
      <section className="container mx-auto px-6">
        <div className="max-w-[1240px] mx-auto bg-primary rounded-[4rem] p-20 text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white mb-8">Ready to secure your supply?</h2>
            <p className="text-white/60 mb-12 max-w-2xl mx-auto font-light">Join over 40+ countries that trust Future India Exim for their premium agricultural requirements.</p>
            <Link to="/contact" className="btn-accent px-12 py-5 text-sm font-bold tracking-widest uppercase inline-block">Work With Us</Link>
          </div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
        </div>
      </section>
    </div>
  );
};

import { Link } from 'react-router-dom';
export default About;
