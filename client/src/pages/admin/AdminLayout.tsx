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
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
    { name: 'Products', icon: ShoppingBasket, path: '/admin/products' },
    { name: 'Enquiries', icon: MessageSquare, path: '/admin/enquiries' },
    { name: 'Progress', icon: TrendingUp, path: '/admin/progress' },
    { name: 'Settings', icon: User, path: '/admin/settings' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const notifications = [
    { id: 1, text: "New enquiry from Germany", time: "2 min ago", type: "enquiry" },
    { id: 2, text: "Delivery status updated for Order #442", time: "1 hour ago", type: "delivery" },
    { id: 3, text: "Stock low for Black Pepper", time: "3 hours ago", type: "inventory" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFB]">
      <aside className="w-80 bg-primary text-white flex flex-col fixed inset-y-0 shadow-2xl z-[150] rounded-r-[3rem] overflow-hidden">
        <div className="p-10 pb-16">
          <Link to="/" className="flex items-center space-x-4 group">
            <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform">
              <span className="text-primary font-bold text-2xl uppercase">FI</span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl tracking-tight leading-none text-white italic">ADMIN PANEL</span>
              <span className="text-[10px] tracking-[0.3em] font-bold text-accent uppercase mt-1">Executive Portal</span>
            </div>
          </Link>
        </div>

        <nav className="flex-grow px-6 space-y-3">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-8 py-5 rounded-[2rem] transition-all duration-300 font-bold text-[11px] uppercase tracking-[0.2em] group ${
                location.pathname === item.path 
                  ? 'bg-accent text-primary shadow-2xl shadow-accent/40' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center space-x-4">
                <item.icon className={`w-5 h-5 flex-shrink-0 ${location.pathname === item.path ? 'text-primary' : 'text-white/20 group-hover:text-white'}`} />
                <span>{item.name}</span>
              </div>
              {location.pathname === item.path && <ChevronRight className="w-4 h-4" />}
            </Link>
          ))}
        </nav>

        <div className="p-10 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-4 px-8 py-5 w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all rounded-[2rem] font-bold text-[10px] uppercase tracking-[0.3em]"
          >
            <LogOut className="w-4 h-4" />
            <span>Terminate Session</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 ml-80 min-h-screen flex flex-col">
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-100 px-12 flex items-center justify-between sticky top-0 z-[140]">
           <div className="flex items-center gap-8 flex-1">
                <div className="relative max-w-md w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" placeholder="Search global datasets..." className="w-full pl-12 pr-6 py-3 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-accent text-xs font-medium" />
                </div>
           </div>

           <div className="flex items-center gap-8">
                <div className="relative">
                    <button onClick={() => setShowNotifications(!showNotifications)} className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-primary relative hover:bg-gray-100 transition-colors">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-accent border-2 border-white rounded-full" />
                    </button>
                    {showNotifications && (
                        <div className="absolute top-16 right-0 w-80 bg-white rounded-[2rem] shadow-3xl border border-gray-50 p-6 z-[160]">
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6 px-2">Notifications</h4>
                            <div className="space-y-4">
                                {notifications.map(n => (
                                    <div key={n.id} className="p-4 bg-gray-50 rounded-2xl hover:bg-accent/5 cursor-pointer group">
                                        <p className="text-xs font-bold text-primary mb-1">{n.text}</p>
                                        <p className="text-[10px] text-gray-400">{n.time}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-4 pl-8 border-l border-gray-100">
                    <div className="text-right">
                        <p className="text-xs font-bold text-primary uppercase tracking-widest leading-none mb-1">{user?.email.split('@')[0]}</p>
                        <p className="text-[9px] font-bold text-accent uppercase tracking-[0.2em]">{user?.role}</p>
                    </div>
                </div>
           </div>
        </header>
        <main className="p-12 animate-fade-in">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;
