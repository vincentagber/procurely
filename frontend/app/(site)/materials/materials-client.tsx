"use client";

import { useState, useMemo } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";
import { Filter, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function MaterialsClient({ products }: { products: Product[] }) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q")?.toLowerCase() || "";
  
  const [activeCategory, setActiveCategory] = useState("All Materials");
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [limit, setLimit] = useState(12);

  const categories = [
    "All Materials", "Sand & Aggregates", "Cement & Concrete",
    "Steel & Rebars", "Wood & Boards", "Roofing", "Plumbing", "Electrical"
  ];

  const catalog = useMemo(() => {
     // Duplicating the json mock sample safely to generate a larger catalog feel
     return [...products, ...products, ...products, ...products].map((p, i) => ({...p, id: `${p.id}-${i}`}));
  }, [products]);

  const filteredProducts = useMemo(() => {
     let filtered = catalog;
     if (activeCategory !== "All Materials") {
        filtered = filtered.filter(p => p.category === activeCategory);
     }
     filtered = filtered.filter(p => p.price <= maxPrice);

     if (searchQuery) {
        filtered = filtered.filter(p => 
           p.name.toLowerCase().includes(searchQuery) || 
           p.shortDescription.toLowerCase().includes(searchQuery) ||
           p.category.toLowerCase().includes(searchQuery)
        );
     }

     return filtered;
  }, [catalog, activeCategory, maxPrice, searchQuery]);

  const displayedProducts = filteredProducts.slice(0, limit);

  const [showFilters, setShowFilters] = useState(false);
  
  return (
    <div className="container-shell mx-auto px-4 pb-20 sm:px-6 lg:px-8 relative">
      <div className="mb-10 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between w-full pt-8">
        <div className="max-w-3xl">
          <h1 className="mb-3 text-[32px] font-extrabold tracking-[-0.01em] text-[#13184f] sm:text-4xl">Browse Our Materials</h1>
          <p className="text-[17px] text-slate-500 font-medium leading-relaxed max-w-xl">Explore thousands of verified building materials with competitive pricing and reliable delivery across Lagos.</p>
        </div>
        
        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-3 shrink-0 mt-6 md:mt-0 pt-6 md:pt-0 border-t sm:border-t-0 border-slate-100">
           <button 
             onClick={() => setShowFilters(true)}
             className="flex lg:hidden items-center gap-2.5 px-6 h-12 bg-white border border-slate-200 rounded-full font-bold text-slate-700 shadow-sm hover:border-[#1900ff] transition-all"
           >
             <Filter className="size-4" />
             Filters
           </button>
           <div className="flex items-center gap-3">
             <span className="hidden sm:inline text-[15px] font-semibold text-slate-400">Sort by:</span>
             <button className="flex items-center gap-2 text-[15px] font-bold text-[#13184f] transition hover:text-[#1900ff] cursor-pointer bg-white px-4 h-12 sm:h-auto rounded-full border sm:border-0 border-slate-200 sm:p-0">
               Newest
               <ChevronDown className="size-[18px]" strokeWidth={2.5} />
             </button>
           </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row items-start relative border-t border-slate-100 pt-10">
        
        {/* Overlay for mobile filters */}
        {showFilters && (
          <div 
            className="fixed inset-0 z-[100] bg-slate-950/40 backdrop-blur-sm lg:hidden transition-opacity" 
            onClick={() => setShowFilters(false)} 
          />
        )}

        {/* Sidebar Filters - Sliding on mobile, sidebar on desktop */}
        <aside className={`
          fixed inset-y-0 left-0 z-[110] w-[300px] bg-[#f6f7fd] p-8 shadow-2xl transition-transform duration-300 transform lg:translate-x-0 lg:static lg:block lg:w-[260px] lg:p-0 lg:bg-transparent lg:shadow-none lg:z-0
          ${showFilters ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="flex items-center justify-between mb-8 lg:hidden">
             <h3 className="text-2xl font-black text-[#13184f]">Filters</h3>
             <button onClick={() => setShowFilters(false)} className="size-10 rounded-full bg-white flex items-center justify-center text-slate-400 shadow-sm">
                <ChevronDown className="size-6 rotate-90" />
             </button>
          </div>

          <div className="space-y-8 h-[calc(100vh-160px)] lg:h-auto overflow-y-auto pr-2 lg:pr-0 lg:overflow-visible">
            <div className="border border-slate-200 bg-white rounded-2xl p-7 shadow-[0_2px_10px_rgb(0,0,0,0.01)]">
               <h3 className="mb-6 text-xl font-bold text-[#13184f]">Materials</h3>
               <ul className="space-y-4">
                  {categories.map((item, idx) => {
                     const isActive = activeCategory === item;
                     return (
                       <li key={idx}>
                          <label className="flex cursor-pointer items-center gap-4 group" onClick={() => { setActiveCategory(item); setLimit(12); if(window.innerWidth < 1024) setShowFilters(false); }}>
                             <div className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-200 ${isActive ? 'border-[#1900ff] bg-white' : 'border-slate-300 bg-white group-hover:border-[#1900ff]'}`}>
                                {isActive && <div className="size-[8px] rounded-full bg-[#1900ff]"></div>}
                             </div>
                             <span className={`text-[14px] font-medium transition-colors select-none ${isActive ? 'text-[#1900ff] font-bold' : 'text-slate-600 group-hover:text-[#13184f]'}`}>{item}</span>
                          </label>
                       </li>
                     );
                  })}
               </ul>
            </div>

            <div className="border border-slate-200 bg-white rounded-2xl p-7 shadow-[0_2px_10px_rgb(0,0,0,0.01)]">
               <h3 className="mb-6 text-xl font-bold text-[#13184f]">Price Range</h3>
               <div className="space-y-4">
                  <div className="relative pt-2 pb-2">
                     <input 
                       type="range" 
                       min="10000" 
                       max="100000000" 
                       step="10000"
                       value={maxPrice}
                       onChange={(e) => setMaxPrice(Number(e.target.value))}
                       className="w-full accent-[#1900ff] cursor-pointer h-[4px] bg-slate-200 appearance-none rounded-full"
                       style={{ WebkitAppearance: 'none', appearance: 'none' }}
                     />
                  </div>
                  <div className="flex items-center justify-between text-[13px] font-bold pt-2 tracking-tight">
                     <span className="text-slate-500">₦10,000</span>
                     <span className="text-slate-600">₦{(maxPrice).toLocaleString()}</span>
                  </div>
               </div>
            </div>

            <div className="mt-2 flex flex-col justify-between overflow-hidden relative rounded-2xl bg-gradient-to-br from-[#ff6f4d] to-[#e65432] p-8 text-white shadow-[0_12px_30px_rgb(255,111,77,0.2)] group transition-all">
               <h4 className="mb-4 text-[22px] font-bold leading-tight text-white tracking-tight">Bulk Pricing?</h4>
               <p className="mb-8 text-[13px] font-medium leading-relaxed text-white/90 underline cursor-pointer">Submit your BOQ for direct supplier quotes.</p>
               <Link href="/contact-quote" onClick={() => setShowFilters(false)} className="relative z-10 w-full rounded-lg bg-[#0b103e] px-4 py-4 text-center text-[15px] font-bold text-white shadow-md transition hover:bg-[#13184f] inline-block">
                 Submit BOQ
               </Link>
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full min-h-[600px] pl-0 lg:pl-10">
           {displayedProducts.length > 0 ? (
             <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3 md:gap-y-16">
               {displayedProducts.map((product, idx) => (
                  <div key={product.id} className="relative">
                    <ProductCard product={{...product, id: product.id.split('-')[0]}} index={idx} />
                  </div>
               ))}
             </div>
           ) : (
             <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                <div className="size-24 bg-white shadow-sm border border-slate-100 flex items-center justify-center rounded-full text-slate-300 mb-6">
                   <Filter className="size-10" />
                </div>
                <h3 className="text-2xl font-extrabold text-[#13184f] mb-3">No materials found</h3>
                <p className="text-slate-500 font-medium text-lg max-w-sm">Try adjusting your category or price filters to find what you're looking for.</p>
                <button onClick={() => { setActiveCategory("All Materials"); setMaxPrice(100000000); }} className="mt-8 px-8 py-4 bg-[#13184f] text-white font-bold rounded-xl hover:bg-[#1900ff] transition">Clear Filters</button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
