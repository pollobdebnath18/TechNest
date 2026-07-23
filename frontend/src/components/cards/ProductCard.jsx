"use client";

import Link from "next/link";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [added, setAdded] = useState(null);
  const [imgError, setImgError] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const exists = cart.find((item) => item._id === product._id);
      if (exists) {
        exists.quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      setAdded("cart");
      setTimeout(() => setAdded(null), 1500);
    } catch {}
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
      const exists = wishlist.find((item) => item._id === product._id);
      if (!exists) {
        wishlist.push(product);
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
      }
      setAdded("wishlist");
      setTimeout(() => setAdded(null), 1500);
    } catch {}
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block rounded-xl border border-border bg-white p-3 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1"
    >
      <div className="relative mb-3 overflow-hidden rounded-lg bg-surface">
        <div className="flex aspect-square items-center justify-center p-6">
          {imgError || !product.image ? (
            <svg className="h-20 w-20 text-muted/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              onError={() => setImgError(true)}
              className="h-full w-full object-contain"
            />
          )}
        </div>

        <div className="absolute left-2 top-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToWishlist}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-muted hover:text-red-500 transition-colors cursor-pointer"
            aria-label="Add to wishlist"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
          <button
            onClick={handleAddToCart}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md text-muted hover:text-accent transition-colors cursor-pointer"
            aria-label="Add to cart"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
          </button>
        </div>

        {added && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg">
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary shadow-lg">
              {added === "cart" ? "Added to Cart!" : "Added to Wishlist!"}
            </span>
          </div>
        )}

        {product.badge && (
          <span
            className={`absolute right-2 top-2 rounded-md px-2 py-1 text-xs font-semibold ${
              product.badge === "Sale"
                ? "bg-red-500 text-white"
                : product.badge === "New"
                  ? "bg-accent text-white"
                  : "bg-highlight/90 text-primary"
            }`}
          >
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute bottom-2 right-2 rounded-md bg-red-500 px-2 py-1 text-xs font-semibold text-white">
            -{discount}%
          </span>
        )}
      </div>

      <div className="px-1">
        <p className="text-xs font-medium text-accent">{product.brand}</p>
        <h3 className="mt-1 text-sm font-semibold text-primary line-clamp-2 group-hover:text-accent transition-colors">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-center gap-1">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`h-3.5 w-3.5 ${i < Math.floor(product.rating) ? "text-highlight" : "text-gray-200"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-xs text-muted">({product.reviews.toLocaleString()})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-primary">${product.price.toLocaleString()}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted line-through">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
