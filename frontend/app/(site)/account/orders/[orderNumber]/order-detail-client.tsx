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
} from "lucide-react";

// ─── Static order data (wire-ready) ─────────────────────────────────────────
const ORDER = {
  number: "PRC-01234",
  status: "In Transit",
  delivery: "Friday, Feb 28, 2026",
  deliveryEta: "2 days from now",
  supplier: {
    name: "Loksand Supplies",
    contact: "Adewale Shola",
    phone: "+234 803 456 7891",
    email: "info@loksand-ng.com",
    orderDate: "Feb 26, 2024",
  },
  delivery_address: {
    label: "Site A Construction",
    address: "AH16-R5, Lekki Peninsula II, Lagos Nigeria",
  },
  payment: {
    status: "Paid",
    method: "Wallet & Pay Later",
    walletBalance: "N380,000.00",
    subtotal: "N107,900",
    deliveryFee: "N6,300",
    walletUsage: "-N96,300",
    totalPaid: "N17,900",
  },
  notes:
    "Please inform me 1 hour before delivery so we can arrange for someone to receive the materials at site. All items must be unloaded and counted before the driver leaves.",
  notesDate: "Tue, Feb 26, 2024, 10:35AM",
};

const ORDER_ITEMS = [
  {
    id: "P002334",
    name: "Sharp Sand",
    category: "Procurely Sharp Sand 20 Tons",
    price: "N4,000",
    qty: "20 Tons",
    total: "N80,000",
    image:
      "https://images.unsplash.com/photo-1518115392630-9db699292931?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "P002198",
    name: "Marine Plywood",
    category: "Phoenix Marine Boards",
    price: "N2,200",
    qty: "10 Sheets",
    total: "N22,000",
    image:
      "https://images.unsplash.com/photo-1549401053-ec06d0ba405f?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: "P001108",
    name: "Reinforcement Steel (Rebars)",
    category: "10mm Deformed Bars, B500",
    price: "N2,450",
    qty: "2 Bundles",
    total: "N4,900",
    image:
      "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=200&h=200",
  },
];

