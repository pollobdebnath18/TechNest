"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { getCart, updateCart } from "@/lib/api";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const loadedRef = useRef(null);

  useEffect(() => {
    if (!userId) {
      if (loadedRef.current !== "none") {
        setItems([]);
        loadedRef.current = "none";
      }
      return;
    }
    if (loadedRef.current === userId) return;
    loadedRef.current = userId;
    setLoading(true);
    getCart(userId)
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      const exists = prev.find((i) => i._id === product._id);
      const next = exists
        ? prev.map((i) => i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { _id: product._id, name: product.name, slug: product.slug, price: product.price, brand: product.brand, image: product.image, quantity: 1 }];
      if (userId) updateCart(userId, next).catch(() => {});
      return next;
    });
  }, [userId]);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const next = prev.filter((i) => i._id !== id);
      if (userId) updateCart(userId, next).catch(() => {});
      return next;
    });
  }, [userId]);

  const updateQuantity = useCallback((id, delta) => {
    setItems((prev) => {
      const next = prev.map((i) => i._id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i);
      if (userId) updateCart(userId, next).catch(() => {});
      return next;
    });
  }, [userId]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (userId) updateCart(userId, []).catch(() => {});
  }, [userId]);

  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, loading, addItem, removeItem, updateQuantity, clearCart, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
