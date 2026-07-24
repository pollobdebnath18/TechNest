"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getOrders, getCart, getWishlist } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

const statusColors = {
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Processing: "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(null);

  useEffect(() => {
    const userId = session?.user?.id;
    if (!userId) {
      if (fetchedRef.current !== "none") {
        setLoading(false);
        fetchedRef.current = "none";
      }
      return;
    }
    if (fetchedRef.current === userId) return;
    fetchedRef.current = userId;

    Promise.all([getOrders(userId), getCart(userId), getWishlist(userId)])
      .then(([o, c, w]) => {
        setOrders(o);
        setCartCount(c.length);
        setWishlistCount(w.length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [session?.user?.id]);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  const stats = [
    { label: "Total Orders", value: totalOrders, icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", color: "text-blue-600 bg-blue-100" },
    { label: "Total Spent", value: `$${totalRevenue.toLocaleString()}`, icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z", color: "text-green-600 bg-green-100" },
    { label: "In Cart", value: cartCount, icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z", color: "text-amber-600 bg-amber-100" },
    { label: "Wishlist", value: wishlistCount, icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", color: "text-pink-600 bg-pink-100" },
  ];

  const summaryStats = [
    { label: "Delivered", value: deliveredCount, positive: true },
    { label: "Pending", value: totalOrders - deliveredCount, positive: false },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
        <p className="mt-2 text-muted">Welcome back. Here&apos;s an overview of your account.</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-xl border border-border bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{stat.label}</p>
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
            </div>
            <p className="mt-2 text-2xl font-bold text-primary">
              {loading ? (
                <span className="inline-block h-7 w-16 animate-pulse rounded bg-surface-alt" />
              ) : (
                stat.value
              )}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {summaryStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.25 + i * 0.05 }}
            className="rounded-xl border border-border bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted">{stat.label}</span>
              <span className={`text-xs font-semibold ${stat.positive ? "text-green-600" : "text-amber-600"}`}>
                {stat.positive ? `${totalOrders ? Math.round((stat.value / totalOrders) * 100) : 0}%` : "remaining"}
              </span>
            </div>
            <p className="mt-1 text-xl font-bold text-primary">
              {loading ? (
                <span className="inline-block h-6 w-12 animate-pulse rounded bg-surface-alt" />
              ) : (
                stat.value
              )}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.35 }}
        className="mt-6 rounded-2xl border border-accent/20 bg-gradient-to-br from-accent/5 to-purple-50 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-purple-600">
              <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-base font-semibold text-primary">AI Content Generator</h3>
              <p className="text-sm text-muted">Generate blog posts, product descriptions, and social media content</p>
            </div>
          </div>
          <Link
            href="/ai/content-generator"
            className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-accent-hover hover:shadow-lg hover:shadow-accent/25"
          >
            Try it now
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </motion.div>

      <div className="mt-8 rounded-xl border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-primary">Recent Orders</h2>
          <Link href="/orders" className="text-sm font-medium text-accent hover:text-accent-hover">
            View All
          </Link>
        </div>
        {loading ? (
          <div className="p-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="animate-pulse flex justify-between py-3">
                <div className="h-4 w-32 rounded bg-surface-alt" />
                <div className="h-4 w-20 rounded bg-surface-alt" />
              </div>
            ))}
          </div>
        ) : orders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-surface/50 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">
                      {order._id?.slice(-8).toUpperCase() || order.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary">
                      ${order.total?.toLocaleString() || 0}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 text-center text-sm text-muted">No orders yet</div>
        )}
      </div>
    </div>
  );
}
