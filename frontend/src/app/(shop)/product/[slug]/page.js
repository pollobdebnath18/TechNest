"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import Button from "@/components/ui/Button";
import { getProduct } from "@/lib/api";

export default function ProductPage() {
  const params = useParams();
  const { slug } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    getProduct(slug)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="animate-pulse rounded-2xl bg-surface aspect-square" />
          <div className="space-y-4">
            <div className="h-4 w-20 animate-pulse rounded bg-surface-alt" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-surface-alt" />
            <div className="h-6 w-1/3 animate-pulse rounded bg-surface-alt" />
            <div className="h-20 w-full animate-pulse rounded bg-surface-alt" />
          </div>
        </div>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-primary">Product not found</h1>
        <p className="mt-2 text-muted">The product you&apos;re looking for doesn&apos;t exist.</p>
        <Button href="/shop" className="mt-6">Back to Shop</Button>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <nav className="mb-6 text-sm text-muted">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span className="mx-2">/</span>
        <Link href="/shop" className="hover:text-primary">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-primary">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex aspect-square items-center justify-center rounded-2xl bg-surface p-12"
        >
          {imgError || !product.image ? (
            <svg className="h-40 w-40 text-muted/20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
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
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-sm font-medium text-accent">{product.brand}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-primary">{product.name}</h1>

          <div className="mt-3 flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} className={`h-5 w-5 ${i < Math.floor(product.rating) ? "text-highlight" : "text-gray-200"}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-sm text-muted">({product.reviews?.toLocaleString()} reviews)</span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-primary">${product.price.toLocaleString()}</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-muted line-through">${product.originalPrice.toLocaleString()}</span>
                <span className="rounded-md bg-red-500 px-2 py-0.5 text-sm font-semibold text-white">
                  Save {discount}%
                </span>
              </>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-muted">{product.description}</p>

          <div className="mt-8 flex gap-3">
            <Button size="lg" className="flex-1">Add to Cart</Button>
            <Button size="lg" variant="outline">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Button>
          </div>

          <div className="mt-8 space-y-3 border-t border-border pt-6">
            {[
              { icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4", text: "Free shipping on orders over $50" },
              { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "2-year warranty included" },
              { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", text: "30-day easy returns" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-muted">
                <svg className="h-4 w-4 flex-shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                </svg>
                {item.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
