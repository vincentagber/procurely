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
   Plus,
   ChevronRight,
   ShoppingBag,
   Calendar,
   Filter,
   Eye,
   CreditCard,
   FileText,
   FileDown,
   ChevronDown,
   Menu,
   CheckCircle2,
   XCircle,
   Truck,
   ArrowRightLeft,
   ChevronLeft,
   Info
} from "lucide-react";
import Link from "next/link";

const historyData = [
   { id: "PRO102563", subId: "A85164", supplier: "Traxus Industrial", subSup: "8 Items supplied", amount: "N80,000", subAmount: "N80,000", date: "Mar 1, 2024", subDate: "Mar 10, 2026", status: "Processing", statusColor: "orange" },
   { id: "PRO102567", subId: "A85164", supplier: "Gibson Holdings", subSup: "5 Items supplied", amount: "N45,000", subAmount: "N45,000", date: "Mar 1, 2024", subDate: "Mar 5, 2024", status: "In Progress", statusColor: "blue" },
   { id: "PRO102541", subId: "A85164", supplier: "Halcyon Supplies", subSup: "10 Items supplied", amount: "N85,000", subAmount: "N120,000", date: "Mar 1, 2024", subDate: "Feb 23, 2026", status: "Delivered", statusColor: "emerald" },
   { id: "PRO102532", subId: "A85164", supplier: "Primelogic Systems", subSup: "12 Items supplied", amount: "N85,000", subAmount: "N80,000", date: "Mar 1, 2024", subDate: "Mar 2, 2026", status: "Canceled", statusColor: "rose" },
   { id: "PRO102532", subId: "A85164", supplier: "Caltex Resources", subSup: "2 Items supplied", amount: "N85,000", subAmount: "N80,000", date: "Mar 1, 2024", subDate: "Mar 2, 2026", status: "Canceled", statusColor: "rose" },
   { id: "PRO102532", subId: "A85164", supplier: "Genocom Tech", subSup: "3 Items supplied", amount: "N85,000", subAmount: "N80,000", date: "Mar 1, 2024", subDate: "Feb 23, 2026", status: "Delivered", statusColor: "emerald" },
   { id: "PRO102532", subId: "A85164", supplier: "Innotech Enterprises", subSup: "10 Items supplied", amount: "N85,000", subAmount: "N80,000", date: "Mar 1, 2024", subDate: "Mar 2, 2026", status: "Canceled", statusColor: "rose" },
];

