"use client";

import { useState, useRef, useEffect } from "react";

export default function SearchBar({ className = "" }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "/" && !isFocused) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isFocused]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.location.href = `/shop?q=${encodeURIComponent(query.trim())}`;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative ${className}`}>
      <div
        className={`flex items-center rounded-xl border-2 bg-surface transition-all duration-200 ${
          isFocused
            ? "border-accent shadow-sm ring-2 ring-accent/20"
            : "border-transparent"
        }`}
      >
        <svg
          className="ml-3 h-5 w-5 flex-shrink-0 text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products..."
          className="w-full bg-transparent px-3 py-2.5 text-sm text-primary placeholder-muted outline-none"
        />
        {!isFocused && !query && (
          <kbd className="mr-3 hidden rounded border border-border bg-white px-1.5 py-0.5 text-xs text-muted sm:inline-block">
            /
          </kbd>
        )}
      </div>
    </form>
  );
}
