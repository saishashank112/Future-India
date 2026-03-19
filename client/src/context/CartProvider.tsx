import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { CartContext } from './CartContext';
import type { CartItem, ProductInput } from '../types/cart';
import { getApiUrl } from '../config/api';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!user || user.role !== 'user') return;
    try {
      const res = await fetch(getApiUrl(`/cart/${user.id}`));
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
    let isMounted = true;
    const loadCart = async () => {
      if (user?.role === 'user') {
        await fetchCart();
      } else {
        const saved = localStorage.getItem('exim_cart');
        if (saved && isMounted) {
          try {
            setItems(JSON.parse(saved));
          } catch (e) {
            console.error("Failed to parse cart", e);
            setItems([]);
          }
        } else if (isMounted) {
          setItems([]);
        }
      }
    };
    
    loadCart();
    return () => { isMounted = false; };
  }, [user, fetchCart]);

  // Persist guest cart
  useEffect(() => {
    if (!user) {
      localStorage.setItem('exim_cart', JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = useCallback(async (product: ProductInput, quantity: number = 1) => {
    const priceVal = product.price || (product.priceRange ? parseInt(String(product.priceRange).match(/\d+/)?.[0] || '0') : 0);
    
    const newItem: CartItem = {
      id: Date.now(), 
      product_id: product.id,
      name: product.name,
      price: priceVal,
      quantity,
      image: product.image,
      category: product.category
    };

    const updateLocally = (prev: CartItem[]) => {
      const existing = prev.find(item => item.product_id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product_id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, newItem];
    };

    if (user?.role === 'user') {
      setItems(updateLocally);
      try {
        const res = await fetch(getApiUrl('/cart/add'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, productId: product.id, quantity }),
        });
        if (res.ok) {
          const resJSON = await res.json();
          if (resJSON.data) setItems(resJSON.data);
        }
      } catch (error) {
        console.error('Add to Cart Error:', error);
      }
    } else {
      setItems(updateLocally);
    }
  }, [user]);

  const removeFromCart = useCallback(async (itemId: number) => {
    setItems(prev => prev.filter(item => item.id !== itemId));

    if (user?.role === 'user') {
      try {
        const res = await fetch(getApiUrl(`/cart/${itemId}`), { method: 'DELETE' });
        if (!res.ok) await fetchCart();
      } catch (error) {
        console.error('Remove from Cart Error:', error);
        await fetchCart();
      }
    }
  }, [user, fetchCart]);

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity } : item));

    if (user?.role === 'user') {
      try {
        const res = await fetch(getApiUrl(`/cart/update/${itemId}`), {
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
  }, [user, fetchCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (!user) localStorage.removeItem('exim_cart');
  }, [user]);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const subtotal = useMemo(() => items.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0), [items]);

  const value = useMemo(() => ({ 
    items, 
    itemCount, 
    subtotal, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    refreshCart: fetchCart 
  }), [items, itemCount, subtotal, addToCart, removeFromCart, updateQuantity, clearCart, fetchCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
