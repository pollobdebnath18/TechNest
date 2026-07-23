"use client";

import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Browse & Compare",
    description: "Explore thousands of tech products with detailed specs, reviews, and price comparisons.",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  {
    number: "02",
    title: "Add to Cart",
    description: "Select your favorites and build your order with real-time stock updates and price tracking.",
    icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z",
  },
  {
    number: "03",
    title: "Secure Checkout",
    description: "Pay securely with multiple payment options. Your data is encrypted and protected.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    number: "04",
    title: "Fast Delivery",
    description: "Get your order delivered to your doorstep with real-time tracking and free shipping on orders over $50.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 bg-surface/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
            Get the latest tech delivered to your door in four simple steps
          </p>
        </motion.div>

        <div className="relative grid grid-cols-1 gap-8 md:grid-cols-4">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10">
                <svg className="h-7 w-7 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={step.icon} />
                </svg>
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="mb-2 text-lg font-semibold text-primary">{step.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
