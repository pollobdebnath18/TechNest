"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl">
          Get in Touch
        </h1>
        <p className="mt-4 text-lg text-muted">
          Have a question or need help? We&apos;re here for you.
        </p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {[
          { icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z", title: "Email", value: "support@technest.com" },
          { icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z", title: "Phone", value: "+1 (555) 123-4567" },
          { icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z", title: "Address", value: "123 Tech Street, Silicon Valley, CA 94025" },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-border bg-white p-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
            </div>
            <h3 className="mt-4 font-semibold text-primary">{item.title}</h3>
            <p className="mt-1 text-sm text-muted">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-12 max-w-2xl">
        {submitted ? (
          <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
            <h3 className="text-lg font-semibold text-green-800">Message Sent!</h3>
            <p className="mt-2 text-green-700">
              Thank you for reaching out. We&apos;ll get back to you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Your Name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
              />
              <input
                type="email"
                placeholder="Your Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-xl border border-border bg-white px-4 py-3 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
            <textarea
              placeholder="Your Message"
              rows={5}
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full resize-none rounded-xl border border-border bg-white px-4 py-3 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer"
            >
              Send Message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
