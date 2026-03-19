import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBasket, 
  MessageSquare, 
  LogOut, 
  Bell, 
  Search, 
  User, 
  ChevronRight,
  Truck,
  ClipboardList,
  Menu,
  X,
  Activity,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect, useCallback } from 'react';

interface NotificationItem {
  id: string;
  text: string;
  time: string;
  type: string;
  ts: number;
}

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  useEffect(() => {
    // Close menu on route change
    closeMobileMenu();
  }, [location.pathname, closeMobileMenu]);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      fetch('http://localhost:5001/api/admin/inquiries').then(res => res.json()),
      fetch('http://localhost:5001/api/admin/orders').then(res => res.json())
    ]).then(([inqRes, ordRes]) => {
      if (!isMounted) return;
      const inqs = inqRes.data || [];
      const ords = ordRes.data || [];
      
      const combined = [
        ...inqs.slice(0, 3).map((i: any) => ({
          id: `inq-${i.id}`,
          text: `New enquiry from ${i.name}`,
          time: new Date(i.created_at).toLocaleDateString(),
          type: 'enquiry',
          ts: new Date(i.created_at).getTime()
        })),
        ...ords.slice(0, 3).map((o: any) => ({
          id: `ord-${o.id}`,
          text: `New order #${o.order_code}`,
          time: new Date(o.created_at).toLocaleDateString(),
          type: 'delivery',
          ts: new Date(o.created_at).getTime()
        }))
      ].sort((a, b) => b.ts - a.ts).slice(0, 5);
      
      setNotifications(combined);
    }).catch(console.error);
    return () => { isMounted = false; };
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Orders', icon: ClipboardList, path: '/admin/orders' },
    { name: 'Delivery', icon: Truck, path: '/admin/delivery' },
    { name: 'Products', icon: ShoppingBasket, path: '/admin/products' },
    { name: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
    { name: 'Customers', icon: User, path: '/admin/customers' },
    { name: 'Reports', icon: ClipboardList, path: '/admin/reports' },
    { name: 'Settings', icon: User, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFB] font-sans">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[140] lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className={`w-72 bg-primary text-white flex flex-col fixed inset-y-0 shadow-2xl z-[150] rounded-r-[2rem] overflow-hidden transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 pb-12 flex justify-between items-start">
          <Link to="/" className="flex items-center space-x-3 group" onClick={closeMobileMenu}>
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
              <span className="text-primary font-black text-lg">FI</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-base tracking-tight leading-none text-white italic uppercase">Executive</span>
              <span className="text-[8px] tracking-[0.3em] font-black text-accent uppercase mt-1">Admin Protocol</span>
            </div>
          </Link>
          <button className="lg:hidden text-white/50" onClick={closeMobileMenu}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={`flex items-center justify-between px-5 py-3.5 rounded-xl transition-all duration-300 font-bold text-[9px] uppercase tracking-[0.2em] group ${
                location.pathname === item.path 
                  ? 'bg-accent text-primary shadow-xl shadow-accent/20' 
                  : 'text-white/30 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-4 h-4 ${location.pathname === item.path ? 'text-primary' : 'text-white/10 group-hover:text-white'}`} />
                <span>{item.name}</span>
              </div>
              {location.pathname === item.path && <ChevronRight className="w-2.5 h-2.5" />}
            </Link>
          ))}
        </nav>

        <div className="p-8 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-6 py-4 w-full bg-red-500/10 text-red-400 hover:bg-red-50 hover:text-white transition-all rounded-xl font-bold text-[8px] uppercase tracking-[0.3em]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-72 min-h-screen flex flex-col w-full transition-all overflow-x-hidden">
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[130]">
           <div className="flex items-center gap-3 md:gap-4 flex-1">
                <button className="lg:hidden text-primary p-2 active:scale-90 transition-transform" onClick={() => setIsMobileMenuOpen(true)}>
                   <Menu className="w-5 h-5" />
                 </button>
                <div className="relative max-w-sm w-full hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-4 text-gray-400" />
                    <input type="text" placeholder="Protocol search..." className="w-full pl-10 pr-6 py-2 rounded-xl bg-gray-50 border-none outline-none text-[9px] font-bold uppercase tracking-widest" />
                </div>
                <div className="flex md:hidden items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                    <Activity className="w-2.5 h-2.5 text-accent animate-pulse" />
                    <span className="text-[7px] font-black text-primary uppercase tracking-[0.2em]">Live Stream</span>
                </div>
           </div>

           <div className="flex items-center gap-3 md:gap-6">
                <button onClick={() => setShowNotifications(!showNotifications)} className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary relative border border-gray-100 active:scale-95 transition-transform">
                    <Bell className="w-3.5 h-3.5" />
                    <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-accent border-2 border-white rounded-full" />
                </button>
                
                <div className="flex items-center gap-3 pl-3 md:pl-6 border-l border-gray-100">
                    <div className="text-right hidden xs:block">
                        <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-none mb-1">{user?.email?.split('@')[0] || 'ADMIN'}</p>
                        <p className="text-[7px] font-bold text-accent uppercase tracking-[0.2em]">{user?.role || 'EXECUTIVE'}</p>
                    </div>
                    <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-serif font-black text-xs border-2 border-primary shadow-lg">
                        {user?.email?.[0]?.toUpperCase() || 'A'}
                    </div>
                </div>
           </div>

           {/* Notifications Dropdown */}
           {showNotifications && (
             <div className="absolute top-16 right-4 sm:right-8 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-3xl shadow-3xl border border-gray-50 p-5 z-[160] max-h-[70vh] overflow-y-auto">
                 <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Notifications</h4>
                 <div className="space-y-3">
                     {notifications.map(n => (
                         <div key={n.id} className="p-3 bg-gray-50 rounded-xl hover:bg-accent/5 cursor-pointer group">
                             <p className="text-[10px] font-bold text-primary mb-1">{n.text}</p>
                             <p className="text-[8px] text-gray-400">{n.time}</p>
                         </div>
                     ))}
                     {notifications.length === 0 && <p className="text-center py-4 text-[10px] text-gray-400">No active signals.</p>}
                 </div>
             </div>
           )}
        </header>

        <main className="p-4 md:p-10 animate-fade-in flex-grow pb-24 md:pb-10 h-full">{children}</main>

        {/* MOBILE BOTTOM NAVIGATION - HIGH EFFICIENCY DOCK */}
        <nav className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] h-16 bg-primary/95 backdrop-blur-xl border border-white/10 flex items-center justify-around px-2 z-[140] shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2rem]">
           {[
             { path: '/admin', icon: LayoutDashboard, label: 'Hub' },
             { path: '/admin/orders', icon: ClipboardList, label: 'Orders' },
             { path: '/admin/enquiries', icon: MessageSquare, label: 'Leads' },
             { path: '/admin/reports', icon: ShieldCheck, label: 'Audit' },
           ].map((item) => (
             <Link
               key={item.path}
               to={item.path}
               className={`flex flex-col items-center gap-1 group px-4 py-1.5 rounded-2xl transition-all ${
                 location.pathname === item.path ? 'text-accent' : 'text-white/40'
               }`}
             >
               <item.icon className={`w-5 h-5 transition-transform ${location.pathname === item.path ? 'scale-110 active:scale-125' : 'group-active:scale-90'}`} />
               <span className={`text-[7px] font-black uppercase tracking-[0.1em] ${location.pathname === item.path ? 'opacity-100' : 'opacity-60'}`}>
                 {item.label}
               </span>
             </Link>
           ))}
        </nav>
      </div>
    </div>
  );
};

export default AdminLayout;
