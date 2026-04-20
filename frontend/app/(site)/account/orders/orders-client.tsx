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
   Info,
   Clock
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";

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
   const [orders, setOrders] = useState<any[]>([]);
   const [loading, setLoading] = useState(true);
   const searchParams = useSearchParams();
   const isHistory = searchParams.get("view") === "history";

   useEffect(() => {
      setHasMounted(true);
      fetchOrders();
   }, []);

   const fetchOrders = async () => {
      setLoading(true);
      try {
         const data = await api.getAccountOrders();
         setOrders(data);
      } catch (err) {
         console.error("Failed to fetch secure orders:", err);
      } finally {
         setLoading(false);
      }
   };

   if (!hasMounted) {
      return <div className="bg-[#F8F9FA] min-h-screen animate-pulse" />;
   }

   return (
      <div className="max-w-[1440px] mx-auto min-w-0">

         {/* 📁 Breadcrumbs Strip */}
         <div className="mb-6 flex items-center gap-2 text-[12px] font-bold tracking-wide flex-wrap">
            <span className="text-slate-400">Home</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-400">Account</span>
            <span className="text-slate-300">/</span>
            <span className="text-[#1D4ED8]">{isHistory ? 'Order History' : 'Orders'}</span>
         </div>

               {/* Three-Column Content Layout */}
               <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">

                  {/* LEFT/CENTER SIDE: Header + Stats + Table */}
                  <section className="space-y-6 min-w-0">
                     <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0A1140] tracking-tight mb-2">
                        {isHistory ? 'Order History' : 'Active Orders'}
                     </h1>

                     {/* Order Summary Box */}
                     <div 
                        className="bg-white shadow-sm border border-slate-100 flex flex-col"
                        style={{ 
                          maxWidth: '669px', 
                          minHeight: '225.57px', 
                          borderRadius: '8.84px', 
                          padding: '17.68px',
                          gap: '8.84px'
                        }}
                     >
                        <div className="flex items-center justify-between mb-2">
                           <h3 className="text-[14px] font-bold text-[#0A1140]">Order Summary</h3>
                        </div>
                        <div className="border-t border-slate-100 mb-3 -mx-[17.68px]"></div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[11px] mb-2">
                           <SummaryStat icon={<ShoppingBag size={18} />} color="text-[#FF5C00]" value="256" label="Total Orders" sub="orders" />
                           <SummaryStat icon={<FileText size={18} />} color="text-[#FF5C00]" value="24" label="Active Orders" sub="ongoing" />
                           <SummaryStat icon={<CheckCircle2 size={18} />} color="text-[#FF5C00]" value="187" label="Completed Orders" sub="delivered" />
                           <SummaryStat icon={<XCircle size={18} />} color="text-[#FF5C00]" value="24" label="Canceled Orders" sub="Not completed" />
                        </div>

                        {/* Wallet Banner Inside - Optimized Compact Theme */}
                        <div 
                           className="bg-[#F0F2FF] rounded-[8.84px] flex items-center gap-[10px] shadow-sm mt-auto mx-auto"
                           style={{ 
                             width: '633.64px',
                             height: '44px', 
                             padding: '0 16px',
                             border: '1px solid #E0E4FF'
                           }}
                        >
                           <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0 shadow-sm">
                              <Wallet size={16} className="text-white" />
                           </div>
                           <p className="text-[12px] font-bold text-[#0A1140] leading-none flex items-center gap-2">
                              Your wallet balance can be used to pay for orders...
                              <Link href="/account/wallet" className="font-black text-[#0001FF] hover:underline whitespace-nowrap">Learn more</Link>
                           </p>
                        </div>
                     </div>

                     {/* Main Data Table Wrap */}
                     <div className="bg-white shadow-sm overflow-hidden flex flex-col mt-2" style={{ borderRadius: '8.84px', border: '1px solid #F1F5F9' }}>

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
                                 {loading ? (
                                    <tr><td colSpan={6} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest animate-pulse">Synchronizing cloud ledger...</td></tr>
                                 ) : orders.length > 0 ? (
                                    orders.map((order, i) => (
                                       <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                          <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="font-bold text-[#0A1140] text-[14px]">{order.order_number || order.id}</div>
                                             <div className="text-slate-400 text-[11px] font-medium mt-0.5">{order.uuid?.slice(0, 8) || "A85164"}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="font-bold text-[#0A1140] text-[14px]">{order.shipping_name || "Enterprise Partner"}</div>
                                             <div className="text-slate-400 text-[11px] font-medium mt-0.5">{order.items?.length || 0} Items supplied</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="font-bold text-[#0A1140] text-[14px]">N{(order.total / 100).toLocaleString()}</div>
                                             <div className="text-slate-400 text-[11px] font-medium line-through mt-0.5">N{((order.total * 1.1) / 100).toLocaleString()}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="font-bold text-[#0A1140] text-[14px]">{new Date(order.created_at).toLocaleDateString()}</div>
                                             <div className="text-slate-400 text-[11px] font-medium mt-0.5">{new Date(order.updated_at).toLocaleTimeString()}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                             <StatusBadge 
                                                status={order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
                                                type={order.status === 'paid' ? 'emerald' : order.status === 'pending' ? 'orange' : 'rose'} 
                                             />
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap">
                                             <div className="flex items-center justify-center">
                                                <Link
                                                   href={`/account/orders/${order.order_number || 'PRC-01234'}`}
                                                   className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-[#1D4ED8] hover:text-white transition-colors"
                                                >
                                                   <Eye size={16} />
                                                </Link>
                                             </div>
                                          </td>
                                       </tr>
                                    ))
                                 ) : (
                                    <tr><td colSpan={6} className="py-20 text-center text-slate-400 font-bold tracking-widest">No procurement records found.</td></tr>
                                 )}
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
      );
}

// --- Specific Components ---

function SummaryStat({ icon, color, value, label, sub }: any) {
   return (
      <div 
         className={`flex flex-col border border-slate-50 transition-all hover:shadow-sm`}
         style={{
            width: '150.66px',
            height: '72.71px',
            borderRadius: '5.58px',
            padding: '9.3px',
            gap: '9.3px',
            background: '#E6E6FF80'
         }}
      >
         <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 bg-white shadow-sm ${color}`}>
               <div className="relative">
                  <div className="scale-75 flex items-center justify-center">{icon}</div>
                  <Clock size={6} className="absolute -bottom-0.5 -right-0.5 text-orange-500 bg-white rounded-full" />
               </div>
            </div>
            <div className="text-[10px] font-bold text-slate-500 tracking-tight leading-none whitespace-nowrap truncate">{label}</div>
         </div>
         <div className="flex items-baseline gap-1.5 mt-auto">
            <span 
               className="font-black text-[#0A1140] leading-none shrink-0"
               style={{ 
                 fontSize: '23.25px', 
                 fontFamily: "'Circular Std', 'Inter', system-ui, sans-serif" 
               }}
            >
               {value}
            </span>
            <span className="text-[9px] font-bold text-slate-400 tracking-tight lowercase truncate">{sub}</span>
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
