import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const Cart = createContext();
export const useCart = () => useContext(Cart);

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) fetchCart();
    else setCart([]);
  }, [user]);

  const fetchCart = async () => {
    try {
      const r = await axios.get('http://localhost:5002/api/auth/cart');
      setCart(r.data);
    } catch {}
  };

  const addToCart = async (productId) => {
    if (!user) return false;
    try {
      const r = await axios.post('http://localhost:5002/api/auth/cart/add', { productId });
      setCart(r.data);
      return true;
    } catch { return false; }
  };

  const updateQty = async (productId, quantity) => {
    try {
      const r = await axios.put('http://localhost:5002/api/auth/cart/update', { productId, quantity });
      setCart(r.data);
    } catch {}
  };

  const clearCart = async () => {
    try {
      await axios.delete('http://localhost:5002/api/auth/cart/clear');
      setCart([]);
    } catch {}
  };

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);

  return (
    <Cart.Provider value={{ cart, addToCart, updateQty, clearCart, cartCount, cartTotal, fetchCart }}>
      {children}
    </Cart.Provider>
  );
}