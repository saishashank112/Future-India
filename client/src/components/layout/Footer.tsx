import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Linkedin, Facebook, Instagram, ChevronRight, MessageSquare } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { useLanguage } from '../../context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openEnquiryModal } = useModal();
  const { t } = useLanguage();

  return (
    <footer className="bg-[#051c14] text-white pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Company Brief */}
          <div className="space-y-8">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                <span className="text-primary font-bold text-xl">FI</span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl leading-none">FUTURE INDIA</span>
                <span className="text-[10px] tracking-[0.2em] font-bold text-accent">EXIM</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Pioneering the global bridge for India's finest agricultural treasures. Delivering excellence, ethics, and quality to every corner of the world.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-300">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Core Navigation */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-8 text-accent">Navigation</h4>
            <ul className="space-y-4">
              {[
                { name: t('home'), path: '/' },
                { name: t('products'), path: '/products' },
                { name: t('global_network'), path: '/global-network' },
                { name: t('our_process'), path: '/our-process' },
                { name: t('about'), path: '/about' },
                { name: t('contact'), path: '/contact' }
              ].map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/50 hover:text-white flex items-center space-x-2 group text-sm transition-colors">
                    <ChevronRight className="w-3 h-3 text-accent opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-8 text-accent">Corporate Hub</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <span className="text-white/50 text-sm leading-relaxed">
                  12th Floor, Trade Center, BKC, Mumbai, Maharashtra 400051, India
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <span className="text-white/50 text-sm">contact@futureindiaexim.com</span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <span className="text-white/50 text-sm">+91 22 4567 8900</span>
              </li>
            </ul>
          </div>

          {/* CTA Section */}
          <div className="space-y-6">
            <h4 className="font-serif font-bold text-lg mb-8 text-accent">Export Enquiry</h4>
            <p className="text-white/50 text-sm leading-relaxed">
              Looking for a custom export quote? Our team responds within 12 hours.
            </p>
            <button 
              onClick={() => openEnquiryModal()}
              className="w-full btn-accent flex items-center justify-center space-x-2 py-4"
            >
              <MessageSquare className="w-5 h-5" />
              <span>{t('get_enquiry')}</span>
            </button>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-white/30 text-xs font-medium">
            © {currentYear} Future India Exim. Standard for Excellence in Agriculture.
          </p>
          <div className="flex items-center space-x-8 text-white/30 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-accent transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-accent transition-colors">Export Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
