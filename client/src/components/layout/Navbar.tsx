import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../../context/ModalContext';
import { useLanguage } from '../../context/LanguageContext';

const languages = [
  { code: 'EN', name: 'English' },
  { code: 'AR', name: 'العربية' },
  { code: 'FR', name: 'Français' },
  { code: 'DE', name: 'Deutsch' },
  { code: 'ES', name: 'Español' },
  { code: 'HI', name: 'हिन्दी' },
  { code: 'ZH', name: '中文' },
  { code: 'RU', name: 'Русский' },
  { code: 'PT', name: 'Português' },
  { code: 'JA', name: '日本語' }
] as const;

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { openEnquiryModal } = useModal();
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('home'), path: '/' },
    { name: t('products'), path: '/products' },
    { name: t('global_network'), path: '/global-network' },
    { name: t('our_process'), path: '/our-process' },
    { name: t('about'), path: '/about' },
    { name: t('contact'), path: '/contact' },
  ];

  const handleLangSelect = (code: any) => {
    setLanguage(code);
    setIsLangOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isDarkBg = location.pathname === '/' && !isScrolled;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={handleLogoClick} className="flex items-center space-x-3 group">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
            <span className="text-accent font-bold text-xl">FI</span>
          </div>
          <div className="flex flex-col">
            <span className={`font-serif font-bold text-xl tracking-tight leading-none ${isDarkBg ? 'text-white' : 'text-primary'}`}>
              FUTURE INDIA
            </span>
            <span className="text-[10px] tracking-[0.3em] font-bold text-accent">
              EXIM
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:bg-black/5 ${
                location.pathname === link.path 
                  ? 'text-accent' 
                  : isDarkBg ? 'text-white/90' : 'text-primary'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {/* Language Switcher */}
          <div className="relative">
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-black/5 transition-all ${
                isDarkBg ? 'text-white' : 'text-primary'
              }`}
            >
              <Globe className="w-4 h-4 text-accent" />
              <span>{language}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isLangOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl py-2 border border-gray-100 overflow-hidden"
                >
                  <div className="grid grid-cols-1 max-h-64 overflow-y-auto">
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLangSelect(lang.code)}
                        className={`px-6 py-2.5 text-left text-sm font-medium transition-colors hover:bg-gray-50 flex items-center justify-between ${
                          language === lang.code ? 'text-accent' : 'text-primary'
                        }`}
                      >
                        {lang.name}
                        {language === lang.code && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={() => openEnquiryModal()}
            className="btn-primary py-2.5 px-6 text-sm flex items-center space-x-2 shadow-xl hover:shadow-primary/20"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t('get_enquiry')}</span>
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button 
          className="lg:hidden p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen 
            ? <X className={isDarkBg && !isMobileMenuOpen ? 'text-white' : 'text-primary'} /> 
            : <Menu className={isDarkBg ? 'text-white' : 'text-primary'} />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[110] lg:hidden bg-white"
          >
            <div className="flex flex-col h-full uppercase">
              <div className="p-6 flex items-center justify-between border-b border-gray-100">
                <span className="font-serif font-bold text-xl text-primary">MENU</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 bg-gray-50 rounded-xl">
                  <X className="w-6 h-6 text-primary" />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto py-8 px-6 space-y-6">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path} 
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-2xl font-serif font-bold text-primary hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="pt-8 border-t border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-4">Choose Language</span>
                  <div className="grid grid-cols-2 gap-3">
                    {languages.map(lang => (
                      <button 
                        key={lang.code}
                        onClick={() => handleLangSelect(lang.code)}
                        className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                          language === lang.code 
                            ? 'bg-primary text-white border-primary' 
                            : 'bg-gray-50 text-primary border-transparent'
                        }`}
                      >
                        {lang.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-gray-50">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openEnquiryModal();
                  }}
                  className="w-full btn-primary py-4 text-center text-lg flex items-center justify-center space-x-3"
                >
                  <MessageSquare className="w-6 h-6" />
                  <span>{t('get_enquiry')}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
