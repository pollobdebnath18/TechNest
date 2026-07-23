"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    const { error: authError } = await signUp.email({
      email: form.email,
      password: form.password,
      name: form.name,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message || "Failed to create account");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Create Account</h1>
          <p className="mt-2 text-muted">Join TechNest and start shopping</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-white p-8 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Full Name</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="John Doe"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Create a password (min 8 characters)"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-primary">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              placeholder="Confirm your password"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-0.5 rounded border-border accent-accent" />
            <span className="text-muted">
              I agree to the{" "}
              <Link href="/terms" className="font-medium text-accent hover:text-accent-hover">
                Terms &amp; Conditions
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="font-medium text-accent hover:text-accent-hover">
                Privacy Policy
              </Link>
            </span>
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-accent hover:text-accent-hover">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
