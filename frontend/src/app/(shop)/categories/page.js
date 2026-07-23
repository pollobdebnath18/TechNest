"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CategoryCard from "@/components/cards/CategoryCard";
import { getCategories } from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <h1 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
          All Categories
        </h1>
        <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
          Find exactly what you&apos;re looking for
        </p>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-white p-3">
              <div className="mb-3 h-36 rounded-lg bg-surface-alt" />
              <div className="mx-auto h-4 w-24 rounded bg-surface-alt" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((category, i) => (
            <motion.div
              key={category._id || category.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <CategoryCard category={category} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
