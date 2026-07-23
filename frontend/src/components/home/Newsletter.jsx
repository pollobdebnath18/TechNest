"use client";

import { useState } from "react";
import SectionTitle from "@/components/ui/SectionTitle";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-2xl bg-primary px-6 py-12 sm:px-12 sm:py-16">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Stay in the Loop
            </h2>
            <p className="mt-3 text-gray-400">
              Subscribe to our newsletter for exclusive deals, new arrivals, and tech insights.
            </p>

            {subscribed ? (
              <div className="mt-8 rounded-xl bg-white/10 px-6 py-4">
                <p className="text-lg font-medium text-white">
                  You&apos;re subscribed! Check your inbox for a welcome email.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 rounded-xl bg-white/10 px-5 py-3 text-white placeholder-gray-500 outline-none border border-white/10 focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-accent px-8 py-3 font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}

            <p className="mt-4 text-xs text-gray-500">
              No spam, ever. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
