"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await signIn.email({
      email: form.email,
      password: form.password,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message || "Invalid email or password");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Welcome Back</h1>
          <p className="mt-2 text-muted">Sign in to your TechNest account</p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-border bg-white p-8 shadow-sm">
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
              placeholder="Enter your password"
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-primary placeholder-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-colors"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded border-border accent-accent" />
              <span className="text-muted">Remember me</span>
            </label>
            <Link href="/forgot-password" className="font-medium text-accent hover:text-accent-hover">
              Forgot password?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-accent py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-accent hover:text-accent-hover">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
