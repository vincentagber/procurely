"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Loader2, Package, CheckCircle2, Truck, Calendar, MapPin, Receipt, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import type { Order } from "@/lib/types";

export function TrackOrderClient() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !email) return;

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const result = await api.getOrder(orderNumber.trim(), "", email.trim());
      setOrder(result);
    } catch (err) {
      setError("We couldn't find an order matching those details. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "processing": return "bg-blue-100 text-blue-700 border-blue-200";
      case "shipped": return "bg-orange-100 text-orange-700 border-orange-200";
      case "delivered": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-100 text-slate-600 border-slate-200";
    }
  };

  return (
    <div className="bg-[#f6f7fd] min-h-screen pb-32">
      {/* Header */}
      <section className="bg-[#13184f] pt-28 pb-40 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/assets/design/hero-kitchen.png')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="container-shell relative z-10 mx-auto px-4">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl mb-6">Track Your Order</h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto font-medium">Enter your order details below to see your current status and delivery progress.</p>
        </div>
      </section>

      <div className="container-shell -mt-24 relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Tracking Form */}
          <div className="lg:col-span-12">
            <div className="rounded-[2.5rem] bg-white p-8 sm:p-12 shadow-[0_10px_50px_rgb(0,0,0,0.05)] border border-slate-100">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-end gap-6">
                <div className="flex-1 w-full">
                  <label htmlFor="orderNumber" className="mb-3 block text-sm font-bold text-slate-700 uppercase tracking-wider">Order Number</label>
                  <div className="relative">
                    <Package className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input 
                      id="orderNumber"
                      required
                      placeholder="e.g. PR-123456" 
                      className="w-full rounded-2xl bg-slate-50 border border-slate-200 pl-14 pr-6 py-5 outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff] focus:bg-white focus:ring-4 focus:ring-[#1900ff]/10 font-medium"
                      value={orderNumber}
                      onChange={(e) => setOrderNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex-1 w-full">
                  <label htmlFor="email" className="mb-3 block text-sm font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
                  <div className="relative">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
                    <input 
                      id="email"
                      required
                      type="email"
                      placeholder="john@example.com" 
                      className="w-full rounded-2xl bg-slate-50 border border-slate-200 pl-14 pr-6 py-5 outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff] focus:bg-white focus:ring-4 focus:ring-[#1900ff]/10 font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full md:w-auto rounded-2xl bg-[#1900ff] px-10 py-5 text-lg font-bold text-white shadow-[0_8px_20px_rgba(25,0,255,0.25)] transition-all hover:-translate-y-1 hover:bg-[#0000ff] focus:outline-none focus:ring-4 focus:ring-[#1900ff]/30 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="size-5 animate-spin" /> : <Search className="size-5" />}
                  <span>Track Status</span>
                </button>
              </form>
              
              {error && (
                <div className="mt-8 rounded-2xl bg-red-50 p-6 border border-red-100 flex items-center gap-4 text-red-600 font-medium">
                  <div className="size-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">!</div>
                  <p>{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Result Card */}
          {order && (
            <div className="lg:col-span-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="rounded-[2.5rem] bg-white overflow-hidden shadow-[0_20px_60px_rgb(0,0,0,0.08)] border border-slate-100">
                
                {/* Order Header */}
                <div className="bg-slate-50 p-8 sm:p-12 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                       <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Order Number</span>
                       <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(order.status)}`}>
                         {order.status}
                       </span>
                    </div>
                    <h2 className="text-3xl font-black text-[#13184f]">{order.orderNumber}</h2>
                  </div>
                  <div className="text-right">
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">Date Placed</p>
                    <p className="text-xl font-bold text-[#13184f]">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>

                {/* Progress Grid */}
                <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-10">
                  
                  {/* Status Timeline */}
                  <div className="space-y-8">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Truck className="size-4" />
                       Shipping Status
                     </h3>
                     <div className="relative pl-8 space-y-10">
                        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                        
                        <div className="relative flex items-center gap-4">
                           <div className="absolute -left-8 size-6 rounded-full bg-emerald-500 flex items-center justify-center text-white ring-4 ring-emerald-500/20">
                             <CheckCircle2 className="size-3.5" />
                           </div>
                           <div>
                              <p className="font-bold text-[#13184f]">Order Confirmed</p>
                              <p className="text-sm text-slate-500 font-medium">Successfully processed</p>
                           </div>
                        </div>

                        <div className="relative flex items-center gap-4 opacity-50">
                           <div className="absolute -left-8 size-6 rounded-full bg-slate-200 flex items-center justify-center text-white ring-4 ring-white">
                             <div className="size-2 rounded-full bg-slate-400" />
                           </div>
                           <div>
                              <p className="font-bold text-[#13184f]">Out for Delivery</p>
                              <p className="text-sm text-slate-500 font-medium">Pending shipment</p>
                           </div>
                        </div>

                        <div className="relative flex items-center gap-4 opacity-30">
                           <div className="absolute -left-8 size-6 rounded-full bg-slate-100 flex items-center justify-center text-white ring-4 ring-white">
                             <div className="size-2 rounded-full bg-slate-200" />
                           </div>
                           <div>
                              <p className="font-bold text-[#13184f]">Delivered</p>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="space-y-8">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <MapPin className="size-4" />
                       Delivery Info
                     </h3>
                     <div className="space-y-6">
                        <div>
                           <p className="font-bold text-[#13184f]">{order.customerName}</p>
                           <p className="text-slate-500 font-medium leading-relaxed mt-1">{order.address}</p>
                        </div>
                        <div className="pt-4 border-t border-slate-50">
                           <p className="text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Recipient Phone</p>
                           <p className="font-bold text-[#13184f]">{order.phone}</p>
                        </div>
                     </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-3xl bg-slate-50 p-8 space-y-6">
                     <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                       <Receipt className="size-4" />
                       Order Summary
                     </h3>
                     <div className="space-y-3">
                        {order.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-[#13184f] font-medium">{item.quantity}x {item.productName}</span>
                            <span className="font-bold text-[#13184f]">{formatCurrency(item.lineTotal)}</span>
                          </div>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-xs text-slate-400 font-bold">+ {order.items.length - 3} more items</p>
                        )}
                        <div className="border-t border-slate-200 pt-3 mt-3 flex justify-between">
                           <span className="font-bold text-[#13184f]">Total paid:</span>
                           <span className="text-xl font-black text-[#13184f]">{formatCurrency(order.total)}</span>
                        </div>
                     </div>
                     <Link href={`/account/orders/${order.orderNumber}?token=${order.orderNumber}`} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white border border-slate-200 py-3 text-sm font-bold text-[#13184f] transition hover:bg-[#13184f] hover:text-white hover:border-[#13184f]">
                       View Full Invoice
                       <ArrowRight className="size-4" />
                     </Link>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
