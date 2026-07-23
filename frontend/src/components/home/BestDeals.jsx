"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/cards/ProductCard";
import { getFlashDeals } from "@/lib/api";

export default function BestDeals() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFlashDeals()
      .then(setDeals)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-3 h-8 w-56 animate-pulse rounded bg-surface-alt" />
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
      </section>
    );
  }

  if (deals.length === 0) return null;

  return (
    <section className="py-16 sm:py-20 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Best Deals — Flash Sale
          </h2>
          <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
            Limited time offers on top products. Don&apos;t miss out!
          </p>
        </motion.div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {deals.map((product, i) => (
            <motion.div
              key={product._id || product.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
