import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import Navbar from './components/layout/Navbar.tsx';
import Footer from './components/layout/Footer.tsx';
import Home from './pages/Home.tsx';
import Products from './pages/Products.tsx';
import ProductDetail from './pages/ProductDetail.tsx';
import About from './pages/About.tsx';
import Contact from './pages/Contact.tsx';
import GlobalNetwork from './pages/GlobalNetwork.tsx';
import OurProcess from './pages/OurProcess.tsx';
import WhatsAppButton from './components/ui/WhatsAppButton.tsx';
import EnquiryModal from './components/ui/EnquiryModal.tsx';
import ProductDetailModal from './components/ui/ProductDetailModal.tsx';
import { ModalProvider } from './context/ModalProvider';
import { useModal } from './context/ModalContext';
import { LanguageProvider } from './context/LanguageProvider';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';

// Admin Imports
import AdminLayout from './pages/admin/AdminLayout.tsx';
import AdminDashboard from './pages/admin/Dashboard.tsx';
import AdminProducts from './pages/admin/Products.tsx';
import AdminEnquiries from './pages/admin/Enquiries.tsx';
import AdminLogin from './pages/admin/Login.tsx';
import AdminProgress from './pages/admin/Progress.tsx';
import AdminSettings from './pages/admin/Settings.tsx';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Layout for Admin
const ProtectedAdmin = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return (
    <AdminLayout>
      <ScrollToTop />
      {children}
    </AdminLayout>
  );
};

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const { isModalOpen, closeEnquiryModal, openEnquiryModal, selectedProduct } = useModal();

  return (
    <div className="flex flex-col min-h-screen">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
      
      {/* Mobile Sticky CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-lg border-t border-gray-100 z-[80] flex gap-3">
        <button 
          onClick={() => openEnquiryModal()}
          className="flex-1 btn-primary py-4 text-sm font-bold shadow-xl flex items-center justify-center space-x-2"
        >
          <MessageSquare className="w-5 h-5" />
          <span>Get Enquiry</span>
        </button>
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

              {/* Admin Auth */}
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin Protected Routes */}
              <Route path="/admin" element={<ProtectedAdmin><AdminDashboard /></ProtectedAdmin>} />
              <Route path="/admin/products" element={<ProtectedAdmin><AdminProducts /></ProtectedAdmin>} />
              <Route path="/admin/enquiries" element={<ProtectedAdmin><AdminEnquiries /></ProtectedAdmin>} />
              <Route path="/admin/progress" element={<ProtectedAdmin><AdminProgress /></ProtectedAdmin>} />
              <Route path="/admin/settings" element={<ProtectedAdmin><AdminSettings /></ProtectedAdmin>} />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </ModalProvider>
        </Router>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
