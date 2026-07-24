"use client";

import { CartProvider } from "@/lib/CartContext";
import { WishlistProvider } from "@/lib/WishlistContext";

export default function Providers({ children }) {
  return (
    <CartProvider>
      <WishlistProvider>
        {children}
      </WishlistProvider>
    </CartProvider>
  );
}
