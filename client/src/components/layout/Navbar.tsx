import { getApiUrl } from '../../config/api';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  MessageSquare,
  ShoppingCart,
  User,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from '../../context/ModalContext';
import { useLanguage, type Language } from '../../context/LanguageContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const languages = [
  { code: 'EN', name: 'English' },
  { code: 'EN_IN', name: 'English-IND' },
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

const NotificationBell = ({ userId, isDarkBg }: { userId: number, isDarkBg: boolean }) => {
  const [notifications, setNotifications] = useState<{id: number, message: string, type: string, is_read: number, created_at: string}[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(getApiUrl(`/notifications/${userId}`));
        const data = await res.json();
        if (res.ok) setNotifications(data.data || []);
      } catch (e) { console.error(e); }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const markAsRead = async (id: number) => {
    try {
      await fetch(getApiUrl(`/notifications/read/${id}`), { method: 'POST' });
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-black/5 transition-colors relative"
      >
        <Bell className={`w-5 h-5 ${isDarkBg ? 'text-white' : 'text-primary'}`} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 py-4 z-[110] overflow-hidden"
          >
            <div className="px-6 pb-4 border-b border-gray-50 flex justify-between items-center">
              <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest">Notifications</h4>
              {unreadCount > 0 && <span className="text-[9px] font-medium text-accent uppercase tracking-widest">{unreadCount} New</span>}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <Bell className="w-8 h-8 text-gray-100 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">No new updates</p>
                </div>
              ) : (
                notifications.map(n => (
                  <div
                    key={n.id}
                    className={`p-5 hover:bg-gray-50 transition-colors border-b border-gray-50 flex gap-4 cursor-pointer ${!n.is_read ? 'bg-accent/5' : ''}`}
                    onClick={() => !n.is_read && markAsRead(n.id)}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'order_update' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                      {n.type === 'order_update' ? <ShoppingCart className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className={`text-[11px] leading-relaxed mb-1 ${!n.is_read ? 'font-bold text-primary' : 'text-gray-500'}`}>{n.message}</p>
                      <p className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">{new Date(n.created_at).toLocaleDateString()}</p>
                    </div>
                    {!n.is_read && <div className="w-2 h-2 rounded-full bg-accent mt-1" />}
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { openEnquiryModal } = useModal();
  const { language, setLanguage, t } = useLanguage();
  const { user } = useAuth();
  const { itemCount } = useCart();
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

  const handleLangSelect = (code: Language) => {
    setLanguage(code);
    setIsLangOpen(false);
  };

  const handleLogoClick = () => {
    if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isDarkBg = location.pathname === '/' && !isScrolled;
  const showSolidBg = isScrolled || location.pathname !== '/';

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${showSolidBg
          ? 'bg-white/95 backdrop-blur-md shadow-lg py-3 border-b border-gray-100'
          : 'bg-transparent py-5'
          }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={handleLogoClick} className="flex items-center space-x-3 group">
            <div className="w-20 h-20 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <img src="/images/logo.png" alt="" />
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
          <div className="hidden lg:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-2.5 text-[15px] font-bold rounded-lg transition-all hover:bg-black/5 ${location.pathname === link.path
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
                className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg hover:bg-black/5 transition-all ${isDarkBg ? 'text-white' : 'text-primary'
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
                          className={`px-6 py-2.5 text-left text-sm font-medium transition-colors hover:bg-gray-50 flex items-center justify-between ${language === lang.code ? 'text-accent' : 'text-primary'
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

            {/* Cart Icon */}
            <Link
              to="/cart"
              className={`relative p-2 rounded-lg hover:bg-black/5 transition-colors ${isDarkBg ? 'text-white' : 'text-primary'}`}
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* User Profile / Notifications */}
            {user ? (
              <div className="flex items-center space-x-2">
                <NotificationBell userId={user.id} isDarkBg={isDarkBg} />
                <Link
                  to={user.role === 'admin' ? '/admin' : '/my-account'}
                  className={`p-2 rounded-lg hover:bg-black/5 transition-colors ${isDarkBg ? 'text-white' : 'text-primary'}`}
                >
                  <User className="w-5 h-5" />
                </Link>
              </div>
            ) : (
              <Link
                to="/login"
                className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${isDarkBg ? 'text-white/90 hover:bg-white/10' : 'text-primary hover:bg-gray-50'}`}
              >
                Login
              </Link>
            )}

            <button
              onClick={() => openEnquiryModal()}
              className="btn-primary py-2.5 px-6 text-sm flex items-center space-x-2 shadow-xl hover:shadow-primary/20 ml-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('get_enquiry')}</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="lg:hidden flex items-center gap-2 pr-2">
            {user && <NotificationBell userId={user.id} isDarkBg={isDarkBg} />}
            <Link 
              to="/cart" 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`relative p-3 rounded-xl transition-all z-20 ${isDarkBg ? 'text-white hover:bg-white/10' : 'text-primary hover:bg-gray-100'}`}
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-accent text-white rounded-full text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-lg">
                  {itemCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`p-2 rounded-xl transition-all ${isDarkBg ? 'text-white hover:bg-white/10' : 'text-primary hover:bg-gray-100'}`}
            >
              {isMobileMenuOpen
                ? <X className="w-6 h-6" />
                : <Menu className="w-6 h-6" />
              }
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[120] lg:hidden bg-white"
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
                    className="block text-xl font-serif font-bold text-primary hover:text-accent transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}

                {user ? (
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/my-account'}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-serif font-bold text-primary hover:text-accent transition-colors pt-4 border-t border-gray-100"
                  >
                    {user.role === 'admin' ? 'Admin Panel' : 'My Account'}
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-lg font-serif font-bold text-primary hover:text-accent transition-colors pt-4 border-t border-gray-100"
                  >
                    Login / Register
                  </Link>
                )}
              </div>

              <div className="p-4 bg-gray-50/50">
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
    </>
  );
};

export default Navbar;