export default function OrderHistoryClient() {
   const [hasMounted, setHasMounted] = useState(false);

   useEffect(() => {
      setHasMounted(true);
   }, []);

   if (!hasMounted) {
      return <div className="bg-[#F8F9FA] min-h-screen animate-pulse" />;
   }

   return (
      <div className="flex min-h-screen bg-[#F8F9FA] text-slate-800 font-sans">

         {/* 📁 LEFT SIDEBAR - Fixed width, no shrinking */}
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
                  <SidebarItem icon={<History size={18} />} label="Order History" active />
                  <SidebarItem icon={<Bookmark size={18} />} label="Saved Materials" />

                  <div className="h-4 border-b border-white/10 mx-4 mb-4" />
                  <SidebarItem icon={<Settings size={18} />} label="Account Settings" />
                  <SidebarItem icon={<LogOut size={18} />} label="Logout" />
               </nav>
            </div>
         </aside>

         {/* 📊 MAIN SECTION - Growable area */}
         <main className="flex-1 p-4 lg:p-8 min-w-0">
            <div className="max-w-[1440px] mx-auto">

               {/* Breadcrumbs */}
               <div className="mb-6 flex items-center gap-2 text-[12px] font-bold tracking-wide">
                  <span className="text-slate-400">Home</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-slate-400">pages</span>
                  <span className="text-slate-300">/</span>
                  <span className="text-[#0A1140] font-black">Order History</span>
               </div>

               {/* Three-Column Content Layout */}
               <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">

                  {/* LEFT/CENTER SIDE: Header + Stats + Table */}
                  <section className="space-y-6 min-w-0">
                     <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0A1140] tracking-tight mb-2">Order History</h1>

                     {/* Order Summary Box */}
                     <div className="bg-white rounded-[1rem] shadow-sm py-5">
                        <h3 className="px-6 text-[13px] font-bold text-slate-500 mb-4">Order Summary</h3>
                        <div className="border-t border-slate-100 mb-2"></div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-6 pt-2">
                           <SummaryStat icon={<ShoppingBag size={18} />} color="text-orange-500" bg="bg-orange-50" value="256" label="Total Orders" sub="orders" />
                           <SummaryStat icon={<Truck size={18} />} color="text-emerald-500" bg="bg-emerald-50" value="24" label="Active Orders" sub="ongoing" />
                           <SummaryStat icon={<CheckCircle2 size={18} />} color="text-rose-500" bg="bg-rose-50" value="187" label="Completed Orders" sub="delivered" />
                           <SummaryStat icon={<XCircle size={18} />} color="text-blue-500" bg="bg-blue-50" value="24" label="Canceled Orders" sub="Not completed" />
                        </div>
                     </div>

                     {/* Wallet Banner */}
                     <div className="bg-[#1D4ED8] rounded-[1rem] p-4 flex items-start sm:items-center gap-4 text-white shadow-md">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                           <Wallet size={20} className="text-white" />
                        </div>
                        <p className="text-[13px] font-medium leading-relaxed tracking-wide min-w-0">
                           Your wallet balance can be used to pay for orders or withdrawn to your bank account seamlessly.
                           <a href="#" className="font-bold underline ml-1 hover:text-white/80 whitespace-nowrap">Learn more</a>
                        </p>
                     </div>

                     {/* Main Data Table Wrap */}
                     <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col mt-2">

                        {/* Controls Row */}
                        <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row items-center gap-4 justify-between">
                           <div className="relative w-full xl:max-w-xs">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                              <input type="text" placeholder="Search Transaction" className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-[13px] font-medium text-slate-800 focus:outline-none focus:border-[#1D4ED8]" />
                           </div>
                           <div className="flex items-center gap-3 w-full xl:w-auto">
                              <div className="h-11 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-3 text-[12px] font-bold text-slate-600 shadow-sm whitespace-nowrap">
                                 Feb 01, 2026 - Mar 01 <Plus size={14} className="text-slate-400" />
                              </div>
                              <button className="h-11 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[12px] font-bold text-slate-600 shadow-sm hover:bg-slate-50 shrink-0">
                                 <FileDown size={16} className="text-slate-400" /> Export <ChevronDown size={14} className="text-slate-400" />
                              </button>
                           </div>
                        </div>

                        {/* Tabs Row */}
                        <div className="px-6 py-4 border-b border-slate-100 flex flex-col xl:flex-row items-center justify-between gap-4">
                           <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full xl:w-auto overflow-x-auto scrollbar-hide">
                              <button className="px-5 py-2 bg-blue-100 text-[#1D4ED8] rounded-lg text-[12px] font-bold shrink-0">All</button>
                              <button className="px-5 py-2 text-slate-500 hover:text-slate-800 rounded-lg text-[12px] font-bold transition-colors shrink-0">Active</button>
                              <button className="px-5 py-2 text-slate-500 hover:text-slate-800 rounded-lg text-[12px] font-bold transition-colors shrink-0">Completed</button>
                              <button className="px-5 py-2 text-slate-500 hover:text-slate-800 rounded-lg text-[12px] font-bold transition-colors shrink-0">Canceled</button>
                              <button className="px-5 py-2 text-slate-800 font-bold rounded-lg text-[12px] flex items-center gap-1 shrink-0">More <ChevronDown size={14} /></button>
                           </div>
                           <div className="flex items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
                              <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[12px] font-bold text-slate-600 shadow-sm hover:bg-slate-50 shrink-0">
                                 <FileDown size={16} className="text-slate-400" /> Export CSV <ChevronDown size={14} className="text-slate-400" />
                              </button>
                              <button className="h-10 w-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 shadow-sm hover:bg-slate-50 shrink-0">
                                 <Filter size={16} />
                              </button>
                           </div>
                        </div>

                        {/* Table Content with horizontal scroll & min-width */}
                        <div className="overflow-x-auto w-full">
                           <table className="w-full text-left min-w-[900px]">
                              <thead>
                                 <tr className="border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50/50 whitespace-nowrap">
                                    <th className="px-6 py-5 font-bold">Order ID</th>
                                    <th className="px-6 py-5 font-bold">Supplier</th>
                                    <th className="px-6 py-5 font-bold">Total Amount</th>
                                    <th className="px-6 py-5 font-bold">Date Placed</th>
                                    <th className="px-6 py-5 font-bold">Delivery Status</th>
                                    <th className="px-6 py-5 font-bold text-center">Actions</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                 {historyData.map((order, i) => (
                                    <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                       <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="font-bold text-[#0A1140] text-[14px]">{order.id}</div>
                                          <div className="text-slate-400 text-[11px] font-medium mt-0.5">{order.subId}</div>
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="font-bold text-[#0A1140] text-[14px]">{order.supplier}</div>
                                          <div className="text-slate-400 text-[11px] font-medium mt-0.5">{order.subSup}</div>
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="font-bold text-[#0A1140] text-[14px]">{order.amount}</div>
                                          <div className="text-slate-400 text-[11px] font-medium line-through mt-0.5">{order.subAmount}</div>
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="font-bold text-[#0A1140] text-[14px]">{order.date}</div>
                                          <div className="text-slate-400 text-[11px] font-medium mt-0.5">{order.subDate}</div>
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap">
                                          <StatusBadge status={order.status} type={order.statusColor} />
                                       </td>
                                       <td className="px-6 py-4 whitespace-nowrap">
                                          <div className="flex items-center justify-center">
                                             <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#1D4ED8] hover:text-white transition-colors">
                                                <Eye size={16} />
                                             </button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="p-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
                           <div className="flex items-center gap-4 w-full justify-between sm:justify-start">
                              <div className="flex items-center gap-1">
                                 <button className="p-2 text-slate-400 hover:text-[#0A1140]"><ChevronLeft size={16} /></button>
                                 <button className="p-2 text-slate-400 hover:text-[#0A1140]"><ChevronLeft size={16} className="rotate-180" /></button>
                              </div>
                              <div className="text-[12px] font-bold text-slate-500 whitespace-nowrap">
                                 Page <span className="inline-flex w-8 h-8 mx-1 bg-white border border-slate-200 rounded justify-center items-center text-[#0A1140]">1</span> of 10 <ChevronRight size={14} className="inline ml-1 text-slate-400" /> 25 <ChevronRight size={14} className="inline text-slate-400" />
                              </div>
                           </div>

                           <div className="flex items-center justify-between w-full sm:w-auto">
                              <div className="text-[12px] font-medium text-slate-500 hidden sm:block mr-8 whitespace-nowrap">
                                 Showing 1 to 10 of 233 orders
                              </div>
                              <div className="h-9 px-3 bg-white border border-slate-200 rounded-lg flex items-center gap-2 text-[12px] font-bold text-slate-600 shadow-sm select-none shrink-0 cursor-pointer">
                                 10 <span className="text-slate-400 font-medium hidden sm:inline">items per page</span> <ChevronDown size={14} className="text-slate-400" />
                              </div>
                           </div>
                        </div>

                     </div>
                  </section>

                  {/* RIGHT SIDE: Quick Reports */}
                  <aside className="hidden xl:block space-y-6">

                     {/* Manage Payment Methods */}
                     <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-50">
                        <h4 className="text-[14px] font-black text-[#0A1140] mb-2 tracking-tight">Manage Payment Methods</h4>
                        <p className="text-[12px] font-medium text-slate-400 mb-6 leading-relaxed">Add or remove cards or bank accounts</p>
                        <button className="w-full py-3.5 bg-[#FF5C00] text-white rounded-lg text-[13px] font-bold shadow-md shadow-orange-500/20 hover:bg-[#e65300] transition-colors focus:ring-4 focus:ring-orange-500/30">
                           Manage Payment Methods
                        </button>
                     </div>

                     {/* Quick Reports */}
                     <div className="bg-white rounded-xl shadow-sm border border-slate-50 overflow-hidden text-[#0A1140]">
                        <div className="p-5 border-b border-slate-100">
                           <h4 className="text-[14px] font-black tracking-tight">Quick Reports</h4>
                        </div>
                        <div className="p-5 space-y-3">
                           <div className="flex items-center justify-between p-3 bg-orange-50 border border-orange-100 rounded-xl">
                              <div className="flex items-center gap-2 font-bold text-[12px] text-orange-600">
                                 <FileText size={16} /> Active Orders
                              </div>
                              <span className="font-extrabold text-[13px]">24</span>
                           </div>
                           <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                              <div className="flex items-center gap-2 font-bold text-[12px] text-emerald-600">
                                 <FileText size={16} /> Delivered Orders
                              </div>
                              <span className="font-extrabold text-[13px] text-emerald-800">187</span>
                           </div>
                           <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-100 rounded-xl">
                              <div className="flex items-center gap-2 font-bold text-[12px] text-rose-600">
                                 <FileText size={16} /> Canceled Orders
                              </div>
                              <span className="font-extrabold text-[13px] text-rose-800">24</span>
                           </div>

                           <div className="flex items-center justify-between pt-2">
                              <span className="text-[12px] font-medium text-[#0A1140] flex items-center gap-1.5"><FileDown size={14} /> Export</span>
                              <div className="flex gap-1.5">
                                 <button className="px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 flex items-center gap-1 shadow-sm"><FileDown size={12} /> CSV</button>
                                 <button className="px-2 py-1.5 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-600 bg-white hover:bg-slate-50 flex items-center gap-1 shadow-sm"><FileDown size={12} /> PDF</button>
                              </div>
                           </div>
                        </div>
                        <div className="p-4 pt-0">
                           <button className="w-full py-3.5 bg-[#1D4ED8] text-white rounded-lg text-[13px] font-bold shadow-md shadow-blue-500/20 hover:bg-blue-800 transition-colors">
                              Go Wallet & Payments
                           </button>
                        </div>
                     </div>

                     {/* Reports Section */}
                     <div className="space-y-4">
                        <h4 className="text-[14px] font-black tracking-tight text-[#0A1140] ml-2">Reports</h4>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-50 flex items-center justify-between group hover:border-[#1D4ED8]/20 transition-all cursor-pointer">
                           <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 bg-blue-50 text-[#1D4ED8] rounded-xl flex items-center justify-center shrink-0"><FileDown size={20} /></div>
                              <div className="min-w-0">
                                 <p className="text-[12px] font-bold text-[#0A1140] truncate">Download Order</p>
                                 <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">Report (CSV)</p>
                              </div>
                           </div>
                           <ChevronDown size={16} className="text-[#1D4ED8] -rotate-90 shrink-0" />
                        </div>

                        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-50 flex items-center justify-between group hover:border-[#1D4ED8]/20 transition-all cursor-pointer">
                           <div className="flex items-center gap-3 min-w-0">
                              <div className="w-10 h-10 bg-blue-50 text-[#1D4ED8] rounded-xl flex items-center justify-center shrink-0"><FileText size={20} /></div>
                              <div className="min-w-0">
                                 <p className="text-[12px] font-bold text-[#0A1140] truncate">Download Invoice</p>
                                 <p className="text-[11px] font-medium text-slate-400 mt-0.5 truncate">History (PDF)</p>
                              </div>
                           </div>
                           <ChevronDown size={16} className="text-[#1D4ED8] -rotate-90 shrink-0" />
                        </div>
                     </div>

                  </aside>

               </div>
            </div>
         </main>
      </div>
   );
}

// --- Specific Components ---

function SidebarItem({ icon, label, active = false }: any) {
   return (
      <button className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all focus:outline-none ${active ? "bg-[#1D4ED8] text-white font-bold shadow-md shadow-blue-900/50" : "text-white/60 hover:bg-white/10 hover:text-white font-medium"
         }`}>
         <span className={`shrink-0 ${active ? "text-white" : "text-white/40"}`}>{icon}</span>
         <span className="text-[13px] tracking-wide whitespace-nowrap truncate">{label}</span>
      </button>
   );
}

function SummaryStat({ icon, color, bg, value, label, sub }: any) {
   return (
      <div className="flex items-start gap-4 p-1">
         <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
            {icon}
         </div>
         <div className="flex flex-col">
            <div className="text-[12px] xl:text-[13px] font-bold text-slate-500 tracking-tight leading-snug mb-1">{label}</div>
            <div className="flex items-baseline gap-1.5">
               <span className="text-[20px] lg:text-[24px] font-black text-[#0A1140] leading-none shrink-0">{value}</span>
               <span className="text-[11px] font-medium text-slate-400 tracking-wide hidden sm:block">{sub}</span>
            </div>
         </div>
      </div>
   );
}

function StatusBadge({ status, type }: { status: string; type: string }) {
   const styles: Record<string, string> = {
      orange: "bg-orange-50 text-orange-600 border border-orange-100",
      blue: "bg-blue-50 text-blue-600 border border-blue-100",
      emerald: "bg-emerald-50 text-emerald-600 border border-emerald-100",
      rose: "bg-rose-50 text-rose-600 border border-rose-100"
   };

   const iconColors: Record<string, string> = {
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      emerald: "bg-emerald-500",
      rose: "bg-rose-500"
   };

   return (
      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-bold shadow-sm ${styles[type] || styles.blue} whitespace-nowrap`}>
         <div className={`w-1.5 h-1.5 rounded-full ${iconColors[type] || iconColors.blue} shrink-0`} />
         {status}
      </span>
   );
}
