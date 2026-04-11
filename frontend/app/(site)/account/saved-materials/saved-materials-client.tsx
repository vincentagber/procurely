"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  History,
  Bookmark,
  Settings,
  LogOut,
  Bell,
  ChevronRight,
  Eye,
  Heart,
  Menu
} from "lucide-react";

/**
 * PROCURELY HIGH-FIDELITY SAVED MATERIALS
 * Aligned with unified Orders Dashboard Typography & Coloring
 */

const savedItems = [
  { id: 1, name: "Procurely Sharp Sand", desc: "A Premium Quality Sand", category: "Decorative & Furnishing Solutions", price: "N 18,500", image: "https://images.unsplash.com/photo-1518115392630-9db699292931?auto=format&fit=crop&q=80&w=400&h=400", isNew: true },
  { id: 2, name: "Procurely Marine Boards", desc: "A Premium Quality Boards", category: "Decorative & Furnishing Solutions", price: "N 14,500", image: "https://images.unsplash.com/photo-1549401053-ec06d0ba405f?auto=format&fit=crop&q=80&w=400&h=400", isNew: false },
  { id: 3, name: "Granite (3/4 & 1/2)", desc: "Premium Aggregates", category: "Decorative & Furnishing Solutions", price: "N 45,000", image: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=400&h=400", isNew: false },
  { id: 4, name: "Procurely Cement 50kg", desc: "A Premium Bulk Cement", category: "Decorative & Furnishing Solutions", price: "N 5,800", image: "https://images.unsplash.com/photo-1518115392630-9db699292931?auto=format&fit=crop&q=80&w=400&h=400", isNew: false },
  { id: 5, name: "Procurely Sharp Sand", desc: "A Premium Quality Sand", category: "Decorative & Furnishing Solutions", price: "N 18,500", image: "https://images.unsplash.com/photo-1518115392630-9db699292931?auto=format&fit=crop&q=80&w=400&h=400", isNew: true },
  { id: 6, name: "Procurely Marine Boards", desc: "A Premium Quality Boards", category: "Decorative & Furnishing Solutions", price: "N 14,500", image: "https://images.unsplash.com/photo-1549401053-ec06d0ba405f?auto=format&fit=crop&q=80&w=400&h=400", isNew: false },
  { id: 7, name: "Granite (3/4 & 1/2)", desc: "Premium Aggregates", category: "Decorative & Furnishing Solutions", price: "N 45,000", image: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=400&h=400", isNew: false },
  { id: 8, name: "Procurely Cement 50kg", desc: "A Premium Bulk Cement", category: "Decorative & Furnishing Solutions", price: "N 5,800", image: "https://images.unsplash.com/photo-1518115392630-9db699292931?auto=format&fit=crop&q=80&w=400&h=400", isNew: false },
];

export default function SavedMaterialsClient() {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className="bg-[#F8F9FA] min-h-screen animate-pulse" />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-slate-800 font-sans">
      
      {/* 📁 LEFT SIDEBAR - Unified with orders-client.tsx */}
      <aside className="w-[260px] flex-shrink-0 bg-[#0A1140] text-white hidden lg:flex flex-col sticky top-0 h-screen overflow-y-auto scrollbar-hide shadow-2xl z-10">
         <div className="p-8 border-b border-white/10">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-1">Procurely<span className="text-[10px]">&trade;</span></h2>
         </div>
         
         <div className="p-8 border-b border-white/10 flex items-center gap-4 text-left">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 shrink-0">
               <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" alt="User Avatar" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
               <p className="font-bold text-[14px] leading-tight text-white whitespace-nowrap">Olusegun Akapo</p>
               <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-1 truncate">Procurement Manager</p>
            </div>
         </div>

         <div className="p-6 pb-8 flex-1">
            <div className="text-[10px] font-black tracking-[0.2em] text-white/40 mb-4 px-2">MAIN MENU</div>
            <nav className="space-y-1 relative">
               <SidebarItem icon={<LayoutDashboard size={18} />} label="My Dashboard" />
               <SidebarItem icon={<ShoppingCart size={18} />} label="Orders" />
               <SidebarItem icon={<Wallet size={18} />} label="Wallet / Payments" />
               <SidebarItem icon={<History size={18} />} label="Order History" />
               <SidebarItem icon={<Bookmark size={18} />} label="Saved Materials" active />
               
               <div className="h-4 border-b border-white/10 mx-4 mb-4" />
               <SidebarItem icon={<Settings size={18} />} label="Account Settings" />
               <SidebarItem icon={<LogOut size={18} />} label="Logout" />
            </nav>
         </div>
      </aside>

      {/* 📊 MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
         
         {/* Top Header Placeholder (To align with overall structure) */}
         <header className="bg-white border-b border-slate-100 h-20 px-8 lg:px-12 flex items-center justify-between sticky top-0 z-20">
            <div className="flex items-center gap-4">
               <button className="xl:hidden p-2 bg-slate-50 rounded-xl"><Menu size={20} /></button>
            </div>
            <div className="flex items-center gap-6">
               <div className="relative cursor-pointer">
                  <Bell size={20} className="text-slate-500" />
                  <div className="absolute top-0 right-0 w-2 h-2 bg-orange-600 rounded-full border-2 border-white" />
               </div>
               <div className="h-10 w-10 bg-[#0A1140] rounded-full p-0.5">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" className="w-full h-full object-cover rounded-full" alt="Profile" />
               </div>
            </div>
         </header>

         {/* Workspace Area */}
         <main className="flex-1 p-4 lg:p-8 min-w-0">
            <div className="max-w-[1440px] mx-auto">
               
               {/* Unified Breadcrumb Strip */}
               <div className="mb-6 flex items-center gap-2 text-[12px] font-bold tracking-wide">
                  <span className="text-slate-400">Home</span> 
                  <span className="text-slate-300">/</span> 
                  <span className="text-slate-400">pages</span> 
                  <span className="text-slate-300">/</span> 
                  <span className="text-[#0A1140] font-black">Saved Materials</span>
               </div>

               {/* Header Section */}
               <div className="space-y-1 mb-8">
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0A1140] tracking-tight">Saved Items</h1>
                  <p className="text-[13px] font-medium text-slate-500">You have 8 curated materials in your collection.</p>
               </div>

               {/* Standardized Product Grid */}
               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 xl:gap-8">
                  {savedItems.map((item) => (
                     <ProductCard key={item.id} product={item} />
                  ))}
               </div>

            </div>
         </main>
      </div>
    </div>
  );
}

