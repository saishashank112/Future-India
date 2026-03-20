import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { Home as HomeIcon, Package, User, Info } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import GlobalNetwork from './pages/GlobalNetwork';
import OurProcess from './pages/OurProcess';
import Login from './pages/Login';
import MyAccount from './pages/MyAccount';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import WhatsAppButton from './components/ui/WhatsAppButton.tsx';
import EnquiryModal from './components/ui/EnquiryModal.tsx';
import ProductDetailModal from './components/ui/ProductDetailModal.tsx';
import { ModalProvider } from './context/ModalProvider';
import { useModal } from './context/ModalContext';
import { LanguageProvider } from './context/LanguageProvider';
import { useAuth } from './context/AuthContext.tsx';
import { AuthProvider } from './context/AuthProvider';
import { CartProvider } from './context/CartProvider';
import { SettingsProvider } from './context/SettingsProvider';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout.tsx';
import AdminDashboard from './pages/admin/Dashboard.tsx';
import AdminOrders from './pages/admin/Orders.tsx';
import AdminDelivery from './pages/admin/Delivery.tsx';
import AdminProducts from './pages/admin/Products.tsx';
import AdminEnquiries from './pages/admin/Enquiries.tsx';
import AdminLogin from './pages/admin/Login.tsx';
import AdminSettings from './pages/admin/Settings.tsx';
import AdminReports from './pages/admin/Reports.tsx';
import AdminInvoice from './pages/admin/Invoice.tsx';
import AdminCustomers from './pages/admin/Customers.tsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Layout for Admin
const ProtectedAdmin = ({ children, noLayout = false }: { children: React.ReactNode, noLayout?: boolean }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (noLayout) {
    return <>{children}</>;
  }

  return (
    <AdminLayout>
      <ScrollToTop />
      {children}
    </AdminLayout>
  );
};

const ProtectedUser = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { isModalOpen, closeEnquiryModal, selectedProduct } = useModal();

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow pb-32 lg:pb-0">
        {children}
      </main>
      <Footer />
      
      {/* Dynamic Floating Mobile Navigation */}
      <div className={`lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[94%] max-w-[440px] z-[80] flex justify-between items-center shadow-2xl rounded-[2.5rem] px-5 py-3 transition-all duration-500 border
        ${useLocation().pathname === '/' 
          ? 'bg-primary/60 backdrop-blur-2xl border-white/10 text-white' 
          : 'bg-white/95 backdrop-blur-xl border-gray-100 text-primary shadow-xl shadow-black/5'}`}>
        
        <NavLink to="/" className={({isActive}) => `flex flex-col items-center justify-center flex-1 space-y-1.5 transition-all duration-300 ${isActive ? 'text-accent scale-110' : 'opacity-60 hover:opacity-100'}`}>
          <HomeIcon className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Home</span>
        </NavLink>
        
        <NavLink to="/products" className={({isActive}) => `flex flex-col items-center justify-center flex-1 space-y-1.5 transition-all duration-300 ${isActive ? 'text-accent scale-110' : 'opacity-60 hover:opacity-100'}`}>
          <Package className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase tracking-[0.15em]">Shop</span>
        </NavLink>
        
        <NavLink to="/about" className={({isActive}) => `flex flex-col items-center justify-center flex-1 space-y-1.5 transition-all duration-300 ${isActive ? 'text-accent scale-110' : 'opacity-60 hover:opacity-100'}`}>
          <Info className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase tracking-[0.15em]">About</span>
        </NavLink>

        <NavLink to="/my-account" className={({isActive}) => `flex flex-col items-center justify-center flex-1 space-y-1.5 transition-all duration-300 ${isActive ? 'text-accent scale-110' : 'opacity-60 hover:opacity-100'}`}>
          <User className="w-6 h-6" />
          <span className="text-[9px] font-bold uppercase tracking-[0.15em]">User</span>
        </NavLink>
      </div>

      <WhatsAppButton />
      <ProductDetailModal />
      <EnquiryModal 
        isOpen={isModalOpen} 
        onClose={closeEnquiryModal} 
        initialProduct={selectedProduct}
      />
    </div>
  );
};

function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <LanguageProvider>
          <CartProvider>
            <Router>
              <ModalProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                  <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
                  <Route path="/products/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
                  <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                  <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                  <Route path="/global-network" element={<PublicLayout><GlobalNetwork /></PublicLayout>} />
                  <Route path="/our-process" element={<PublicLayout><OurProcess /></PublicLayout>} />
                  
                  {/* Auth & Store Routes */}
                  <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
                  <Route path="/my-account" element={<PublicLayout><ProtectedUser><MyAccount /></ProtectedUser></PublicLayout>} />
                  <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
                  <Route path="/checkout" element={<PublicLayout><ProtectedUser><Checkout /></ProtectedUser></PublicLayout>} />
                  <Route path="/payment" element={<PublicLayout><ProtectedUser><Payment /></ProtectedUser></PublicLayout>} />

                  {/* Admin Auth */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  {/* Admin Protected Routes */}
                  <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
                  <Route path="/admin/orders" element={<ProtectedAdmin><AdminOrders /></ProtectedAdmin>} />
                  <Route path="/admin/delivery" element={<ProtectedAdmin><AdminDelivery /></ProtectedAdmin>} />
                  <Route path="/admin/products" element={<ProtectedAdmin><AdminProducts /></ProtectedAdmin>} />
                  <Route path="/admin/enquiries" element={<ProtectedAdmin><AdminEnquiries /></ProtectedAdmin>} />
                  <Route path="/admin/settings" element={<ProtectedAdmin><AdminSettings /></ProtectedAdmin>} />
                  <Route path="/admin/reports" element={<ProtectedAdmin><AdminReports /></ProtectedAdmin>} />
                  <Route path="/admin/customers" element={<ProtectedAdmin><AdminCustomers /></ProtectedAdmin>} />
                  <Route path="/admin/orders/:id" element={<ProtectedAdmin><AdminOrders /></ProtectedAdmin>} />
                  <Route path="/admin/invoice/:id" element={<ProtectedAdmin noLayout><AdminInvoice /></ProtectedAdmin>} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </ModalProvider>
            </Router>
          </CartProvider>
        </LanguageProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}

export default App;
