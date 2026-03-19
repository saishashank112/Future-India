import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const events = [
  { year: '2015', title: 'The Genesis', text: 'Established as a procurement collective in Sangli, specializing in high-curcumin turmeric.' },
  { year: '2019', title: 'Global Port Entry', text: 'Successfully audited and authorized for direct spice exports to the European Union and UAE.' },
  { year: '2023', title: 'Agri-Tech Hub', text: 'Implemented real-time supply chain monitoring for 100% transparency from farm to port.' },
  { year: '2030', title: 'Vision Zero', text: 'Pioneering zero-carbon shipping and biodegradable bulk packaging for the next decade.' },
];

const AboutPreview = () => {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-24 items-center">
          <div className="w-full lg:w-1/2">
            <span className="text-accent font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">Our Legacy</span>
            <h2 className="text-4xl md:text-7xl font-serif font-bold text-primary mb-10 leading-[1.1]">Decades of Trust, <br className="hidden md:block" /> Future of Agri-Tech.</h2>
            <p className="text-lg text-gray-500 font-light leading-relaxed mb-12 max-w-xl">
              Future India Exim isn't just an export house; it's a bridge of radical transparency. we blend traditional harvesting wisdom with blockchain-level traceability to deliver the absolute peak of Indian agricultural excellence.
            </p>
            <Link to="/about" className="group btn-primary py-4 px-10 inline-flex items-center space-x-3 text-sm">
              <span>Our Story</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="w-full lg:w-1/2 relative">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
            <div className="space-y-16 pl-12 relative">
              {events.map((event, idx) => (
                <motion.div 
                  key={event.year}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group"
                >
                  <div className="absolute -left-[61px] top-1.5 w-6 h-6 rounded-lg bg-white border border-primary/10 flex items-center justify-center shadow-sm group-hover:bg-accent group-hover:border-accent transition-all duration-500">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent group-hover:bg-primary transition-colors" />
                  </div>
                  <div className="text-accent font-bold text-xs tracking-widest uppercase mb-2">{event.year}</div>
                  <h4 className="text-2xl font-serif font-bold text-primary mb-3 group-hover:text-accent transition-colors">{event.title}</h4>
                  <p className="text-sm text-gray-400 font-medium leading-relaxed max-w-sm">{event.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPreview;
