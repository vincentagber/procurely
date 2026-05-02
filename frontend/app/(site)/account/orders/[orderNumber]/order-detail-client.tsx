"use client";

import React, { useState, useEffect } from "react";
import {
  Calendar,
  Download,
  RotateCcw,
  MessageSquare,
  Truck,
  Check,
  ChevronRight,
  MapPin,
  Phone,
  Mail,
  ExternalLink,
  Plus
} from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { useAuth } from "@/components/auth/auth-provider";
import { OrderItemList } from "@/components/dashboard/order-item-list";

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrderDetailClient({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async (isSilent = false, signal?: AbortSignal) => {
    if (!isSilent) setLoading(true);
    try {
      const fetchedData = await api.getOrder(orderNumber, "", "", false, signal);
      let data = { ...fetchedData } as any;

      // Simulate real-time updates for specific order #PRC-01234
      if (orderNumber === 'PRC-01234') {
        data.status = 'In Transit';
        data.supplierName = 'Loksand Supplies';
        data.supplierContact = 'Adewale Shola';
        data.phone = '+234 803 456 7891';
        data.customerEmail = 'info@loksand.ng.com';
        data.createdAt = '2026-02-26T10:25:00Z';
        data.address = 'AH16-R5, Lekki Peninsia II, Lagos Nigeria';
        data.siteName = 'Site A Construction';
      }
      setOrder(data);
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error("Failed to fetch order detail:", err);
    } finally {
      if (!isSilent) setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    
    if (mounted) {
      // Initial fetch
      fetchOrder(false, controller.signal);

      const poll = setInterval(() => {
        fetchOrder(true, controller.signal);
      }, 8000); // Increased slightly to reduce server load
      
      return () => {
        controller.abort();
        clearInterval(poll);
      };
    }
  }, [mounted, orderNumber]);

  if (!mounted || loading) {
    return <div className="min-h-screen bg-[#F8F9FA] animate-pulse" />;
  }

  if (!order) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-100 p-12 text-center">
        <h2 className="text-2xl font-bold text-[#0A1140] mb-2">Order Not Found</h2>
        <p className="text-slate-500 mb-8">We couldn't find the procurement record you're looking for.</p>
        <button onClick={() => window.location.href = "/account/orders"} className="px-8 py-3 bg-[#0A1140] text-white rounded-xl font-bold">Back to Orders</button>
      </div>
    );
  }

  const STEPPER_STEPS = [
    { label: "Confirmed", date: "Feb 26, 2026", done: true },
    { label: "Processing", date: "Feb 27, 2026", done: true },
    { label: "In Transit", date: "ETA: Feb 28, 2026", done: true, active: true },
    { label: "Delivered", date: "-", done: false },
  ];

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">

      {/* ── Breadcrumbs ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide flex-wrap">
        <span className="text-slate-400">Home</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-400">pages</span>
        <span className="text-slate-300">/</span>
        <span className="text-[#1D4ED8]">Order #{order.orderNumber}</span>
      </div>

      {/* ── Order Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0A1140] tracking-tight">
            #{order.orderNumber}
          </h1>
          <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-bold border shadow-sm uppercase tracking-widest ${
            order.status === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'
          }`}>
            {order.status}
          </span>
        </div>
        <p className="text-[13px] font-medium text-slate-500 flex items-center gap-2">
          Expected Delivery:&nbsp;
          <Calendar size={15} className="text-[#0A1140] shrink-0" />
          <span className="font-bold text-[#0A1140]">{new Date(new Date(order.createdAt).getTime() + 86400000 * 2).toLocaleDateString()}</span>
          <span className="text-slate-400">(2 days from now)</span>
        </p>
      </div>

      {/* ── Progress Stepper ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl px-8 py-7 shadow-sm border border-slate-100">
        <div className="relative flex justify-between items-start">
          {/* background track */}
          <div className="absolute top-4 left-[6.25%] right-[6.25%] h-[3px] bg-slate-100 z-0" />
          {/* active track */}
          <div className={`absolute top-4 left-[6.25%] h-[3px] bg-emerald-500 z-0 transition-all duration-500 ${
            order.status === 'delivered' ? 'w-[87.5%]' : order.status === 'paid' ? 'w-[62.5%]' : 'w-[25%]'
          }`} />

          {STEPPER_STEPS.map((step, i) => (
            <StepperStep key={i} {...step} />
          ))}
        </div>
      </div>

      {/* ── Two-column main body ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_296px] gap-6 items-start">

        {/* ── LEFT / CENTRE COLUMN ─────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Details + Map row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Order & Supplier Details */}
            <div className="bg-white rounded-xl p-7 shadow-sm border border-slate-100 space-y-5">
              <h3 className="text-[14px] font-bold text-[#0A1140] tracking-tight">
                Order &amp; Supplier Details
              </h3>

              <p className="text-2xl font-black text-[#0A1140]">#{order.orderNumber}</p>

              <div className="space-y-1">
                <InfoRow label="Supplier" value={order.supplierName || "Loksand Supplies"} />
                <InfoRow label="Contact" value={order.supplierContact || "Adewale Shola"} />
                <div className="flex gap-2 items-center ml-[90px]">
                  <Phone size={12} className="text-slate-400 shrink-0" />
                  <span className="text-[12px] font-medium text-slate-500">
                    {order.phone || "+234 803 456 7891"}
                  </span>
                </div>
                <div className="flex gap-2 items-center ml-[90px]">
                  <Mail size={12} className="text-slate-400 shrink-0" />
                  <span className="text-[12px] font-medium text-slate-500">
                    {order.customerEmail || "info@loksand.ng.com"}
                  </span>
                </div>
                <div className="pt-3">
                  <InfoRow label="Order Date" value="Feb 26, 2026" />
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <p className="text-[12px] font-bold text-[#0A1140] mb-2 uppercase tracking-wider">
                  Delivery Address
                </p>
                <div className="flex items-start gap-2">
                  <MapPin size={14} className="text-[#FF5C00] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[14px] font-bold text-[#0A1140]">
                      Primary Delivery Site
                    </p>
                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">
                      {order.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Tracking / Map */}
            <div className="bg-white rounded-xl p-7 shadow-sm border border-slate-100 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <h3 className="text-[14px] font-bold text-[#0A1140] tracking-tight">
                  Delivery Tracking
                </h3>
                <button className="flex items-center gap-1 text-[11px] font-bold text-[#1D4ED8] hover:underline">
                  View Full Tracking <ExternalLink size={12} />
                </button>
              </div>

              {/* Map area */}
              <div className="flex-1 relative rounded-xl overflow-hidden min-h-[240px] border border-slate-100 group">
                <img
                  src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800&h=600"
                  alt="Map"
                  className="w-full h-full object-cover transition-all grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-blue-600/5" />

                {/* Origin pin */}
                <div className="absolute top-[30%] left-[22%] w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-bounce" />
                {/* Destination pin */}
                <div className="absolute bottom-[28%] right-[30%] w-4 h-4 bg-[#1D4ED8] rounded-full border-4 border-white shadow-lg" />

                {/* ETA badge */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2 whitespace-nowrap">
                  <Truck size={15} className="text-[#FF5C00]" />
                  <span className="text-[12px] font-bold text-[#0A1140]">
                    {order.status === 'delivered' ? 'Delivered' : 'Arriving in 2 Days'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <OrderItemList 
            orderId={order.orderNumber} 
            initialItems={order.items?.map((item: any) => ({
              id: item.id || `item-${Math.random()}`,
              productName: item.productName,
              description: item.description || "High-quality procurement material",
              productId: item.productId || "PRO-UNKNOWN",
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              unit: item.unit || "Units",
              total: item.lineTotal
            }))}
          />

          {/* Order Notes */}
          <div className="bg-[#FFF8F1] rounded-xl p-7 border border-[#FFE5D3] space-y-4">
             <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-extrabold text-[#0A1140] uppercase tracking-wider">Order Notes</h3>
                <span className="text-[11px] font-bold text-slate-400 italic">Tue, Feb 26, 2026 10:25AM</span>
             </div>
             <p className="text-[13px] font-medium text-[#0A1140] leading-relaxed italic opacity-80">
                &quot;Please inform us 1 hour before delivery so we can arrange for someone to receive the materials at site. All items must be unloaded and counted before the driver leaves.&quot;
             </p>
          </div>

        </div>

        {/* ── RIGHT SIDEBAR ─────────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Payment Status Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-5">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-[#0A1140]">
                Payment Status
              </h4>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${
                order.status === 'paid' ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' : 'text-orange-600 bg-orange-50 border border-orange-100'
              }`}>
                {order.status === 'paid' ? 'Paid' : 'Pending'}
              </span>
            </div>

            {/* Method */}
            <div className="mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Payment Method
              </p>
              <p className="text-[13px] font-bold text-[#0A1140]">
                Wallet &amp; Pay Later
              </p>
            </div>

            {/* Wallet Balance */}
            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
               <div className="flex flex-col">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Wallet Balance</p>
                  <p className="text-[15px] font-black text-[#1D4ED8]">N380,000.00</p>
               </div>
               <button className="w-8 h-8 bg-[#1D4ED8] text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors shadow-sm">
                  <Plus size={16} />
               </button>
            </div>

            {/* Fee breakdown */}
            <div className="space-y-3 pb-5 border-b border-slate-100">
              <BreakdownRow
                label="Subtotal"
                value="N107,900"
              />
              <BreakdownRow
                label="Delivery Fee"
                value="N6,300"
              />
              <BreakdownRow
                label="Wallet Usage"
                value="-N96,500"
                highlight="green"
              />
            </div>

            {/* Total paid */}
            <div className="flex items-center justify-between pt-4 mb-5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Paid
              </span>
              <span className="text-[18px] font-black text-[#0A1140]">
                N17,900
              </span>
            </div>

            {/* Track Order CTA */}
            <button className="w-full h-[46px] bg-[#0A1140] hover:bg-[#060e2d] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 shadow-md transition-colors focus:ring-4 focus:ring-slate-900/20">
              <Truck size={16} />
              Track Order
            </button>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-3">
            <h4 className="text-[13px] font-bold text-[#0A1140] mb-2">Actions</h4>

            <button className="w-full flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 transition-all group">
              <div className="flex items-center gap-3">
                <Download size={15} className="text-slate-400 group-hover:text-[#1D4ED8]" />
                <span className="text-[12px] font-bold text-slate-600">
                  Download Invoice
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 group-hover:text-[#1D4ED8]"
              />
            </button>

            <button className="w-full flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-blue-50/50 hover:border-blue-100 transition-all group">
              <div className="flex items-center gap-3">
                <MessageSquare
                  size={15}
                  className="text-slate-400 group-hover:text-[#1D4ED8]"
                />
                <span className="text-[12px] font-bold text-slate-600">
                  Request Support
                </span>
              </div>
              <ChevronRight
                size={14}
                className="text-slate-300 group-hover:text-[#1D4ED8]"
              />
            </button>

            <button className="w-full h-[46px] bg-[#FF5C00] hover:bg-[#e65300] text-white rounded-xl text-[12px] font-bold flex items-center justify-center gap-2 mt-2 shadow-md transition-colors focus:ring-4 focus:ring-orange-500/30">
              <RotateCcw size={15} />
              Reorder All Items
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Helper sub-components ────────────────────────────────────────────────────

function StepperStep({
  label,
  date,
  done,
  active,
}: {
  label: string;
  date: string;
  done: boolean;
  active?: boolean;
}) {
  return (
    <div className="relative flex flex-col items-center flex-1 z-10">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center border-[3px] bg-white transition-all duration-300 ${
          done && !active
            ? "border-emerald-500 text-emerald-500"
            : active
            ? "border-orange-400 text-orange-500"
            : "border-slate-200 text-slate-200"
        }`}
      >
        {done && !active ? (
          <Check size={14} strokeWidth={3} />
        ) : active ? (
          <div className="w-2.5 h-2.5 rounded-full bg-orange-400" />
        ) : (
          <div className="w-2 h-2 rounded-full bg-slate-200" />
        )}
      </div>
      <p
        className={`mt-3 text-[11px] font-bold uppercase tracking-wider ${
          done || active ? "text-[#0A1140]" : "text-slate-400"
        }`}
      >
        {label}
      </p>
      {date && (
        <p className="mt-0.5 text-[10px] font-medium text-slate-400 text-center">
          {date}
        </p>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 w-[80px] pt-0.5">
        {label}:
      </span>
      <span className="text-[13px] font-bold text-[#0A1140]">{value}</span>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: "green";
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        {label}
      </span>
      <span
        className={`text-[12px] font-bold ${
          highlight === "green" ? "text-emerald-600" : "text-[#0A1140]"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
