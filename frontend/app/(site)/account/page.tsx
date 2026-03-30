"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { Package, User, ShoppingBag, LogOut } from "lucide-react";

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [fetchingOrders, setFetchingOrders] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      api.getAccountOrders()
        .then(setOrders)
        .catch(console.error)
        .finally(() => setFetchingOrders(false));
    }
  }, [user]);

  if (loading || !user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-brand-blue)] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-brand-blue)]/10 text-[var(--color-brand-blue)]">
                <User size={32} />
              </div>
              <h2 className="mt-4 text-xl font-bold text-[var(--color-brand-navy)]">
                {user.fullName}
              </h2>
              <p className="text-sm text-slate-500">{user.email}</p>
              {user.role === "admin" && (
                <Link
                  href="/admin"
                  className="mt-4 inline-flex items-center rounded-full bg-[var(--color-brand-navy)] px-4 py-1.5 text-xs font-semibold text-white transition hover:opacity-90"
                >
                  Admin Dashboard
                </Link>
              )}
            </div>

            <nav className="mt-8 space-y-1">
              <Link
                href="/account"
                className="flex items-center gap-3 rounded-lg bg-slate-50 px-4 py-2 text-sm font-semibold text-[var(--color-brand-navy)]"
              >
                <Package size={18} />
                Orders
              </Link>
              <button
                onClick={logout}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between border-b pb-6">
              <h1 className="text-2xl font-bold text-[var(--color-brand-navy)]">Order History</h1>
              <div className="rounded-full bg-slate-100 px-4 py-1 text-sm font-medium text-slate-600">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </div>
            </div>

            <div className="mt-8">
              {fetchingOrders ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-50" />
                  ))}
                </div>
              ) : orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div
                      key={order.order_number}
                      className="group flex flex-col items-start justify-between gap-4 rounded-xl border border-slate-100 p-6 transition hover:border-[var(--color-brand-blue)]/30 hover:bg-slate-50/50 sm:flex-row sm:items-center"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-[var(--color-brand-blue)]/10 group-hover:text-[var(--color-brand-blue)]">
                          <ShoppingBag size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-[var(--color-brand-navy)]">#{order.order_number}</p>
                          <p className="text-sm text-slate-500">
                            {format(new Date(order.created_at), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>
                      <div className="flex w-full items-center justify-between gap-6 sm:w-auto">
                        <div className="text-right">
                          <p className="font-bold text-[var(--color-brand-navy)]">
                            N{(order.total / 100).toLocaleString()}
                          </p>
                          <span
                            className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              order.status === "paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-orange-100 text-orange-700"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                        <Link
                          href={`/track-order?orderNumber=${order.order_number}`}
                          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[var(--color-brand-navy)] hover:text-[var(--color-brand-navy)]"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <ShoppingBag size={32} />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-[var(--color-brand-navy)]">No orders yet</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    When you place an order, it will appear here.
                  </p>
                  <Link
                    href="/materials"
                    className="mt-6 rounded-xl bg-[var(--color-brand-blue)] px-6 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
                  >
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
