"use client";

import { useEffect, useCallback } from "react";

export default function Drawer({ isOpen, onClose, children, title, side = "right" }) {
  const position = side === "right" ? "right-0" : "left-0";
  const animation = side === "right" ? "animate-slide-right" : "animate-slide-left";

  const handleEscape = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleEscape]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={`absolute ${position} top-0 h-full w-full max-w-md ${animation} bg-white shadow-2xl`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h3 className="text-lg font-semibold text-primary">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface-alt hover:text-primary transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto p-6" style={{ height: "calc(100% - 65px)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
