"use client";

import Link from "next/link";
import { useState } from "react";

export default function CategoryCard({ category }) {
  const [imgError, setImgError] = useState(false);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group relative block overflow-hidden rounded-2xl border border-border/60 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1.5 hover:border-accent/20"
    >
      <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-surface to-surface-alt p-6 overflow-hidden">
        {imgError || !category.image ? (
          <svg className="h-16 w-16 text-muted/20 group-hover:scale-110 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        ) : (
          <img
            src={category.image}
            alt={category.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
          />
        )}
      </div>
      <div className="p-4 text-center">
        <h3 className="font-semibold text-primary group-hover:text-accent transition-colors duration-300">
          {category.name}
        </h3>
        <p className="mt-1 text-sm text-muted">
          {category.productCount} products
        </p>
      </div>
    </Link>
  );
}
