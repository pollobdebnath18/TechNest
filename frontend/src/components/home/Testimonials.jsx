"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import TestimonialCard from "@/components/cards/TestimonialCard";
import { getTestimonials } from "@/lib/api";

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getTestimonials()
      .then(setTestimonials)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-20 bg-surface/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-3 h-8 w-64 animate-pulse rounded bg-surface-alt" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-white p-6">
                <div className="mb-3 h-4 w-24 rounded bg-surface-alt" />
                <div className="mb-4 h-16 rounded bg-surface-alt" />
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-surface-alt" />
                  <div>
                    <div className="mb-1 h-3 w-20 rounded bg-surface-alt" />
                    <div className="h-2 w-16 rounded bg-surface-alt" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
            What Our Customers Say
          </h2>
          <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
            Join thousands of happy customers who trust TechNest
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={testimonial._id || testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