const STEPPER_STEPS = [
  { label: "Confirmed", date: "Feb 26, 2026", done: true },
  { label: "Processing", date: "Feb 27, 2026", done: true },
  { label: "In Transit", date: "ETA: Feb 28, 2026", done: true, active: true },
  { label: "Delivered", date: "", done: false },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function OrderDetailClient({
  orderNumber,
}: {
  orderNumber: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-[#F8F9FA] animate-pulse" />;
  }

  return (
    <div className="space-y-6 max-w-[1440px] mx-auto">

      {/* ── Breadcrumbs ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-[12px] font-bold tracking-wide flex-wrap">
        <span className="text-slate-400">Home</span>
        <span className="text-slate-300">/</span>
        <span className="text-slate-400">pages</span>
        <span className="text-slate-300">/</span>
        <span className="text-[#1D4ED8]">Order #{ORDER.number}</span>
      </div>

      {/* ── Order Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0A1140] tracking-tight">
            #{ORDER.number}
          </h1>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-orange-50 text-orange-600 rounded-full text-[11px] font-bold border border-orange-100 shadow-sm uppercase tracking-widest">
            {ORDER.status}
          </span>
        </div>
        <p className="text-[13px] font-medium text-slate-500 flex items-center gap-2">
          Expected Delivery:&nbsp;
          <Calendar size={15} className="text-[#0A1140] shrink-0" />
          <span className="font-bold text-[#0A1140]">{ORDER.delivery}</span>
          <span className="text-slate-400">({ORDER.deliveryEta})</span>
        </p>
      </div>

      {/* ── Progress Stepper ─────────────────────────────────────────────── */}
      <div className="bg-white rounded-xl px-8 py-7 shadow-sm border border-slate-100">
        <div className="relative flex justify-between items-start">
          {/* background track */}
          <div className="absolute top-4 left-[6.25%] right-[6.25%] h-[3px] bg-slate-100 z-0" />
          {/* active track — covers first 3 steps (75 % of track) */}
          <div className="absolute top-4 left-[6.25%] w-[62.5%] h-[3px] bg-emerald-500 z-0" />

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

              <p className="text-2xl font-black text-[#0A1140]">#{ORDER.number}</p>

              <div className="space-y-1">
                <InfoRow label="Supplier" value={ORDER.supplier.name} />
                <InfoRow label="Contact" value={ORDER.supplier.contact} />
                <div className="flex gap-2 items-center mt-1 ml-[90px]">
                  <Phone size={12} className="text-slate-400 shrink-0" />
                  <span className="text-[12px] font-medium text-slate-500">
                    {ORDER.supplier.phone}
                  </span>
                </div>
                <div className="flex gap-2 items-center ml-[90px]">
                  <Mail size={12} className="text-slate-400 shrink-0" />
                  <span className="text-[12px] font-medium text-slate-500">
                    {ORDER.supplier.email}
                  </span>
                </div>
                <div className="pt-3">
                  <InfoRow label="Order Date" value={ORDER.supplier.orderDate} />
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
                      {ORDER.delivery_address.label}
                    </p>
                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">
                      {ORDER.delivery_address.address}
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
                    Arriving in 2 Days
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 border-b border-slate-100">
              <h2 className="text-[15px] font-extrabold text-[#0A1140] tracking-tight">
                Order Items
              </h2>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full uppercase tracking-wider">
                {ORDER_ITEMS.length} Items — Total: N80,000
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400">
                    <th className="px-7 py-4 font-black">Product</th>
                    <th className="px-4 py-4 font-black">Product ID</th>
                    <th className="px-4 py-4 font-black">Unit Price</th>
                    <th className="px-4 py-4 font-black">Quantity</th>
                    <th className="px-4 py-4 font-black">Total</th>
                    <th className="px-4 py-4 font-black text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ORDER_ITEMS.map((item, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/60 transition-colors group"
                    >
                      {/* Image + Name */}
                      <td className="px-7 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-100 shadow-sm shrink-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[13px] font-bold text-[#0A1140] leading-tight">
                              {item.name}
                            </p>
                            <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5 whitespace-nowrap">
                        <span className="text-[12px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                          {item.id}
                        </span>
                      </td>
                      <td className="px-4 py-5 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-[#0A1140]">
                          {item.price}
                        </span>
                      </td>
                      <td className="px-4 py-5 whitespace-nowrap">
                        <span className="text-[13px] font-bold text-[#0A1140]">
                          {item.qty}
                        </span>
                      </td>
                      <td className="px-4 py-5 whitespace-nowrap">
                        <span className="text-[13px] font-black text-[#0A1140]">
                          {item.total}
                        </span>
                      </td>
                      <td className="px-4 py-5 whitespace-nowrap text-center">
                        <button className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#1D4ED8] text-[#1D4ED8] rounded-xl text-[11px] font-bold hover:bg-blue-50 transition-colors shadow-sm">
                          <RotateCcw size={13} />
                          Reorder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total row */}
            <div className="flex items-center justify-between px-7 py-5 bg-slate-50/50 border-t border-slate-100">
              <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">
                Total Amount
              </span>
              <span className="text-[18px] font-black text-[#0A1140]">
                N 80,000
              </span>
            </div>
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
              <span className="text-[10px] font-bold text-[#1D4ED8] bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
                {ORDER.payment.status}
              </span>
            </div>

            {/* Method */}
            <div className="mb-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Payment Method
              </p>
              <p className="text-[13px] font-bold text-[#0A1140]">
                {ORDER.payment.method}
              </p>
            </div>

            {/* Wallet Balance */}
            <div className="mb-5 pb-5 border-b border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                Wallet Balance
              </p>
              <div className="flex items-center justify-between gap-2">
                <p className="text-[20px] font-black text-[#0A1140]">
                  {ORDER.payment.walletBalance}
                </p>
                <button className="h-8 px-3 bg-[#1D4ED8] text-white rounded-lg text-[10px] font-bold hover:bg-blue-800 transition-colors shrink-0 shadow-sm">
                  + Fund Wallet
                </button>
              </div>
            </div>

            {/* Fee breakdown */}
            <div className="space-y-3 pb-5 border-b border-slate-100">
              <BreakdownRow
                label="Subtotal"
                value={ORDER.payment.subtotal}
              />
              <BreakdownRow
                label="Delivery Fee"
                value={ORDER.payment.deliveryFee}
              />
              <BreakdownRow
                label="Wallet Usage"
                value={ORDER.payment.walletUsage}
                highlight="green"
              />
            </div>

            {/* Total paid */}
            <div className="flex items-center justify-between pt-4 mb-5">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Total Paid
              </span>
              <span className="text-[18px] font-black text-[#0A1140]">
                {ORDER.payment.totalPaid}
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

          {/* Order Notes */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
              Order Notes
            </h4>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <p className="text-[12px] font-medium text-slate-600 leading-relaxed">
                {ORDER.notes}
              </p>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-3">
              {ORDER.notesDate}
            </p>
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
