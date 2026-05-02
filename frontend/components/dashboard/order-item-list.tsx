"use client";

import React, { useState, useEffect } from "react";
import { RotateCcw, Package, AlertCircle } from "lucide-react";

/**
 * ARCHITECTURE NOTE: Real-time Data Integration
 * To handle live updates (status changes, item modifications) without page refreshes:
 * 1. Use SWR or React Query with a polling interval (e.g., 5-10 seconds).
 * 2. For instant updates, implement a WebSocket listener (Socket.io or native) 
 *    that triggers a partial state update or a re-fetch when an 'order_updated' event is received.
 * 3. The 'loading' and 'error' states below provide a robust fallback for network interruptions.
 */

export interface OrderItem {
  id: string;
  productName: string;
  description: string;
  productId: string;
  unitPrice: number;
  quantity: number;
  unit: string;
  total: number;
}

interface OrderItemListProps {
  orderId: string;
  initialItems?: OrderItem[];
}

export const OrderItemList = ({ orderId, initialItems }: OrderItemListProps) => {
  const [items, setItems] = useState<OrderItem[]>(initialItems || []);
  const [loading, setLoading] = useState(!initialItems);
  const [error, setError] = useState<string | null>(null);

  // Mock data for the demonstration
  const MOCK_ITEMS: OrderItem[] = [
    {
      id: "item-1",
      productName: "Sharp Sand",
      description: "Procurely Sharp Sand 20 Tons",
      productId: "PRO2334",
      unitPrice: 4000,
      quantity: 20,
      unit: "Tons",
      total: 80000,
    },
    {
      id: "item-2",
      productName: "Marine Plywood",
      description: "Phoenix Marine Boards",
      productId: "PRO2198",
      unitPrice: 2200,
      quantity: 10,
      unit: "Sheets",
      total: 22000,
    },
    {
      id: "item-3",
      productName: "Reinforcement Steel (Rebars)",
      description: "10mm Deformed Bars, B500",
      productId: "PRO1108",
      unitPrice: 2450,
      quantity: 2,
      unit: "Bundles",
      total: 4900,
    },
  ];

  useEffect(() => {
    if (!initialItems) {
      // Simulate API fetch
      const timer = setTimeout(() => {
        setItems(MOCK_ITEMS);
        setLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [initialItems]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(val).replace("NGN", "N");
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  if (loading) {
    return (
      <div className="w-full bg-white rounded-2xl border border-slate-100 p-8 animate-pulse">
        <div className="h-6 w-48 bg-slate-100 rounded-lg mb-8" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-slate-50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-rose-50 border border-rose-100 rounded-2xl p-8 text-center">
        <AlertCircle className="mx-auto text-rose-500 mb-4" size={32} />
        <h3 className="text-rose-900 font-bold mb-2">Failed to load order items</h3>
        <p className="text-rose-700 text-sm mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-[#0A1140] tracking-tight">Order {orderId}</h2>
          <div className="flex items-center gap-2 mt-1">
             <Package size={14} className="text-slate-400" />
             <span className="text-[12px] font-bold text-slate-500 uppercase tracking-widest">{items.length} Line Items</span>
          </div>
        </div>
        <div className="text-right">
           <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Grand Total</span>
           <span className="text-2xl font-black text-[#1D4ED8] leading-none">{formatCurrency(grandTotal)}</span>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Product Name</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Unit Price</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Quantity</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400">Total</th>
              <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-[14px] font-bold text-[#0A1140]">{item.productName}</span>
                    <span className="text-[12px] font-medium text-slate-400 mt-0.5 line-clamp-1">{item.description}</span>
                    <span className="text-[10px] font-black text-[#FF5C00] mt-1 tracking-tighter">{item.productId}</span>
                  </div>
                </td>
                <td className="px-6 py-5 whitespace-nowrap font-bold text-[#0A1140] text-[14px]">{formatCurrency(item.unitPrice)}</td>
                <td className="px-6 py-5 whitespace-nowrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-lg text-[13px] font-black text-[#0A1140]">
                    {item.quantity} <span className="text-slate-400 font-bold">{item.unit}</span>
                  </span>
                </td>
                <td className="px-6 py-5 whitespace-nowrap font-black text-[#0A1140] text-[15px]">{formatCurrency(item.total)}</td>
                <td className="px-6 py-5 text-right">
                  <button 
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-[#1D4ED8] text-[#1D4ED8] rounded-xl text-[12px] font-bold hover:bg-[#1D4ED8] hover:text-white transition-all shadow-sm focus:ring-4 focus:ring-blue-100 outline-none"
                    aria-label={`Reorder ${item.productName}`}
                  >
                    <RotateCcw size={14} /> Reorder
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Layout */}
      <div className="md:hidden divide-y divide-slate-100">
        {items.map((item) => (
          <div key={item.id} className="p-6 space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div className="flex flex-col">
                <span className="text-[15px] font-black text-[#0A1140] leading-tight">{item.productName}</span>
                <span className="text-[12px] font-bold text-[#FF5C00] mt-1">{item.productId}</span>
              </div>
              <span className="text-[16px] font-black text-[#0A1140] whitespace-nowrap">{formatCurrency(item.total)}</span>
            </div>
            
            <p className="text-[12px] font-medium text-slate-500 leading-relaxed">{item.description}</p>
            
            <div className="flex items-center justify-between pt-2">
               <div className="flex flex-col">
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Price / Qty</span>
                 <span className="text-[13px] font-bold text-[#0A1140]">
                   {formatCurrency(item.unitPrice)} × {item.quantity} {item.unit}
                 </span>
               </div>
               <button 
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#F0F2FF] text-[#1D4ED8] rounded-xl text-[12px] font-bold hover:bg-[#1D4ED8] hover:text-white transition-all outline-none"
                aria-label={`Reorder ${item.productName}`}
              >
                <RotateCcw size={14} /> Reorder
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div className="p-12 text-center">
          <Package className="mx-auto text-slate-200 mb-4" size={48} />
          <p className="text-slate-400 font-bold uppercase tracking-widest">No items found in this order</p>
        </div>
      )}
    </div>
  );
};
