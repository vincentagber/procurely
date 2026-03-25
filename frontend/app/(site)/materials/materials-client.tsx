"use client";

import { useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";
import { Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function MaterialsClient({ products }: { products: Product[] }) {
  // We mimic state-driven filtering interface visually as requested.
  // When a backend is connected, this component can host the `useState` arrays to swap datasets.
  return (
    <div className="container-shell mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {/* Header Area */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end p-8 bg-white rounded-[2.5rem] shadow-[0_4px_30px_rgb(0,0,0,0.03)] border border-slate-100">
        <div className="max-w-3xl">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[#13184f] sm:text-5xl">Browse Our Materials</h1>
          <p className="text-xl text-slate-500 font-medium">Explore thousands of verified building materials with competitive pricing and reliable delivery across Lagos.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-base font-semibold text-slate-500">Filter by:</span>
          <button className="flex items-center gap-2 rounded-xl bg-slate-50 px-5 py-3 text-sm font-bold text-[#13184f] transition hover:bg-slate-100 border border-slate-200 shadow-sm">
            Newest
            <Filter className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row items-start relative">
        {/* Sidebar Filters */}
        <aside className="w-full shrink-0 flex flex-col gap-10 lg:w-[340px] lg:sticky lg:top-8 border border-slate-100 bg-white rounded-[2.5rem] p-10 shadow-[0_4px_30px_rgb(0,0,0,0.03)]">
          
          <div>
             <h3 className="mb-8 text-2xl font-bold text-[#13184f]">Materials</h3>
             <ul className="space-y-5">
                {[
                  "All Materials", "Sand & Aggregates", "Cement & Concrete",
                  "Steel & Rebars", "Wood & Boards", "Roofing", "Plumbing", "Electrical"
                ].map((item, idx) => (
                   <li key={idx}>
                      <label className="flex cursor-pointer items-center gap-5 group">
                         <div className={`flex size-7 shrink-0 items-center justify-center rounded-lg border-2 transition-colors duration-300 ${idx === 0 ? 'bg-[#1900ff] border-[#1900ff] shadow-md shadow-[#1900ff]/30' : 'border-slate-300 bg-white group-hover:border-[#1900ff]'}`}>
                            {idx === 0 && <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" /></svg>}
                         </div>
                         <span className={`text-lg font-bold transition-colors ${idx === 0 ? 'text-[#1900ff]' : 'text-slate-500 group-hover:text-[#13184f]'}`}>{item}</span>
                      </label>
                   </li>
                ))}
             </ul>
          </div>

          <hr className="border-slate-100" />

          <div>
             <h3 className="mb-8 text-2xl font-bold text-[#13184f]">Price</h3>
             <div className="space-y-8">
                <div className="relative h-2 w-full rounded-full bg-slate-100">
                   <div className="absolute left-0 h-full w-2/3 rounded-full bg-[#1900ff]"></div>
                   <div className="absolute left-0 top-1/2 -mt-3.5 -ml-3.5 size-7 rounded-full border-4 border-white bg-[#1900ff] shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
                   <div className="absolute left-2/3 top-1/2 -mt-3.5 -ml-3.5 size-7 rounded-full border-4 border-white bg-[#1900ff] shadow-md cursor-pointer hover:scale-110 transition-transform"></div>
                </div>
                <div className="flex items-center justify-between text-sm font-bold text-slate-500 pt-2">
                   <span>₦10,000</span>
                   <span>₦100,000,000</span>
                </div>
             </div>
          </div>

          <div className="mt-6 flex flex-col justify-between overflow-hidden relative rounded-[2rem] bg-gradient-to-br from-[#ff6f4d] to-[#e65432] p-10 text-white shadow-xl shadow-[#ff6f4d]/30 group transition-all hover:scale-[1.02]">
             <div className="absolute -right-8 -top-8 opacity-20 blur-3xl w-48 h-48 bg-white rounded-full transition-transform group-hover:scale-150 duration-700"></div>
             <div className="relative z-10">
               <div className="mb-8 flex items-center gap-2">
                 <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white text-lg font-black text-[#ff6f4d]">
                   P
                 </div>
                 <span className="text-2xl font-black tracking-tighter text-white">Procurely</span>
               </div>
               <h4 className="mb-4 text-3xl font-black leading-tight text-white">Need Bulk Pricing?</h4>
               <p className="mb-10 text-base font-semibold leading-relaxed text-white/95">Submit your BOQ for custom quotes from verified suppliers.</p>
             </div>
             <Link href="/contact-quote" className="relative z-10 w-full rounded-xl bg-[#0b103e] px-6 py-5 text-center text-lg font-black text-white shadow-[0_8px_20px_rgba(11,16,62,0.4)] transition hover:-translate-y-1 hover:bg-[#13184f] inline-block mt-2">
               Submit BOQ
             </Link>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full bg-white border border-slate-100 shadow-[0_4px_30px_rgb(0,0,0,0.03)] rounded-[2.5rem] p-10">
           <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
             {products.concat(products.slice(0, 4)).map((product, idx) => (
                <div key={`${product.id}-${idx}`} className="relative group hover:z-10">
                  <ProductCard product={product} index={idx} />
                </div>
             ))}
           </div>
           
           <div className="mt-16 flex justify-center pb-4">
              <button className="rounded-2xl border-2 border-slate-200 bg-white px-10 py-5 font-bold text-lg text-slate-500 transition hover:border-[#1900ff] hover:text-[#1900ff] hover:bg-blue-50/50 shadow-sm">
                 Load More Materials (120+)
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
