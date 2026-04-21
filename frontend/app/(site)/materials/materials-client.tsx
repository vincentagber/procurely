"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/lib/types";
import { Filter, ChevronDown } from "lucide-react";
import Link from "next/link";

export function MaterialsClient({ products }: { products: Product[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [hasMounted, setHasMounted] = useState(false);
  
  const [activeCategory, setActiveCategory] = useState("All Materials");
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [limit, setLimit] = useState(12);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setSearchQuery(params.get("q")?.toLowerCase() || "");
    }
  }, []);

  const categories = [
    "All Materials", "Sand & Aggregates", "Cement & Concrete",
    "Steel & Rebars", "Wood & Boards", "Roofing", "Plumbing", "Electrical"
  ];

  const catalog = useMemo(() => {
     // Duplicating the json mock sample safely to generate a larger catalog feel
     return [...products, ...products, ...products, ...products].map((p, i) => ({...p, listKey: `${p.id}-${i}`}));
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
  
  if (!hasMounted) {
    return <div className="container-shell mx-auto px-4 pb-20 sm:px-6 lg:px-8 animate-pulse" />;
  }

  return (
    <div className="container-shell mx-auto px-4 pb-20 sm:px-6 lg:px-8 relative">
      <div className="mb-10 flex flex-col w-full pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full mb-6 gap-4">
           <h1 className="text-[32px] sm:text-[36px] font-extrabold tracking-tight text-[#04071E]">Browse Our Materials</h1>
           
           <div className="flex items-center gap-2">
             <span className="text-[15px] font-bold text-[#98A2B3]">Filter by</span>
             <button className="flex items-center gap-2 text-[15px] cursor-pointer font-bold text-[#04071E] hover:opacity-80 transition-opacity">
               Newest
               <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-80"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="10" y1="18" x2="14" y2="18"/></svg>
             </button>
           </div>
        </div>
        <p className="text-[14px] text-[#667085] font-medium leading-[1.6] max-w-[480px]">
           Explore thousands of verified building materials with competitive pricing and reliable delivery across Lagos.
        </p>
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

          <div className="space-y-6 h-[calc(100vh-160px)] lg:h-auto overflow-y-auto pr-2 lg:pr-0 lg:overflow-visible">
            {/* Materials Filter */}
            <div 
              className="flex flex-col bg-white shadow-sm"
              style={{
                width: '100%',
                maxWidth: '319px',
                height: '296.58px',
                gap: '13.41px',
                paddingTop: '13.41px',
                paddingRight: '20.12px',
                paddingBottom: '13.41px',
                paddingLeft: '20.12px',
                borderRadius: '8.38px',
                borderWidth: '0.84px',
                borderColor: '#ECEFF2',
                borderStyle: 'solid'
              }}
            >
               <h3 className="m-0 text-[18px] font-bold leading-tight text-[#344054] shrink-0">Materials</h3>
               <ul className="flex flex-col m-0 p-0 flex-grow justify-between">
                  {categories.map((item, idx) => {
                     const isActive = activeCategory === item;
                     return (
                       <li key={idx}>
                          <label className="flex cursor-pointer items-center gap-3.5 group" onClick={() => { setActiveCategory(item); setLimit(12); if(typeof window !== 'undefined' && window.innerWidth < 1024) setShowFilters(false); }}>
                             <div className={`flex size-[18px] shrink-0 items-center justify-center rounded-[4px] border-[1.5px] transition-colors duration-200 ${isActive ? 'border-[#344054] bg-[#344054]' : 'border-slate-200 bg-white group-hover:border-slate-300'}`}>
                                {isActive && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                             </div>
                             <span className={`text-[14.5px] transition-colors select-none ${isActive ? 'text-[#344054] font-bold' : 'text-[#475467] font-semibold'}`}>{item}</span>
                          </label>
                       </li>
                     );
                  })}
               </ul>
            </div>

            {/* Price Filter */}
            <div 
              className="flex flex-col bg-white shadow-sm"
              style={{
                width: '100%',
                maxWidth: '319px',
                height: '105.99px',
                gap: '13.41px',
                paddingTop: '13.41px',
                paddingRight: '20.12px',
                paddingBottom: '13.41px',
                paddingLeft: '20.12px',
                borderRadius: '8.38px',
                borderWidth: '0.84px',
                borderColor: '#ECEFF2',
                borderStyle: 'solid'
              }}
            >
               <h3 className="m-0 text-[18px] font-bold text-[#344054] leading-none shrink-0">Price</h3>
               <div className="flex flex-col flex-grow justify-between">
                  <div className="relative w-full pt-1">
                     <style dangerouslySetInnerHTML={{__html: `
                       input[type=range]::-webkit-slider-thumb {
                         -webkit-appearance: none;
                         height: 14px;
                         width: 14px;
                         border-radius: 50%;
                         background: #344054;
                         cursor: pointer;
                         margin-top: -6px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
                       }
                       input[type=range]::-webkit-slider-runnable-track {
                         width: 100%;
                         height: 2px;
                         cursor: pointer;
                         background: #D0D5DD;
                       }
                     `}} />
                     <input 
                       type="range" 
                       min="20000" 
                       max="800000000" 
                       step="10000"
                       value={Math.max(20000, maxPrice)}
                       onChange={(e) => setMaxPrice(Number(e.target.value))}
                       className="w-full accent-[#344054] cursor-pointer h-[2px] bg-[#D0D5DD] appearance-none"
                     />
                  </div>
                  <div className="flex items-center justify-between text-[14px] font-bold tracking-tight pb-1 mt-1 shrink-0">
                     <span className="text-[#344054]">N20,000</span>
                     <span className="text-[#344054]">N800,000,000</span>
                  </div>
               </div>
            </div>

            {/* Bulk Promo Box */}
            <div 
              className="flex flex-col bg-[#FA5F29] border-[#FA5F29] border-solid shadow-sm relative overflow-hidden"
              style={{
                width: '100%',
                maxWidth: '319px',
                height: '217px',
                gap: '13.41px',
                paddingTop: '13.41px',
                paddingRight: '15px',
                paddingBottom: '13.41px',
                paddingLeft: '15px',
                borderRadius: '8.38px',
                borderWidth: '0.84px'
              }}
            >
               <div className="shrink-0">
                  <Image
                    alt="Procurely"
                    className="h-[22px] w-auto object-contain"
                    height={22}
                    src="/assets/design/logo-dark.png"
                    width={110}
                  />
               </div>
               <h4 className="text-[20px] m-0 font-extrabold leading-tight tracking-tight text-white transition-transform">Need Bulk Pricing?</h4>
               <p className="text-[14px] m-0 font-medium leading-[1.4] text-white">Submit your BOQ for custom quotes from verified suppliers.</p>
               <Link 
                 href="/contact-quote" 
                 onClick={() => setShowFilters(false)} 
                 className="mt-auto flex h-[44px] w-full shrink-0 items-center justify-center rounded-[8px] bg-[#04071E] text-[14px] font-bold text-white shadow-md transition-all hover:bg-black active:scale-[0.98]"
                >
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
                  <div key={(product as any).listKey} className="relative">
                    <ProductCard product={product} index={idx} />
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
