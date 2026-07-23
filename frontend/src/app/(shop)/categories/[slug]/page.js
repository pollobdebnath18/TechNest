"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/cards/ProductCard";
import { getCategory } from "@/lib/api";
import { useParams } from "next/navigation";

export default function CategorySlugPage() {
  const params = useParams();
  const { slug } = params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategory(slug)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8">
          <div className="h-8 w-48 animate-pulse rounded bg-surface-alt" />
          <div className="mt-2 h-4 w-32 animate-pulse rounded bg-surface-alt" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-white p-4">
              <div className="mb-4 h-48 rounded-lg bg-surface-alt" />
              <div className="h-4 w-3/4 rounded bg-surface-alt" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-primary">
          {data?.name || slug}
        </h1>
        <p className="mt-2 text-muted">
          {products.length} products in this category
        </p>
      </motion.div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
            <motion.div
              key={product._id || product.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.03 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className="text-lg text-muted">No products in this category yet.</p>
        </div>
      )}
    </div>
  );
}
