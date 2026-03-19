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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20">

          {/* Contact Details */}
          <div>
            <h4 className="font-serif font-bold text-lg mb-8 text-accent">Corporate Hub</h4>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-accent" />
                </div>
                <span className="text-white/50 text-sm leading-relaxed">
                  Dno.41-1/16-3, Bapanaiah Nagar, Krishnalanka, Bank Colony,<br />Vijayawada, Andhra Pradesh, India - 520013
                </span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-accent" />
                </div>
                <span className="text-white/50 text-sm">contact@futureindiaexim.in</span>
              </li>
              <li className="flex items-center space-x-4">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-accent" />
                </div>
                <span className="text-white/50 text-sm">+91 80378 82249</span>
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
