import { createContext, useContext } from 'react';

export interface Product {
  id: number;
  name: string;
  category: string;
  price?: number;
  priceRange: string;
  moq: string;
  image: string;
  grade?: string;
  origin?: string;
  certs?: string;
  description?: string;
}

export interface ModalContextType {
  openEnquiryModal: (productName?: string) => void;
  closeEnquiryModal: () => void;
  isModalOpen: boolean;
  selectedProduct: string;
  openDetailModal: (product: Product) => void;
  closeDetailModal: () => void;
  isDetailModalOpen: boolean;
  activeProduct: Product | null;
}

export const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
