import React, { useState } from 'react';
import { ModalContext } from './ModalContext';
import type { Product } from './ModalContext';

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  const openEnquiryModal = (productName: string = "") => {
    setSelectedProduct(productName);
    setIsModalOpen(true);
  };

  const closeEnquiryModal = () => {
    setIsModalOpen(false);
  };

  const openDetailModal = (product: Product) => {
    setActiveProduct(product);
    setIsDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setActiveProduct(null);
  };

  return (
    <ModalContext.Provider value={{ 
      openEnquiryModal, 
      closeEnquiryModal, 
      isModalOpen, 
      selectedProduct,
      openDetailModal,
      closeDetailModal,
      isDetailModalOpen,
      activeProduct
    }}>
      {children}
    </ModalContext.Provider>
  );
};
