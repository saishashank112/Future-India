import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { useModal } from '../../context/ModalContext';
import { useLanguage } from '../../context/LanguageContext';
import { useSettings } from '../../context/SettingsProvider';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { openEnquiryModal } = useModal();
  const { t } = useLanguage();
  const { settings } = useSettings();

  return (
    <footer className="bg-[#051c14] text-white pt-12 pb-6 border-t border-white/10">
      <div className="max-w-6xl mx-auto px-4">

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-3 gap-10 pb-10 border-b border-white/10">

          {/* CONTACT */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/70">
              Corporate Hub
            </h4>

            <div className="flex flex-col md:flex-row items-center gap-3 text-sm text-white/80">
              <MapPin className="w-4 h-4 text-accent" />
              <p>
                {settings.company_address}
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3 text-sm text-white/80">
              <Mail className="w-4 h-4 text-accent" />
              <span>{settings.company_email}</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3 text-sm text-white/80">
              <Phone className="w-4 h-4 text-accent" />
              <span>{settings.company_phone}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/70">
              Export Enquiry
            </h4>

            <p className="text-sm text-white/60">
              Get a fast quote for bulk export requirements.
            </p>

            <button
              onClick={() => openEnquiryModal()}
              className="flex items-center gap-3 px-6 py-4 
                         bg-[#c9a13b] text-[#052e22] 
                         font-semibold text-sm tracking-wide
                         rounded-full 
                         hover:scale-105 
                         hover:shadow-[0_0_20px_rgba(201,161,59,0.4)]
                         transition-all duration-300 w-fit mx-auto md:mx-0"
            >
              <MessageSquare className="w-5 h-5" />
              {t('get_enquiry')}
            </button>
          </div>

          {/* BRAND */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-5">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white/70">
              Global Trade Partner
            </h4>

            <p className="text-sm text-white/60 leading-relaxed max-w-sm">
              Delivering consistent quality and reliable export logistics across 30+ countries with precision and trust.
            </p>
          </div>

        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-6 text-xs text-white/50">

          {/* LANGUAGE */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <span className="uppercase tracking-widest text-white/40">
              Language
            </span>
            <div id="google_translate_element" />
          </div>

          {/* COPYRIGHT */}
          <p className="text-center md:text-right">
            © {currentYear} Future India Exim. All rights reserved.
          </p>

        </div>

      </div>
    </footer>
  );
};

export default Footer;