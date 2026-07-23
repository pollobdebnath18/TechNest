"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import FeatureCard from "@/components/cards/FeatureCard";
import { getFeatures } from "@/lib/api";

export default function WhyChooseUs() {
  const [features, setFeatures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFeatures()
      .then(setFeatures)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-3 h-8 w-64 animate-pulse rounded bg-surface-alt" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-xl border border-border bg-white p-6">
                <div className="mx-auto mb-4 h-14 w-14 rounded-xl bg-surface-alt" />
                <div className="mx-auto h-4 w-24 rounded bg-surface-alt" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            Why Choose TechNest
          </h2>
          <p className="mt-3 text-lg text-muted max-w-2xl mx-auto">
            We go above and beyond to deliver the best shopping experience
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature._id || feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <FeatureCard feature={feature} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
