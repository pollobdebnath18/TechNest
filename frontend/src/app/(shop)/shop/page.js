"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ProductCard from "@/components/cards/ProductCard";
import { getProducts, getCategories } from "@/lib/api";

const sortOptions = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
];

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");
  const [loading, setLoading] = useState(true);
  const initialLoad = useRef(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()])
      .then(([p, c]) => {
        setProducts(p);
        setCategories(c);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    setLoading(true);
    const params = {};
    if (selectedCategory !== "all") params.category = selectedCategory;
    if (sortBy) params.sort = sortBy;
    getProducts(params)
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory, sortBy]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-primary">Shop</h1>
        <p className="mt-2 text-muted">Browse our complete collection of premium tech products.</p>
      </motion.div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <button
          onClick={() => setSelectedCategory("all")}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
            selectedCategory === "all"
              ? "bg-accent text-white"
              : "bg-surface text-muted hover:bg-surface-alt"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer ${
              selectedCategory === cat.slug
                ? "bg-accent text-white"
                : "bg-surface text-muted hover:bg-surface-alt"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-muted">{products.length} products</p>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm text-primary outline-none focus:border-accent"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-white p-4">
              <div className="mb-4 h-48 rounded-lg bg-surface-alt" />
              <div className="mb-2 h-4 w-3/4 rounded bg-surface-alt" />
              <div className="h-4 w-1/2 rounded bg-surface-alt" />
            </div>
          ))}
        </div>
      ) : (
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
      )}

      {!loading && products.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-lg text-muted">No products found in this category.</p>
        </div>
      )}
    </div>
  );
}
