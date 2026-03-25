import type { Metadata } from "next";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import OrderHistoryClient from "./orders-client";

export const metadata: Metadata = {
  title: "My Orders | Procurely",
  description: "View your Procurely order history, track deliveries, and review past purchases.",
};

export default function OrdersPage() {
  return (
    <div className="bg-[#f6f7fd] min-h-screen">
      {/* Page Header */}
      <div className="border-b border-slate-100 bg-white">
        <div className="container-shell py-8 sm:py-10">
          <Link href="/account" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-widest text-slate-400 hover:text-[#1900ff] transition-colors mb-6">
            <ArrowLeft className="size-3.5" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#f0f1fa] text-[#1900ff]">
              <Package className="size-6" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Account</p>
              <h1 className="text-2xl font-black text-[#13184f] tracking-tight">Order History</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-shell py-10">
        <OrderHistoryClient />
      </div>
    </div>
  );
}
