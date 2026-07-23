"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/ui/Button";

const slides = [
  {
    title: "The Future of Tech",
    subtitle: "Discover cutting-edge gadgets at unbeatable prices",
    cta: "Shop Now",
    ctaLink: "/shop",
    secondaryCta: "Browse Categories",
    secondaryLink: "/categories",
    image: "/banner1.svg",
  },
  {
    title: "Summer Tech Sale",
    subtitle: "Up to 40% off on premium smartphones, laptops & more",
    cta: "View Deals",
    ctaLink: "/shop?deals=true",
    secondaryCta: "Best Sellers",
    secondaryLink: "/shop?sort=popular",
    image: "/banner2.svg",
  },
  {
    title: "Upgrade Your Setup",
    subtitle: "Professional gear for creators, gamers & professionals",
    cta: "Explore",
    ctaLink: "/categories",
    secondaryCta: "New Arrivals",
    secondaryLink: "/shop?sort=newest",
    image: "/banner3.svg",
  },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden">
      <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-highlight/5 blur-3xl" />

      <div className="relative mx-auto flex min-h-[65vh] max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="w-full py-16 sm:py-20 lg:py-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-muted sm:text-xl">
                {slide.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button href={slide.ctaLink} size="lg">
                  {slide.cta}
                </Button>
                <Button href={slide.secondaryLink} variant="outline" size="lg">
                  {slide.secondaryCta}
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === current
                    ? "w-8 bg-accent"
                    : "w-3 bg-border hover:bg-muted"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="hidden flex-1 items-center justify-center lg:flex">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5 }}
              className="relative h-80 w-80"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/20 to-accent/5" />
              <div className="absolute inset-4 flex items-center justify-center rounded-2xl bg-white shadow-xl overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-border bg-surface/50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:px-6 sm:grid-cols-4 lg:px-8">
          {[
            { icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4", label: "Free Shipping on $50+" },
            { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", label: "2-Year Warranty" },
            { icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15", label: "30-Day Returns" },
            { icon: "M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z", label: "24/7 Support" },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <svg className="h-5 w-5 flex-shrink-0 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              <span className="text-xs font-medium text-muted sm:text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
