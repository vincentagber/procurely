"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/cart/cart-provider";
import type { Product } from "@/lib/types";

export function ProductActions({ product }: { product: Product }) {
  const { addItem, loading } = useCart();
  const [qty, setQty] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return (
    <div className="flex flex-col gap-6 animate-pulse">
       <div className="h-14 w-36 bg-slate-100 rounded-xl" />
       <div className="h-16 bg-slate-200 rounded-2xl" />
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="font-bold text-[#13184f]">Quantity:</span>
        <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden h-14 w-36">
           <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-1/3 h-full hover:bg-slate-50 font-bold text-xl text-[#13184f] transition">-</button>
           <div className="w-1/3 h-full flex items-center justify-center font-bold text-lg border-x-2 border-slate-200 bg-white">{qty}</div>
           <button onClick={() => setQty(qty + 1)} className="w-1/3 h-full hover:bg-slate-50 font-bold text-xl text-[#13184f] transition">+</button>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button 
           onClick={() => void addItem(product.id, qty)}
           disabled={loading}
           className="flex-1 bg-[#0b103e] hover:bg-[#1900ff] text-white font-bold text-lg py-5 rounded-2xl shadow-lg transition transform hover:-translate-y-1 cursor-pointer disabled:opacity-50"
        >
           {loading ? "Adding..." : "Add to Cart"}
        </button>
        <button className="flex items-center justify-center size-[68px] shrink-0 rounded-2xl border-2 border-slate-200 text-slate-400 hover:text-[#e43f3f] hover:border-[#e43f3f] transition bg-white shadow-sm">
           <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
        </button>
      </div>
    </div>
  );
}
