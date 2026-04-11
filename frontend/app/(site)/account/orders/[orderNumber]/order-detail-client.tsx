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
  Search,
  MoreVertical,
  Plus,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Package,
  ArrowRight,
  Building,
  Menu,
  X,
  CreditCard,
  FileText,
  Calendar,
  MapPin,
  ExternalLink,
  Download,
  RotateCcw,
  MessageSquare,
  Truck,
  Check
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PROCURELY HIGH-FIDELITY ORDER DETAIL
 * Aligned with unified Orders Dashboard Typography & Coloring
 */

const orderItems = [
  { id: "P002334", name: "Sharp Sand", category: "Procurely Sharp Sand 20 Tons", price: "N4,000", qty: "20 Tons", total: "N80,000", image: "https://images.unsplash.com/photo-1518115392630-9db699292931?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "P002198", name: "Marine Plywood", category: "Phoenix Marine Boards", price: "N2,200", qty: "10 Sheets", total: "N22,000", image: "https://images.unsplash.com/photo-1549401053-ec06d0ba405f?auto=format&fit=crop&q=80&w=200&h=200" },
  { id: "P001108", name: "Reinforcement Steel (Rebars)", category: "10mm Deformed Bars, B500", price: "N2,450", qty: "2 Bundles", total: "4,900", image: "https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?auto=format&fit=crop&q=80&w=200&h=200" },
];

export default function OrderDetailClient({ orderNumber }: { orderNumber: string }) {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className="bg-[#F8F9FA] min-h-screen animate-pulse" />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F9FA] text-slate-800 font-sans">
      
      {/* 📁 LEFT SIDEBAR - Unified */}
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
               <SidebarItem icon={<ShoppingCart size={18} />} label="Orders" active />
               <SidebarItem icon={<Wallet size={18} />} label="Wallet / Payments" />
               <SidebarItem icon={<History size={18} />} label="Order History" />
               <SidebarItem icon={<Bookmark size={18} />} label="Saved Materials" />
               
               <div className="h-4 border-b border-white/10 mx-4 mb-4" />
               <SidebarItem icon={<Settings size={18} />} label="Account Settings" />
               <SidebarItem icon={<LogOut size={18} />} label="Logout" />
            </nav>
         </div>
      </aside>

      {/* 📊 MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
         
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
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" className="w-full h-full object-cover rounded-full" />
               </div>
            </div>
         </header>

         <main className="flex-1 p-4 lg:p-8 min-w-0">
            <div className="max-w-[1440px] mx-auto">
               
               {/* Unified Breadcrumb Strip */}
               <div className="mb-6 flex items-center gap-2 text-[12px] font-bold tracking-wide">
                  <span className="text-slate-400">Home</span> 
                  <span className="text-slate-300">/</span> 
                  <span className="text-slate-400">pages</span> 
                  <span className="text-slate-300">/</span> 
                  <span className="text-[#0A1140] font-black">Order #{orderNumber}</span>
               </div>

               <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
                  
                  {/* LEFT & CENTER (Main Content) */}
                  <div className="space-y-6">
                     
                     {/* Order Header */}
                     <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                        <div className="flex items-center gap-4">
                           <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0A1140] tracking-tight">#{orderNumber}</h1>
                           <span className="bg-orange-50 text-orange-600 px-4 py-1.5 rounded-full text-[11px] font-bold border border-orange-100 uppercase tracking-widest shadow-sm">In Transit</span>
                        </div>
                     </div>
                     <p className="text-sm font-medium text-slate-500 flex items-center gap-2">
                        Expected Delivery: <Calendar size={16} className="text-[#0A1140]" /> <span className="text-[#0A1140] font-bold">Friday, Feb 28, 2026</span> <span className="text-slate-400">(2 days from now)</span>
                     </p>

                     {/* Stepper Implementation */}
                     <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-50 mt-6">
                        <div className="relative flex justify-between items-start">
                           {/* BG Line */}
                           <div className="absolute top-4 left-0 right-0 h-1 bg-slate-50 z-0" />
                           {/* Active Line (Emerald) */}
                           <div className="absolute top-4 left-0 w-[66%] h-1 bg-emerald-500 z-0" />
                           
                           <StepperStep label="Confirmed" date="Feb 26, 2024" completed />
                           <StepperStep label="Processing" date="Feb 27, 2024" completed />
                           <StepperStep label="In Transit" date="ETA: Feb 28, 2024" completed />
                           <StepperStep label="Delivered" date="" />
                        </div>
                     </div>

                     {/* Middle Section: Details & Map */}
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Order & Supplier Details */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-50 space-y-6">
                           <h3 className="text-[14px] font-bold text-[#0A1140] mb-2 tracking-tight">Order & Supplier Details</h3>
                           <div className="space-y-5">
                              <div>
                                 <p className="text-2xl font-black text-[#0A1140]">#{orderNumber}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                 <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Supplier:</p>
                                    <p className="text-sm font-bold text-[#0A1140]">Loksand Supplies</p>
                                 </div>
                                 <div>
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Contact:</p>
                                    <p className="text-sm font-bold text-[#0A1140]">Adewale Shola</p>
                                    <p className="text-[12px] font-medium text-slate-500 mt-0.5">+234 803 456 7891</p>
                                    <p className="text-[12px] font-medium text-slate-500">info@loksand-ng.com</p>
                                 </div>
                              </div>
                              <div className="pt-4 border-t border-slate-100">
                                 <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Order Date:</p>
                                 <p className="text-sm font-bold text-[#0A1140]">Feb 26, 2024</p>
                              </div>
                              <div className="pt-4 border-t border-slate-100">
                                 <p className="text-[12px] font-bold text-[#0A1140] mb-1">Delivery Address</p>
                                 <p className="text-[14px] font-bold text-[#0A1140]">Site A Construction</p>
                                 <p className="text-[12px] font-medium text-slate-500 mt-0.5">AH16-R5, Lekki Peninsula II, Lagos Nigeria</p>
                              </div>
                           </div>
                        </div>

                        {/* Delivery Tracking (Map Placeholder) */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-50 space-y-6 flex flex-col">
                           <div className="flex justify-between items-center">
                              <h3 className="text-[14px] font-bold text-[#0A1140] tracking-tight">Delivery Tracking</h3>
                              <button className="text-[11px] font-bold text-[#1D4ED8] hover:underline">View Full Tracking</button>
                           </div>
                           <div className="flex-1 bg-slate-50 rounded-xl relative overflow-hidden group border border-slate-100 min-h-[300px]">
                              {/* Mock Map Image */}
                              <img src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800&h=600" className="w-full h-full object-cover grayscale opacity-50 transition-all group-hover:grayscale-0 group-hover:opacity-100" />
                              <div className="absolute inset-0 bg-blue-500/5" />
                              
                              {/* Pins */}
                              <div className="absolute top-1/3 left-1/4 w-4 h-4 bg-emerald-500 rounded-full border-4 border-white shadow-lg animate-bounce" />
                              <div className="absolute bottom-1/4 right-1/3 w-4 h-4 bg-[#1D4ED8] rounded-full border-4 border-white shadow-lg" />
                              
                              {/* Floating Info */}
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-100 flex items-center gap-2">
                                 <Truck className="text-[#FF5C00]" size={16} />
                                 <span className="text-[12px] font-bold text-[#0A1140]">Arriving in 2 Days</span>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Order Items Section */}
                     <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-50">
                        <div className="flex justify-between items-center mb-8">
                           <h2 className="text-xl font-extrabold text-[#0A1140] tracking-tight">Order Items</h2>
                           <span className="bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider">3 Items - Total: N80,000</span>
                        </div>
                        
                        <div className="space-y-4">
                           {orderItems.map((item, idx) => (
                              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white rounded-xl border border-slate-100 hover:border-blue-100 transition-all gap-6">
                                 <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm shrink-0 border border-slate-50">
                                       <img src={item.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="min-w-0">
                                       <h4 className="text-[14px] font-bold text-[#0A1140] leading-tight mb-1">{item.name}</h4>
                                       <p className="text-[11px] font-medium text-slate-500 truncate">{item.category}</p>
                                       <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Product ID: {item.id}</p>
                                    </div>
                                 </div>
                                 
                                 <div className="flex items-center justify-between w-full sm:w-auto gap-8 sm:gap-12 text-center ml-20 sm:ml-0">
                                    <div className="space-y-1">
                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Unit Price</span>
                                       <p className="text-[14px] font-black text-[#0A1140]">{item.price}</p>
                                    </div>
                                    <div className="space-y-1">
                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Qty</span>
                                       <p className="text-[14px] font-black text-[#0A1140]">{item.qty}</p>
                                    </div>
                                    <div className="space-y-1">
                                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Total</span>
                                       <p className="text-[14px] font-black text-[#0A1140]">{item.total}</p>
                                    </div>
                                 </div>

                                 <div className="w-full sm:w-auto mt-4 sm:mt-0 flex justify-end">
                                    <button className="flex items-center justify-center gap-1.5 px-4 h-10 bg-white border border-[#1D4ED8] text-[#1D4ED8] rounded-xl text-[11px] font-bold shadow-sm hover:bg-blue-50 transition-colors">
                                       <RotateCcw size={14} /> Reorder
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center bg-slate-50/50 p-4 rounded-xl px-6">
                           <span className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Total Amount</span>
                           <span className="text-xl font-black text-[#0A1140]">N80,000</span>
                        </div>
                     </div>

                  </div>

                  {/* RIGHT SIDEBAR (Quick Actions/Widgets) */}
                  <div className="space-y-6">
                     
                     {/* Payment Status Card */}
                     <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-50">
                        <div className="flex justify-between items-center mb-6">
                           <h4 className="text-[12px] font-bold uppercase tracking-widest text-[#0A1140]">Payment Status</h4>
                           <span className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">Paid</span>
                        </div>
                        <div className="space-y-6">
                           <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Payment Method</p>
                              <p className="text-[13px] font-bold text-[#0A1140]">Wallet & Pay Later</p>
                           </div>
                           <div>
                              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Wallet Balance</p>
                              <div className="flex items-center justify-between gap-3">
                                 <p className="text-[18px] font-black text-[#0A1140] truncate">N380,000.00</p>
                                 <button className="h-8 px-3 bg-[#1D4ED8] text-white rounded-lg text-[10px] font-bold shadow-sm transition-all hover:bg-blue-800 shrink-0">+ Fund</button>
                              </div>
                           </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
                           <BreakdownItem label="Subtotal" value="N107,900" />
                           <BreakdownItem label="Delivery Fee" value="N6,300" />
                           <BreakdownItem label="Wallet Usage" value="-N96,300" negative />
                        </div>

                        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
                           <span className="text-[12px] font-bold text-slate-500 uppercase">Total Paid</span>
                           <span className="text-xl font-black text-[#0A1140]">N17,900</span>
                        </div>
                     </div>

                     {/* Main Actions */}
                     <button className="w-full flex items-center justify-center gap-2 h-14 bg-[#0A1140] text-white rounded-xl text-[12px] font-bold shadow-md hover:bg-[#060a26] transition-colors focus:ring-4 focus:ring-slate-900/20">
                        <Truck size={18} /> Track Order Complete
                     </button>

                     {/* Secondary Actions */}
                     <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-50 space-y-3">
                        <h4 className="text-[13px] font-bold text-[#0A1140] mb-4">Actions</h4>
                        
                        <button className="w-full flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-100 hover:bg-blue-50/50 transition-colors group">
                           <div className="flex items-center gap-3">
                              <Download size={16} className="text-slate-400 group-hover:text-[#1D4ED8]" />
                              <span className="text-[12px] font-bold text-slate-600">Download Invoice</span>
                           </div>
                           <ChevronRight size={14} className="text-slate-300" />
                        </button>

                        <button className="w-full flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-100 hover:bg-blue-50/50 transition-colors group">
                           <div className="flex items-center gap-3">
                              <MessageSquare size={16} className="text-slate-400 group-hover:text-[#1D4ED8]" />
                              <span className="text-[12px] font-bold text-slate-600">Request Support</span>
                           </div>
                           <ChevronRight size={14} className="text-slate-300" />
                        </button>
                        
                        <button className="w-full flex items-center justify-center gap-2 h-12 bg-[#FF5C00] text-white rounded-xl text-[12px] font-bold shadow-sm mt-4 hover:bg-[#e65300] transition-colors">
                           <RotateCcw size={16} /> Reorder All Items
                        </button>
                     </div>

                     {/* Order Notes */}
                     <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-50">
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">Order Notes</h4>
                        <div className="text-[13px] font-medium text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                           Please inform me 1 hour before delivery so we can arrange for someone to receive the materials at site. All items must be unloaded and counted before the driver leaves.
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-4">Tue, Feb 26, 2024, 10:35AM</p>
                     </div>

                  </div>

               </div>
            </div>
         </main>
      </div>

    </div>
  );
}

// --- Internal Helper Components ---

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

function StepperStep({ label, date, active = false, completed = false }: any) {
   return (
      <div className="relative flex flex-col items-center flex-1 z-1">
         <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 transition-all duration-300 bg-white ${
            completed ? "border-emerald-500 text-emerald-500 z-10" :
            active ? "border-[#1D4ED8] text-[#1D4ED8]" : 
            "border-slate-100 text-slate-200"
         }`}>
            {completed ? <Check size={14} strokeWidth={4} /> : active ? <div className="w-2.5 h-2.5 rounded-full bg-[#1D4ED8]" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
         </div>
         <p className={`mt-4 text-[11px] font-bold uppercase tracking-wider ${active || completed ? 'text-[#0A1140]' : 'text-slate-400'}`}>{label}</p>
         <p className="mt-1 text-[10px] font-medium text-slate-500">{date || "\u00A0"}</p>
      </div>
   );
}

function BreakdownItem({ label, value, negative = false }: any) {
   return (
      <div className="flex justify-between items-center text-[11px] font-bold uppercase tracking-wider">
         <span className="text-slate-500">{label}</span>
         <span className={negative ? "text-emerald-500" : "text-[#0A1140]"}>{value}</span>
      </div>
   );
}
