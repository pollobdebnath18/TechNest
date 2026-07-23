"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/cards/ProductCard";
import Button from "@/components/ui/Button";

function getInitialWishlist() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch {
    return [];
  }
}

export default function WishlistPage() {
  const [items, setItems] = useState(getInitialWishlist);

  const removeItem = (id) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item._id !== id);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-primary">My Wishlist</h1>
        <p className="mt-2 text-muted">Items you&apos;ve saved for later</p>
      </motion.div>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {items.map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="relative"
            >
              <ProductCard product={product} />
              <button
                onClick={() => removeItem(product._id)}
                className="absolute right-2 top-2 z-10 rounded-full bg-white p-1.5 shadow-md text-muted hover:text-red-500 transition-colors cursor-pointer"
                aria-label="Remove from wishlist"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <svg className="mx-auto h-16 w-16 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-primary">Your wishlist is empty</h3>
          <p className="mt-2 text-muted">Browse products and save your favorites</p>
          <Button href="/shop" className="mt-6">
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
}
