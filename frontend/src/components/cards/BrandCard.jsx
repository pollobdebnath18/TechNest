"use client";

import { useState } from "react";

export default function BrandCard({ brand }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex flex-col items-center justify-center rounded-2xl border border-border/60 bg-white p-6 transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1.5 hover:border-accent/20">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-surface to-surface-alt text-2xl font-bold text-muted/30 group-hover:text-accent group-hover:from-accent/5 group-hover:to-accent/10 transition-all duration-300 overflow-hidden">
        {imgError || !brand.logo ? (
          brand.name.charAt(0)
        ) : (
          <img
            src={brand.logo}
            alt={brand.name}
            onError={() => setImgError(true)}
            className="h-full w-full object-contain p-2"
          />
        )}
      </div>
      <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors duration-300">
        {brand.name}
      </span>
    </div>
  );
}