// --- Internal Components ---

function ProductCard({ product }: { product: any }) {
   return (
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 group hover:shadow-lg hover:border-blue-100 transition-all duration-300 flex flex-col h-full">
         {/* Image Area */}
         <div className="aspect-square bg-slate-50/50 rounded-xl p-8 mb-5 relative overflow-hidden flex items-center justify-center border border-slate-50">
            {product.isNew && (
               <div className="absolute top-4 left-4 z-10 bg-[#1D4ED8] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow-sm">New</div>
            )}
            
            {/* Quick Actions Overlay */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-100 lg:opacity-0 group-hover:opacity-100 transition-all transform lg:translate-x-2 lg:group-hover:translate-x-0">
               <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-rose-500 hover:bg-rose-50 hover:scale-105 transition-all"><Heart size={14} fill="currentColor" /></button>
               <button className="w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-500 hover:text-[#1D4ED8] hover:bg-blue-50 hover:scale-105 transition-all"><Eye size={14} /></button>
            </div>

            <img src={product.image} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" alt={product.name} />
         </div>

         {/* Content Area */}
         <div className="flex-1 flex flex-col px-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 whitespace-nowrap truncate">{product.category}</p>
            <h3 className="text-[15px] font-extrabold text-[#0A1140] leading-snug mb-1.5">{product.name}</h3>
            <p className="text-[12px] font-medium text-slate-500 mb-5 line-clamp-2">{product.desc}</p>
            
            <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-4">
               <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-0.5">Unit Price</span>
                  <span className="text-[18px] font-black text-[#0A1140]">{product.price}</span>
               </div>
               <button className="h-10 px-4 bg-[#FF5C00] text-white rounded-xl shadow-md flex items-center gap-2 hover:bg-[#e65300] transition-colors focus:ring-4 focus:ring-orange-500/30">
                  <ShoppingCart size={16} /> 
                  <span className="text-[12px] font-bold whitespace-nowrap">Add</span>
               </button>
            </div>
         </div>
      </div>
   );
}

function SidebarItem({ icon, label, active = false }: any) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none ${
       active ? "bg-[#1D4ED8] text-white font-bold shadow-md shadow-blue-900/50" : "text-white/60 hover:bg-white/10 hover:text-white font-medium"
    }`}>
      <span className={`shrink-0 ${active ? "text-white" : "text-white/40"}`}>{icon}</span>
      <span className="text-[13px] tracking-wide whitespace-nowrap truncate">{label}</span>
    </button>
  );
}
