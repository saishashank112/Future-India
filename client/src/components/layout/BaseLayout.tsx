import { useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from '../ui/WhatsAppButton';
import EnquiryModal from '../ui/EnquiryModal';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout = ({ children }: BaseLayoutProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");

  const openModal = (productName: string = "") => {
    setSelectedProduct(productName);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar onEnquiryClick={() => openModal()} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer onEnquiryClick={() => openModal()} />
      <WhatsAppButton />
      <EnquiryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        initialProduct={selectedProduct}
      />
    </div>
  );
};

export default BaseLayout;
