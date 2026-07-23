"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/cards/ProductCard";
import Button from "@/components/ui/Button";
import { getProducts } from "@/lib/api";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts({ limit: "8" })
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-3 h-8 w-48 animate-pulse rounded bg-surface-alt" />
            <div className="mx-auto h-5 w-64 animate-pulse rounded bg-surface-alt" />
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-white p-4">
                <div className="mb-4 h-48 rounded-lg bg-surface-alt" />
                <div className="mb-2 h-4 w-3/4 rounded bg-surface-alt" />
                <div className="h-4 w-1/2 rounded bg-surface-alt" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  console.log(products , "from featured products");

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
            Featured Products
          </h2>
          <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
            Hand-picked products our customers love
          </p>
        </motion.div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {products.map((product, i) => (
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
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Button href="/shop" variant="outline" size="lg">
            View All Products
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
