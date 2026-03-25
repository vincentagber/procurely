"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, Package, Clock, MapPin, Phone, Mail, User,
  CheckCircle2, Loader2, AlertCircle, ArrowRight, Truck,
} from "lucide-react";
import { api } from "@/lib/api";
import type { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

const ORDER_HISTORY_KEY = "procurely-order-history";

type StoredOrderRef = { orderNumber: string; cartToken: string; placedAt: string };

function getCartTokenForOrder(orderNumber: string): string | null {
  try {
    const raw = window.sessionStorage.getItem(ORDER_HISTORY_KEY);
    if (!raw) return null;
    const refs = JSON.parse(raw) as StoredOrderRef[];
    return refs.find((r) => r.orderNumber === orderNumber)?.cartToken ?? null;
  } catch {
    return null;
  }
}

const STATUS_STEPS = ["processing", "confirmed", "shipped", "delivered"] as const;

function statusIndex(status: string) {
  return STATUS_STEPS.findIndex((s) => s === status.toLowerCase());
}

function StatusTracker({ status }: { status: string }) {
  const current = statusIndex(status);

  return (
    <div className="relative flex items-center justify-between gap-2">
      {/* Progress line */}
      <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full z-0" />
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#1900ff] rounded-full z-0 transition-all duration-700"
        style={{ width: `${current < 0 ? 0 : (current / (STATUS_STEPS.length - 1)) * 100}%` }}
      />

      {STATUS_STEPS.map((step, i) => {
        const done = i <= current;
        return (
          <div key={step} className="relative z-10 flex flex-col items-center gap-2">
            <div
              className={`flex size-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                done
                  ? "border-[#1900ff] bg-[#1900ff] text-white shadow-[0_0_0_4px_rgba(25,0,255,0.12)]"
                  : "border-slate-200 bg-white text-slate-300"
              }`}
            >
              {done ? <CheckCircle2 className="size-5" /> : <span className="text-[11px] font-bold">{i + 1}</span>}
            </div>
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                done ? "text-[#1900ff]" : "text-slate-300"
              }`}
            >
              {step}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailClient() {
  const params = useParams<{ orderNumber: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const { orderNumber } = params;
    if (!orderNumber) return;

    const cartToken = getCartTokenForOrder(orderNumber);

    api
      .getOrder(orderNumber, cartToken ?? "")
      .then((data: Order) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Order not found.");
        setLoading(false);
      });
  }, [params]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#1900ff]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="size-10 text-red-400" />
        </div>
        <div>
          <h2 className="text-xl font-black text-[#13184f] mb-2">Order Not Found</h2>
          <p className="text-slate-500 font-medium">{error ?? "We couldn't retrieve this order."}</p>
        </div>
        <Link href="/account/orders" className="inline-flex h-12 items-center gap-2 rounded-[12px] bg-[#13184f] px-8 text-[15px] font-bold text-white transition hover:bg-[#1900ff]">
          <ArrowLeft className="size-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-slate-400 transition hover:text-[#1900ff]"
      >
        <ArrowLeft className="size-4" /> All Orders
      </Link>

      {/* Header Card */}
      <div className="rounded-[24px] bg-[#13184f] p-8 sm:p-10 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 20%, #1900ff 0%, transparent 60%)" }} />
        <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-1">Order Number</p>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{order.orderNumber}</h1>
            <p className="mt-2 text-white/60 font-medium text-[14px] flex items-center gap-1.5">
              <Clock className="size-3.5" />
              Placed {new Date(order.createdAt).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-3">
            <span className="rounded-full bg-white/15 backdrop-blur-sm px-4 py-1.5 text-[12px] font-bold uppercase tracking-widest">
              {order.status}
            </span>
            <p className="text-3xl font-black">{formatCurrency(order.total, "NGN")}</p>
          </div>
        </div>
      </div>

      {/* Status Tracker */}
      <div className="rounded-[24px] border border-slate-100 bg-white p-8 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-8">
          <Truck className="size-5 text-[#1900ff]" />
          <h2 className="text-[16px] font-black text-[#13184f] tracking-tight">Delivery Status</h2>
        </div>
        <StatusTracker status={order.status} />
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

        {/* Order Items */}
        <div className="rounded-[24px] border border-slate-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 border-b border-slate-50 p-6 sm:p-8">
            <Package className="size-5 text-[#1900ff]" />
            <h2 className="text-[16px] font-black text-[#13184f] tracking-tight">Items Ordered</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {order.items.map((item) => (
              <div key={item.productId} className="flex items-center justify-between gap-4 px-6 py-5 sm:px-8">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#f0f1fa] text-[#1900ff] text-[13px] font-black">
                    ×{item.quantity}
                  </div>
                  <div>
                    <p className="text-[15px] font-bold text-[#13184f] leading-tight">{item.productName}</p>
                    <p className="text-[12px] text-slate-400 font-medium mt-0.5">{formatCurrency(item.unitPrice, "NGN")} / unit</p>
                  </div>
                </div>
                <p className="text-[15px] font-black text-[#1900ff] shrink-0">{formatCurrency(item.lineTotal, "NGN")}</p>
              </div>
            ))}
          </div>
          {/* Totals */}
          <div className="border-t border-slate-100 px-6 py-5 sm:px-8 space-y-3">
            <div className="flex justify-between text-[14px] text-slate-500 font-semibold">
              <span>Subtotal</span><span>{formatCurrency(order.subtotal, "NGN")}</span>
            </div>
            <div className="flex justify-between text-[14px] text-slate-500 font-semibold">
              <span>Delivery Fee</span>
              <span>{order.serviceFee === 0 ? <span className="text-green-600">Free</span> : formatCurrency(order.serviceFee, "NGN")}</span>
            </div>
            <div className="flex justify-between text-[17px] font-black text-[#13184f] border-t border-slate-100 pt-3">
              <span>Total</span><span className="text-[#1900ff]">{formatCurrency(order.total, "NGN")}</span>
            </div>
          </div>
        </div>

        {/* Customer Details */}
        <div className="rounded-[24px] border border-slate-100 bg-white shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-3 border-b border-slate-50 p-6 sm:p-8">
            <User className="size-5 text-[#1900ff]" />
            <h2 className="text-[16px] font-black text-[#13184f] tracking-tight">Delivery Details</h2>
          </div>
          <div className="p-6 sm:p-8 space-y-5">
            {[
              { Icon: User,  label: "Full Name",  value: order.customerName },
              { Icon: Mail,  label: "Email",       value: order.customerEmail },
              { Icon: Phone, label: "Phone",       value: order.phone },
              { Icon: MapPin, label: "Address",    value: order.address },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#f0f1fa] text-[#1900ff]">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                  <p className="text-[15px] font-semibold text-[#13184f] mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
        <Link
          href="/materials"
          className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-[14px] bg-[#1900ff] px-10 text-[16px] font-bold text-white shadow-[0_8px_24px_rgba(25,0,255,0.25)] transition hover:-translate-y-0.5 hover:bg-[#1310cc]"
        >
          Order Again <ArrowRight className="size-5" />
        </Link>
        <Link
          href="/contact-quote"
          className="inline-flex h-14 w-full sm:w-auto items-center justify-center gap-2 rounded-[14px] border-2 border-slate-200 px-10 text-[16px] font-bold text-[#13184f] transition hover:border-[#1900ff] hover:text-[#1900ff]"
        >
          Get Bulk Quote
        </Link>
      </div>
    </div>
  );
}
