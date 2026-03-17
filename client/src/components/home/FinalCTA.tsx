import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

const FinalCTA = () => {
  const { openEnquiryModal } = useModal();

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background with Dark Premium Aesthetic */}
      <div className="absolute inset-0 bg-[#051c14] -z-10" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -z-10 translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary-foreground/5 rounded-full blur-[100px] -z-10 -translate-x-1/2 translate-y-1/2" />
      
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-[2rem] bg-accent mb-4 shadow-2xl shadow-accent/20 rotate-6">
              <MessageSquare className="w-10 h-10 text-primary -rotate-6" />
            </div>
            
            <h2 className="text-4xl md:text-7xl font-serif font-bold text-white leading-tight">
              Scale Your Supply Chain <br className="hidden md:block" /> with Indian Excellence.
            </h2>
            
            <p className="text-xl text-white/40 font-light leading-relaxed max-w-2xl mx-auto">
              Ready to experience world-class quality? Our export experts provide specialized consulting for international bulk requirements.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <button 
                onClick={() => openEnquiryModal()}
                className="btn-accent px-12 py-5 text-xl w-full sm:w-auto flex items-center justify-center space-x-3 group shadow-2xl shadow-accent/10"
              >
                <span>Get Enquiry Now</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
              <Link to="/products" className="text-white/60 hover:text-white font-bold uppercase tracking-widest text-[10px] flex items-center space-x-3 transition-all group">
                <span className="border-b border-transparent group-hover:border-accent">Browse Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
