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

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight text-primary">My Orders</h1>
        <p className="mt-2 text-muted">Track and manage your orders</p>
      </motion.div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-white p-6">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-4 w-32 rounded bg-surface-alt" />
                  <div className="h-3 w-24 rounded bg-surface-alt" />
                </div>
                <div className="h-4 w-20 rounded bg-surface-alt" />
              </div>
            </div>
          ))}
        </div>
      ) : orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order._id || order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-xl border border-border bg-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary">Order {order._id?.slice(-8).toUpperCase() || order.id}</p>
                  <p className="text-sm text-muted">
                    {order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[order.status] || "bg-gray-100 text-gray-800"}`}>
                    {order.status}
                  </span>
                  <span className="font-bold text-primary">${order.total?.toLocaleString() || 0}</span>
                </div>
              </div>
              {order.items && order.items.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <div className="space-y-2">
                    {order.items.map((item, j) => (
                      <div key={j} className="flex justify-between text-sm">
                        <span className="text-muted">
                          {item.name} × {item.quantity}
                        </span>
                        <span className="font-medium text-primary">${item.price?.toLocaleString() || 0}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <svg className="mx-auto h-16 w-16 text-border" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-4 text-lg font-semibold text-primary">No orders yet</h3>
          <p className="mt-2 text-muted">Place your first order and it will appear here</p>
          <Link href="/shop" className="mt-6 inline-block rounded-xl bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-hover">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
