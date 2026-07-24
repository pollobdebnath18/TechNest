"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useWishlist } from "@/lib/WishlistContext";

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(null);
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();
  const { addItem: addToWishlist } = useWishlist();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
    setAdded("cart");
    setTimeout(() => setAdded(null), 1500);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product);
    setAdded("wishlist");
    setTimeout(() => setAdded(null), 1500);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-2xl border border-border/60 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1.5 hover:border-accent/20"
    >
      <div className="relative mb-3 overflow-hidden rounded-t-2xl bg-gradient-to-br from-surface to-surface-alt">
        <div className="flex aspect-square items-center justify-center p-6 transition-transform duration-500 group-hover:scale-105">
          {imgError || !product.image ? (
            <svg className="h-20 w-20 text-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          )}
        </div>

        <div className="absolute left-3 top-3 flex flex-col gap-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
          <button
            onClick={handleAddToWishlist}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-muted hover:text-red-500 hover:bg-white transition-all cursor-pointer"
            aria-label="Add to wishlist"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handleAddToCart}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-lg text-muted hover:text-accent hover:bg-white transition-all cursor-pointer"
            aria-label="Add to cart"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </button>
        </div>

        {added && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-t-2xl animate-fade-in">
            <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary shadow-xl">
              <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {added === "cart" ? "Added to Cart!" : "Added to Wishlist!"}
            </div>
          </div>
        )}

        {product.badge && (
          <span
            className={`absolute right-3 top-3 rounded-lg px-2.5 py-1 text-[11px] font-semibold tracking-wide z-10 ${
              product.badge === "Sale" ? "bg-red-500 text-white shadow-red-500/25 shadow-md"
                : product.badge === "New" ? "bg-accent text-white shadow-accent/25 shadow-md"
                  : "bg-highlight/90 text-primary shadow-highlight/25 shadow-md"
            }`}
          >
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute bottom-3 right-3 rounded-lg bg-red-500 px-2.5 py-1 text-[11px] font-semibold text-white shadow-lg shadow-red-500/25">
            -{discount}%
          </span>
        )}
      </div>

      <div className="px-4 pb-4 pt-1">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">{product.brand}</p>
        <h3 className="mt-1 text-sm font-semibold text-primary line-clamp-2 group-hover:text-accent transition-colors duration-300 leading-snug">
          {product.name}
        </h3>
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? "text-highlight" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted">({product.reviews?.toLocaleString() || 0})</span>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">${product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted/60 line-through">${product.originalPrice.toLocaleString()}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
