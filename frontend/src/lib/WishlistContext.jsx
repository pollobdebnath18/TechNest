"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { getWishlist, updateWishlist } from "@/lib/api";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
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
    getWishlist(userId)
      .then(setItems)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const addItem = useCallback((product) => {
    setItems((prev) => {
      if (prev.find((i) => i._id === product._id)) return prev;
      const next = [...prev, { _id: product._id, name: product.name, slug: product.slug, price: product.price, brand: product.brand, image: product.image, rating: product.rating, reviews: product.reviews, originalPrice: product.originalPrice, badge: product.badge }];
      if (userId) updateWishlist(userId, next).catch(() => {});
      return next;
    });
  }, [userId]);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const next = prev.filter((i) => i._id !== id);
      if (userId) updateWishlist(userId, next).catch(() => {});
      return next;
    });
  }, [userId]);

  return (
    <WishlistContext.Provider value={{ items, loading, addItem, removeItem }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}
