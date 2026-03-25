"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, ArrowRight, Clock, CheckCircle2, Loader2, ShoppingBag } from "lucide-react";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const ORDER_HISTORY_KEY = "procurely-order-history";

type StoredOrderRef = {
  orderNumber: string;
  cartToken: string;
  placedAt: string;
};

function readOrderHistory(): StoredOrderRef[] {
  try {
    const raw = window.sessionStorage.getItem(ORDER_HISTORY_KEY);
    return raw ? (JSON.parse(raw) as StoredOrderRef[]) : [];
  } catch {
    return [];
  }
}

function statusColor(status: string) {
  switch (status.toLowerCase()) {
    case "processing": return "bg-amber-50 text-amber-700 border-amber-200";
    case "shipped":    return "bg-blue-50 text-blue-700 border-blue-200";
    case "delivered":  return "bg-green-50 text-green-700 border-green-200";
    case "cancelled":  return "bg-red-50 text-red-700 border-red-200";
    default:           return "bg-slate-50 text-slate-600 border-slate-200";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${statusColor(status)}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

export default function OrderHistoryClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refs = readOrderHistory();

    if (refs.length === 0) {
      setLoading(false);
      return;
    }

    Promise.allSettled(
      refs.map((ref) =>
        api.getOrder(ref.orderNumber, ref.cartToken),
      ),
    ).then((results) => {
      const resolved = results
        .filter((r): r is PromiseFulfilledResult<Order> => r.status === "fulfilled")
        .map((r) => r.value);
      setOrders(resolved);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#1900ff]" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="mb-8 flex size-24 items-center justify-center rounded-full bg-[#f0f1fa]">
          <ShoppingBag className="size-12 text-[#1900ff]/40" />
        </div>
        <h2 className="mb-3 text-2xl font-black text-[#13184f] tracking-tight">No orders yet</h2>
        <p className="mb-10 max-w-sm text-base text-slate-500 font-medium leading-relaxed">
          Your order history will appear here once you place your first order.
        </p>
        <Link
          href="/materials"
          className="inline-flex h-14 items-center gap-2 rounded-[14px] bg-[#1900ff] px-10 text-[16px] font-bold text-white shadow-[0_8px_24px_rgba(25,0,255,0.25)] transition hover:-translate-y-0.5 hover:bg-[#1310cc]"
        >
          Browse Materials <ArrowRight className="size-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {orders.map((order) => (
        <Link
          key={order.orderNumber}
          href={`/account/orders/${order.orderNumber}`}
          className="group block rounded-[22px] border border-slate-100 bg-white p-6 sm:p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)] transition hover:border-[#1900ff]/30 hover:shadow-[0_8px_32px_rgba(25,0,255,0.08)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0f1fa] text-[#1900ff]">
                <Package className="size-6" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Order</p>
                <p className="text-[18px] font-black text-[#13184f] tracking-tight">{order.orderNumber}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6">
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Items</p>
                <p className="text-[15px] font-bold text-[#13184f]">{order.items.length}</p>
              </div>
              <div className="text-center">
                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Total</p>
                <p className="text-[15px] font-bold text-[#1900ff]">{formatCurrency(order.total, "NGN")}</p>
              </div>
              <div>
                <StatusBadge status={order.status} />
              </div>
              <ArrowRight className="size-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-[#1900ff]" />
            </div>
          </div>

          <div className="mt-5 border-t border-slate-50 pt-5">
            <div className="flex flex-wrap gap-x-8 gap-y-1 text-[13px] text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5" />
                {order.items.map((i) => i.productName).join(", ").slice(0, 80)}{order.items.map((i) => i.productName).join(", ").length > 80 ? "…" : ""}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
