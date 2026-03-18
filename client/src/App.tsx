import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import { Home as HomeIcon, Package, ShoppingCart, User } from 'lucide-react';
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
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { CartProvider } from './context/CartContext.tsx';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout.tsx';
import AdminDashboard from './pages/admin/Dashboard.tsx';
import AdminOrders from './pages/admin/Orders.tsx';
import AdminDelivery from './pages/admin/Delivery.tsx';
import AdminProducts from './pages/admin/Products.tsx';
import AdminEnquiries from './pages/admin/Enquiries.tsx';
import AdminLogin from './pages/admin/Login.tsx';
import AdminSettings from './pages/admin/Settings.tsx';
import AdminInvoice from './pages/admin/Invoice.tsx';

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
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-100 z-[80] flex justify-between items-center shadow-[0_-10px_30px_rgba(0,0,0,0.05)] pb-safe">
        <NavLink to="/" className={({isActive}) => `flex flex-col items-center justify-center flex-1 py-3 space-y-1 ${isActive ? 'text-accent' : 'text-gray-400'}`}>
          <HomeIcon className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
        </NavLink>
        <NavLink to="/products" className={({isActive}) => `flex flex-col items-center justify-center flex-1 py-3 space-y-1 ${isActive ? 'text-accent' : 'text-gray-400'}`}>
          <Package className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Products</span>
        </NavLink>
        <NavLink to="/cart" className={({isActive}) => `relative flex flex-col items-center justify-center flex-1 py-3 space-y-1 ${isActive ? 'text-accent' : 'text-gray-400'}`}>
          <ShoppingCart className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Cart</span>
        </NavLink>
        <NavLink to="/my-account" className={({isActive}) => `flex flex-col items-center justify-center flex-1 py-3 space-y-1 ${isActive ? 'text-accent' : 'text-gray-400'}`}>
          <User className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-widest">Account</span>
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
                <Route path="/admin/invoice/:id" element={<ProtectedAdmin noLayout><AdminInvoice /></ProtectedAdmin>} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </ModalProvider>
          </Router>
        </CartProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
