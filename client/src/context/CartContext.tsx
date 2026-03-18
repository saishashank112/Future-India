import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: any, quantity?: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => void;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user || user.role !== 'user') return;
    try {
      const res = await fetch(`http://localhost:5001/api/cart/${user.id}`);
      const data = await res.json();
      if (res.ok) {
        setItems(data.data || []);
      }
    } catch (error) {
      console.error('Fetch Cart Error:', error);
    }
  }, [user]);

  // Initial load
  useEffect(() => {
    if (user?.role === 'user') {
      fetchCart();
    } else {
      const saved = localStorage.getItem('exim_cart');
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse cart", e);
          setItems([]);
        }
      } else {
        setItems([]);
      }
    }
  }, [user, fetchCart]);

  // Persist guest cart
  useEffect(() => {
    if (!user) {
      localStorage.setItem('exim_cart', JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = async (product: any, quantity: number = 1) => {
    // Immediate Local State Update for WOW factor
    const newItem: CartItem = {
      id: Date.now(), // Temp ID for guest/immediate UI
      product_id: product.id,
      name: product.name,
      price: product.price || (product.priceRange ? parseInt(String(product.priceRange).match(/\d+/)?.[0] || '0') : 0),
      quantity,
      image: product.image,
      category: product.category
    };

    if (user?.role === 'user') {
      // Optimistic update
      setItems(prev => {
        const existing = prev.find(item => item.product_id === product.id);
        if (existing) {
          return prev.map(item => 
            item.product_id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, newItem];
      });

      try {
        const res = await fetch('http://localhost:5001/api/cart/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, productId: product.id, quantity }),
        });
        if (res.ok) {
          await fetchCart(); // Sync with actual DB IDs
        }
      } catch (error) {
        console.error('Add to Cart Error:', error);
      }
    } else {
      setItems(prev => {
        const existing = prev.find(item => item.product_id === product.id);
        if (existing) {
          return prev.map(item => 
            item.product_id === product.id ? { ...item, quantity: item.quantity + quantity } : item
          );
        }
        return [...prev, newItem];
      });
    }
  };

  const removeFromCart = async (itemId: number) => {
    // Optimistic delete
    setItems(prev => prev.filter(item => item.id !== itemId));

    if (user?.role === 'user') {
      try {
        const res = await fetch(`http://localhost:5001/api/cart/${itemId}`, { method: 'DELETE' });
        if (!res.ok) await fetchCart(); // Rollback if failed
      } catch (error) {
        console.error('Remove from Cart Error:', error);
        await fetchCart();
      }
    }
  };

  const updateQuantity = async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    
    // Optimistic update
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));

    if (user?.role === 'user') {
      try {
        const res = await fetch(`http://localhost:5001/api/cart/update/${itemId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ quantity }),
        });
        if (!res.ok) await fetchCart();
      } catch (error) {
        console.error('Update Cart Error:', error);
        await fetchCart();
      }
    }
  };

  const clearCart = () => {
    setItems([]);
    if (!user) localStorage.removeItem('exim_cart');
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, itemCount, subtotal, addToCart, removeFromCart, updateQuantity, clearCart, refreshCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
