"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getOrders } from "@/lib/api";

const statusColors = {
  Delivered: "bg-green-100 text-green-800",
  Shipped: "bg-blue-100 text-blue-800",
  Processing: "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  const stats = [
    { label: "Total Orders", value: totalOrders, change: "+12%", positive: true },
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString()}`, change: "+8%", positive: true },
    { label: "Delivered", value: deliveredCount, change: `${totalOrders ? Math.round((deliveredCount / totalOrders) * 100) : 0}%`, positive: true },
    { label: "Pending", value: totalOrders - deliveredCount, change: "remaining", positive: false },
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
            <p className="text-sm text-muted">{stat.label}</p>
            <p className="mt-1 text-2xl font-bold text-primary">{stat.value}</p>
            <p className={`mt-1 text-xs font-medium ${stat.positive ? "text-green-600" : "text-red-600"}`}>
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

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
