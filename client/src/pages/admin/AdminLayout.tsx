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
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5001/api/admin/inquiries').then(res => res.json()),
      fetch('http://localhost:5001/api/admin/orders').then(res => res.json())
    ]).then(([inqRes, ordRes]) => {
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
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Orders', icon: ClipboardList, path: '/admin/orders' },
    { name: 'Delivery', icon: Truck, path: '/admin/delivery' },
    { name: 'Products', icon: ShoppingBasket, path: '/admin/products' },
    { name: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
    { name: 'Settings', icon: User, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };


  return (
    <div className="flex min-h-screen bg-[#F8FAFB]">
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-primary/20 backdrop-blur-sm z-[140] lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`w-72 bg-primary text-white flex flex-col fixed inset-y-0 shadow-2xl z-[150] rounded-r-[2.5rem] overflow-hidden transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 pb-12 flex justify-between items-start">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
              <span className="text-primary font-bold text-xl uppercase">FI</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg tracking-tight leading-none text-white italic">ADMIN PANEL</span>
              <span className="text-[9px] tracking-[0.3em] font-bold text-accent uppercase mt-1">Executive Portal</span>
            </div>
          </Link>
          <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 font-bold text-[10px] uppercase tracking-[0.2em] group ${
                location.pathname === item.path 
                  ? 'bg-accent text-primary shadow-2xl shadow-accent/40' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-3">
                <item.icon className={`w-4 h-4 flex-shrink-0 ${location.pathname === item.path ? 'text-primary' : 'text-white/20 group-hover:text-white'}`} />
                <span>{item.name}</span>
              </div>
              {location.pathname === item.path && <ChevronRight className="w-3 h-3" />}
            </Link>
          ))}
        </nav>

        <div className="p-8 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-6 py-4 w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-2xl font-bold text-[9px] uppercase tracking-[0.3em]"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-72 min-h-screen flex flex-col w-full transition-all">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 flex items-center justify-between sticky top-0 z-[130]">
           <div className="flex items-center gap-4 flex-1">
                <button className="lg:hidden text-primary p-2" onClick={() => setIsMobileMenuOpen(true)}>
                   <Menu className="w-6 h-6" />
                </button>
                <div className="relative max-w-sm w-full hidden md:block">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-4 text-gray-400" />
                    <input type="text" placeholder="Search global datasets..." className="w-full pl-10 pr-6 py-2.5 rounded-xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-[10px] font-medium" />
                </div>
           </div>

           <div className="flex items-center gap-6">
                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary relative hover:bg-gray-100 transition-colors">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent border-2 border-white rounded-full" />
                    </button>
                    {showNotifications && (
                        <div className="absolute top-14 left-1/2 -translate-x-1/2 sm:left-auto sm:right-0 sm:translate-x-0 w-[calc(100vw-2rem)] sm:w-80 bg-white rounded-3xl shadow-3xl border border-gray-50 p-5 z-[160] max-h-[80vh] overflow-y-auto">
                            <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-4 px-1">Notifications</h4>
                            <div className="space-y-3">
                                {notifications.map(n => (
                                    <div key={n.id} className="p-3 bg-gray-50 rounded-xl hover:bg-accent/5 cursor-pointer group">
                                        <p className="text-[10px] font-bold text-primary mb-1">{n.text}</p>
                                        <p className="text-[8px] text-gray-400">{n.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none mb-1">{user?.email?.split('@')[0]}</p>
                        <p className="text-[8px] font-bold text-accent uppercase tracking-[0.2em]">{user?.role}</p>
                    </div>
                </div>
           </div>
        </header>
        <main className="p-8 animate-fade-in">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
