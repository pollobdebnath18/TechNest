"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CategoryCard from "@/components/cards/CategoryCard";
import { getCategories } from "@/lib/api";

export default function FeaturedCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-3 h-8 w-48 animate-pulse rounded bg-surface-alt" />
            <div className="mx-auto h-5 w-72 animate-pulse rounded bg-surface-alt" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-white p-3">
                <div className="mb-3 h-36 rounded-lg bg-surface-alt" />
                <div className="h-4 w-24 mx-auto rounded bg-surface-alt" />
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
            Shop by Category
          </h2>
          <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
            Browse our curated collection of premium tech categories
          </p>
        </motion.div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, i) => (
            <motion.div
              key={category._id || category.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
