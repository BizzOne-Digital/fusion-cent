import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const sanitize = (items) => (Array.isArray(items) ? items : [])
    .filter(i => i && i._id && i.name)
    .map(i => ({ ...i, price: Number(i.price) || 0, qty: Math.max(1, Number(i.qty) || 1) }));

  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('fsCart');
      return sanitize(saved ? JSON.parse(saved) : []);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('fsCart', JSON.stringify(cartItems));
    } catch {
      // ignore quota/serialization errors — cart just won't persist this change
    }
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems(prev => {
      const existing = prev.find(i => i._id === product._id);
      if (existing) {
        toast.success('Cart updated');
        return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + qty } : i);
      }
      toast.success(`${product.name} added to cart`);
      return [...prev, { ...product, price: Number(product.price) || 0, qty: Math.max(1, Number(qty) || 1) }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i._id !== id));
    toast.success('Item removed');
  };

  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setCartItems([]);

  const itemsPrice = cartItems.reduce((a, i) => a + i.price * i.qty, 0);
  const shippingPrice = itemsPrice >= 150 ? 0 : 9.99;
  const totalPrice = itemsPrice + shippingPrice;
  const cartCount = cartItems.reduce((a, i) => a + i.qty, 0);

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, updateQty, clearCart,
      itemsPrice, shippingPrice, totalPrice, cartCount,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
