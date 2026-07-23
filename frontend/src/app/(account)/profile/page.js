"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function getInitialProfile() {
  if (typeof window === "undefined") {
    return { name: "", email: "", phone: "", address: "" };
  }
  try {
    const saved = JSON.parse(localStorage.getItem("userProfile") || "null");
    return saved || { name: "", email: "", phone: "", address: "" };
  } catch {
    return { name: "", email: "", phone: "", address: "" };
  }
}

export default function ProfilePage() {
  const [form, setForm] = useState(getInitialProfile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      localStorage.setItem("userProfile", JSON.stringify(form));
      setMessage("Profile saved successfully!");
    } catch {
      setMessage("Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const initials = form.name ? form.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "??";

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight text-primary">My Profile</h1>
          <p className="mt-2 text-muted">Manage your account settings</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-border bg-white p-6 sm:p-8"
        >
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-xl font-bold text-white">
              {initials}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-primary">{form.name || "Your Name"}</h2>
              <p className="text-sm text-muted">{form.email || "your@email.com"}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-primary">Full Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-primary">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-primary">Address</label>
              <textarea
                rows={3}
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="123 Tech Street, Silicon Valley, CA 94025"
                className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
              />
            </div>

            {message && (
              <p className={`text-sm font-medium ${message.includes("success") ? "text-green-600" : "text-red-600"}`}>
                {message}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 cursor-pointer"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
