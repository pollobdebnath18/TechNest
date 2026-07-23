"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Button from "@/components/ui/Button";

function getInitialCart() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState(getInitialCart);

  const updateQuantity = (id, delta) => {
    setCartItems((prev) => {
      const updated = prev.map((item) =>
        item._id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeItem = (id) => {
    setCartItems((prev) => {
      const updated = prev.filter((item) => item._id !== id);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-primary">Shopping Cart</h1>
        <p className="mt-2 text-muted">{cartItems.length} items in your cart</p>
      </motion.div>

      {cartItems.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, i) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex gap-4 rounded-xl border border-border bg-white p-4"
              >
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-lg bg-surface">
                  <svg className="h-12 w-12 text-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-xs font-medium text-accent">{item.brand}</p>
                      <Link href={`/product/${item.slug}`} className="font-semibold text-primary hover:text-accent transition-colors">
                        {item.name}
                      </Link>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="text-muted hover:text-red-500 transition-colors cursor-pointer" aria-label="Remove item">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-border">
                      <button onClick={() => updateQuantity(item._id, -1)} className="px-3 py-1.5 text-muted hover:text-primary cursor-pointer">-</button>
                      <span className="px-3 py-1.5 text-sm font-medium text-primary">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)} className="px-3 py-1.5 text-muted hover:text-primary cursor-pointer">+</button>
                    </div>
                    <span className="font-bold text-primary">${(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 rounded-2xl border border-border bg-white p-6">
              <h3 className="text-lg font-semibold text-primary">Order Summary</h3>
              <div className="mt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Subtotal</span>
                  <span className="font-medium text-primary">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Shipping</span>
                  <span className="font-medium text-primary">{shipping === 0 ? "Free" : `$${shipping}`}</span>
                </div>
                <div className="border-t border-border pt-3">
                  <div className="flex justify-between">
                    <span className="font-semibold text-primary">Total</span>
                    <span className="text-xl font-bold text-primary">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <Button href="/checkout" className="mt-6 w-full" size="lg">
                Proceed to Checkout
              </Button>
              <Link href="/shop" className="mt-3 block text-center text-sm font-medium text-accent hover:text-accent-hover">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-20 text-center">
          <svg className="mx-auto h-16 w-16 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-primary">Your cart is empty</h3>
          <p className="mt-2 text-muted">Add some products to get started</p>
          <Button href="/shop" className="mt-6">
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
}
