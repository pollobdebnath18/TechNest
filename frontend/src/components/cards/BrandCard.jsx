"use client";

import { useState } from "react";

export default function BrandCard({ brand }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group flex flex-col items-center justify-center rounded-xl border border-border bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-1 hover:border-accent/30">
      <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-surface text-2xl font-bold text-muted/40 group-hover:text-accent transition-colors overflow-hidden">
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
      <span className="text-sm font-semibold text-primary group-hover:text-accent transition-colors">
        {brand.name}
      </span>
    </div>
  );
}
