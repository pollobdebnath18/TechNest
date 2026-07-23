"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import BrandCard from "@/components/cards/BrandCard";
import { getBrands } from "@/lib/api";

export default function PopularBrands() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBrands()
      .then(setBrands)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-3 h-8 w-48 animate-pulse rounded bg-surface-alt" />
          </div>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-white p-6">
                <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-surface-alt" />
                <div className="mx-auto h-3 w-16 rounded bg-surface-alt" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Popular Brands
          </h2>
          <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
            Shop from the world&apos;s most trusted tech brands
          </p>
        </motion.div>
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {brands.map((brand, i) => (
            <motion.div
              key={brand._id || brand.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <BrandCard brand={brand} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
