"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createItem } from "@/lib/api";

export default function AddItemPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    fullDescription: "",
    price: "",
    imageUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Title is required");
    if (!form.shortDescription.trim()) return setError("Short description is required");
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      return setError("Please enter a valid price");
    }

    if (!session?.user) {
      return setError("You must be logged in to create an item.");
    }

    setSubmitting(true);
    try {
      await createItem({
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        price: parseFloat(form.price),
        imageUrl: form.imageUrl.trim() || null,
        userId: session.user.id,
        userName: session.user.name || "User",
      });
      setSuccess(true);
      setTimeout(() => router.push("/items/manage"), 1500);
    } catch (err) {
      setError(err.message || "Failed to create item. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <nav className="mb-4 text-sm text-muted">
          <Link href="/items/manage" className="hover:text-primary">My Items</Link>
          <span className="mx-2">/</span>
          <span className="text-primary">Add New</span>
        </nav>
        <h1 className="text-3xl font-bold tracking-tight text-primary">Add New Item</h1>
        <p className="mt-2 text-muted">Create a new item listing for your collection.</p>
      </motion.div>

      {success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-green-200 bg-green-50 p-8 text-center"
        >
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-green-800">Item Created Successfully!</h3>
          <p className="mt-2 text-sm text-green-600">Redirecting to your items...</p>
        </motion.div>
      ) : (
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="rounded-2xl border border-border bg-white p-6 sm:p-8"
        >
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Title *</label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g., Wireless Noise-Cancelling Headphones"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Short Description *</label>
              <input
                type="text"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
                placeholder="Brief one-line description"
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-primary mb-1.5 block">Full Description</label>
              <textarea
                name="fullDescription"
                value={form.fullDescription}
                onChange={handleChange}
                rows={5}
                placeholder="Detailed description of the item..."
                className="w-full resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
              />
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-primary mb-1.5 block">Image URL</label>
                <input
                  type="url"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
                />
              </div>
            </div>

            {form.imageUrl && (
              <div className="rounded-xl border border-border bg-surface p-4">
                <p className="text-xs font-medium text-muted mb-2">Image Preview</p>
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="h-32 w-full rounded-lg object-contain"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              </div>
            )}
          </div>

          <div className="mt-8 flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Item"
              )}
            </button>
            <Link
              href="/items/manage"
              className="rounded-xl border border-border px-6 py-3 text-sm font-medium text-muted transition-colors hover:bg-surface"
            >
              Cancel
            </Link>
          </div>
        </motion.form>
      )}
    </div>
  );
}
