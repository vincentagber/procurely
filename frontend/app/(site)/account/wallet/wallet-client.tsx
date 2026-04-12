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
  Menu,
  ChevronDown,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Gift,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Building,
  FileDown,
  Filter,
  CheckSquare
} from "lucide-react";

import { useAuth } from "@/components/auth/auth-provider";
import { api } from "@/lib/api";

export default function WalletClient() {
  const { user } = useAuth();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return <div className="bg-[#F8F9FA] min-h-screen animate-pulse" />;
  }

  // Helper Table Tabs
  const tableTabs = ["All", "Funded", "Withdrawn", "Payments", "Bonus", "Fees"];

   const handleFundWallet = async () => {
     const amountStr = window.prompt("Enter amount to fund (NGN):", "5000");
     if (!amountStr) return;
     
     const amount = parseFloat(amountStr);
     if (isNaN(amount) || amount <= 0) {
       alert("Please enter a valid amount.");
       return;
     }

     try {
       // Convert to kobo/cents for backend
       const res = await api.fundWallet({ amount: Math.round(amount * 100) });
       if (res.authorization_url) {
         window.location.href = res.authorization_url;
       }
     } catch (err: any) {
       alert(err.message || "Failed to initialize funding.");
     }
   };

   return (
     <div className="max-w-[1440px] mx-auto min-w-0">
               
               {/* Unified Breadcrumb Strip */}
               <div className="mb-6 flex items-center gap-2 text-[12px] font-bold tracking-wide flex-wrap">
                  <span className="text-slate-400">Home</span> 
                  <span className="text-slate-300">/</span> 
                   <span className="text-slate-400">Account</span> 
                  <span className="text-slate-300">/</span> 
                  <span className="text-[#1D4ED8]">Wallet & Payments</span>
               </div>

               {/* Grid Layout Container */}
               <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">

                  {/* LEFT COLUMN */}
                  <div className="space-y-6 min-w-0">
                     
                     {/* Wallet Top Container Box */}
                     <div className="bg-white rounded-2xl shadow-sm p-6 lg:p-8 border border-slate-100">
                        {/* Balance Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                           <div>
                              <p className="text-[12px] font-bold text-slate-500 mb-1">Wallet Balance</p>
                              <h1 className="text-4xl font-extrabold text-[#0A1140] tracking-tight">₦{(user?.walletBalance ?? 0).toLocaleString()}.00</h1>
                              <div className="flex items-center gap-3 mt-3 text-[12px] font-medium text-slate-500">
                                 <span>Available Balance</span>
                                 <span className="w-1 h-1 bg-slate-300 rounded-full shrink-0" />
                                 <span className="flex items-center gap-1.5"><Clock size={14} className="text-blue-500" /> Last updated: <span className="text-blue-600 font-bold">Just now</span></span>
                              </div>
                           </div>
                           <div className="flex flex-row gap-4 shrink-0">
                              <button 
                                onClick={handleFundWallet}
                                className="h-12 px-6 bg-[#0A1140] hover:bg-[#13184f] text-white rounded-xl text-[13px] font-bold shadow-md transition-colors whitespace-nowrap"
                              >
                                 Fund Wallet
                              </button>
                              <button className="h-12 px-6 bg-white border-2 border-orange-100 text-[#FF5C00] hover:bg-orange-50 rounded-xl text-[13px] font-bold transition-colors whitespace-nowrap">
                                 Withdraw Funds
                              </button>
                           </div>
                        </div>

                        {/* Recent Stats Row */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-100 mb-8">
                           {/* Stat 1 */}
                           <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                    <ArrowUpRight size={16} className="text-[#FF5C00]" />
                                 </div>
                                 <span className="text-[13px] font-bold text-slate-600 whitespace-nowrap">Recent Funding</span>
                              </div>
                              <h3 className="text-2xl font-black text-[#0A1140]">+₦50,000</h3>
                              <div className="flex items-center gap-2 mt-2 text-[11px] font-bold text-slate-400">
                                 <Clock size={12} /> February 26, 2026
                              </div>
                           </div>
                           {/* Stat 2 */}
                           <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                    <CreditCard size={16} className="text-[#FF5C00]" />
                                 </div>
                                 <span className="text-[13px] font-bold text-slate-600 whitespace-nowrap">Payment Made</span>
                              </div>
                              <h3 className="text-2xl font-black text-[#0A1140]">₦35,000</h3>
                              <div className="flex items-center gap-2 mt-2 text-[11px] font-bold text-slate-400">
                                 <Clock size={12} /> February 20, 2026
                              </div>
                           </div>
                           {/* Stat 3 */}
                           <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
                              <div className="flex items-center gap-3 mb-4">
                                 <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center shrink-0">
                                    <Gift size={16} className="text-[#FF5C00]" />
                                 </div>
                                 <span className="text-[13px] font-bold text-slate-600 whitespace-nowrap">Bonus Credit</span>
                              </div>
                              <h3 className="text-2xl font-black text-[#0A1140]">₦5,000</h3>
                              <div className="flex items-center gap-2 mt-2 text-[11px] font-bold text-slate-400">
                                 <Clock size={12} /> February 2, 2026
                              </div>
                           </div>
                        </div>

                        {/* Blue Info Banner */}
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-4 text-[#1D4ED8]">
                           <div className="w-10 h-10 bg-[#1D4ED8] rounded-xl flex items-center justify-center shrink-0">
                              <Wallet size={20} className="text-white" />
                           </div>
                           <p className="text-[13px] font-bold leading-relaxed min-w-0">
                              Your wallet balance can be used to pay for orders or withdrawn to your bank account
                              <a href="#" className="underline ml-2 hover:text-blue-900 whitespace-nowrap">Learn more</a>
                           </p>
                        </div>
                     </div>

                     {/* Transaction Table Card */}
                     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-w-0">
                        {/* Table Search & Controls */}
                        <div className="p-6 border-b border-slate-100 flex flex-col xl:flex-row items-center gap-4 justify-between">
                           <div className="relative w-full xl:max-w-sm">
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

                        {/* Table Tabs & Inner Controls */}
                        <div className="px-6 py-4 border-b border-slate-100 flex flex-col xl:flex-row items-center justify-between gap-4">
                           <div className="flex items-center bg-slate-50/50 p-1 rounded-xl w-full xl:w-auto overflow-x-auto scrollbar-hide border border-slate-100">
                              {tableTabs.map((tab, idx) => (
                                 <button key={tab} className={`px-5 py-2 rounded-lg text-[12px] font-bold shrink-0 transition-colors ${
                                    idx === 0 ? "bg-blue-100 text-[#1D4ED8]" : "text-slate-500 hover:text-slate-800"
                                 }`}>
                                    {tab}
                                 </button>
                              ))}
                           </div>
                           <div className="flex items-center gap-3 w-full xl:w-auto justify-start xl:justify-end">
                              <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[12px] font-bold text-slate-600 shadow-sm hover:bg-slate-50 shrink-0">
                                 <FileDown size={16} className="text-slate-400" /> Export CSV <ChevronDown size={14} className="text-slate-400" />
                              </button>
                              <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl flex items-center gap-2 text-[12px] font-bold text-slate-600 shadow-sm hover:bg-slate-50 shrink-0">
                                 <Filter size={16} className="text-slate-400" /> Filter <ChevronDown size={14} className="text-slate-400" />
                              </button>
                           </div>
                        </div>

                        {/* Transactions List */}
                        <div className="overflow-x-auto w-full pb-6">
                           <table className="w-full text-left min-w-[700px]">
                              <tbody className="divide-y divide-slate-100">
                                 
                                 {/* Row 1: Funded */}
                                 <tr className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                                             <ArrowDownLeft size={20} className="text-emerald-500" />
                                          </div>
                                          <div>
                                             <p className="text-[13px] font-bold text-[#0A1140]">Funded</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <span className="text-[14px] font-bold text-[#0A1140]">₦50,000</span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <p className="text-[13px] font-bold text-slate-600">₦330,000</p>
                                       <p className="text-[11px] font-medium text-slate-400 mt-1">Today 11:30 AM</p>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                       <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-[11px] border border-emerald-100 gap-1.5">
                                          <CheckCircle2 size={12} /> Completed
                                       </span>
                                    </td>
                                 </tr>

                                 {/* Row 2: Withdrawn */}
                                 <tr className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-100 shrink-0">
                                             <ArrowUpRight size={20} className="text-amber-500" />
                                          </div>
                                          <div>
                                             <p className="text-[13px] font-bold text-[#0A1140]">Withdrawn</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <span className="text-[14px] font-bold text-[#0A1140]">₦20,000</span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <p className="text-[13px] font-bold text-slate-600">₦330,000</p>
                                       <p className="text-[11px] font-medium text-slate-400 mt-1">Yesterday 4:45 PM</p>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                       <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-amber-50 text-amber-600 font-bold text-[11px] border border-amber-100 gap-1.5">
                                          <AlertCircle size={12} /> Processed
                                       </span>
                                    </td>
                                 </tr>

                                 {/* Row 3: Payment Used */}
                                 <tr className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 shrink-0">
                                             <CreditCard size={20} className="text-blue-500" />
                                          </div>
                                          <div>
                                             <p className="text-[13px] font-bold text-[#0A1140]">Payment Used</p>
                                             <p className="text-[11px] font-medium text-slate-400 mt-0.5">Order #PRO102456</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <span className="text-[14px] font-bold text-[#0A1140]">-₦35,000</span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <p className="text-[13px] font-bold text-slate-600">₦330,000</p>
                                       <p className="text-[11px] font-medium text-slate-400 mt-1">Feb 14, 2024 9:10 AM</p>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                       <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-bold text-[11px] border border-blue-100 gap-1.5">
                                          <CheckCircle2 size={12} /> Paid
                                       </span>
                                    </td>
                                 </tr>

                                 {/* Row 4: Bonus Credit */}
                                 <tr className="hover:bg-slate-50/50 transition-colors group">
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <div className="flex items-center gap-4">
                                          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
                                             <Gift size={20} className="text-emerald-500" />
                                          </div>
                                          <div>
                                             <p className="text-[13px] font-bold text-[#0A1140]">Bonus</p>
                                             <p className="text-[11px] font-medium text-slate-400 mt-0.5">Warehouse Promotion, in-store</p>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <span className="text-[14px] font-bold text-[#0A1140]">-₦5,000</span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                       <p className="text-[13px] font-bold text-slate-600">₦335,000</p>
                                       <p className="text-[11px] font-medium text-slate-400 mt-1">Feb 02, 2026 4:45 PM</p>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap text-right">
                                       <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 font-bold text-[11px] border border-emerald-100 gap-1.5">
                                          <CheckCircle2 size={12} /> Completed
                                       </span>
                                    </td>
                                 </tr>

                              </tbody>
                           </table>
                        </div>

                        {/* Card Footer Link */}
                        <div className="p-4 border-t border-slate-100 flex justify-end">
                           <a href="#" className="text-[12px] font-bold text-[#FF5C00] hover:underline px-4">
                              View full History
                           </a>
                        </div>
                     </div>
                  </div>

                  {/* RIGHT COLUMN (300px) */}
                  <div className="space-y-6">
                     
                     {/* Manage Payment Card */}
                     <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
                        <h3 className="text-[14px] font-bold text-[#0A1140] mb-2">Manage Payment Methods</h3>
                        <p className="text-[12px] font-medium text-slate-500 mb-6">Add or remove cards or bank accounts</p>
                        <button className="w-full h-11 bg-[#1D4ED8] hover:bg-blue-800 text-white font-bold text-[12px] rounded-xl shadow-lg shadow-blue-500/20 transition-all">
                           Manage Payment Methods
                        </button>
                     </div>

                     {/* Payment Reports Card */}
                     <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-[14px] font-bold text-[#0A1140] mb-5">Payment Reports</h3>
                        <div className="space-y-4">
                           {/* Report Item 1 */}
                           <div className="flex items-center gap-4 bg-slate-50 border border-slate-100 p-3 rounded-xl cursor-not-allowed">
                               <div className="w-8 h-8 rounded bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                                 <FileText size={16} />
                               </div>
                               <div className="min-w-0 flex-1">
                                  <p className="text-[12px] font-bold text-[#0A1140] truncate">Wallet Statements</p>
                                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">₦335,000,000</p>
                               </div>
                           </div>
                           {/* Report Item 2 */}
                           <div className="flex items-center gap-4 border border-slate-100 p-3 rounded-xl hover:border-blue-200 transition-colors cursor-pointer group">
                               <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center text-blue-500 shrink-0">
                                 <CreditCard size={16} />
                               </div>
                               <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between">
                                     <p className="text-[12px] font-bold text-[#0A1140] truncate">Payment Used</p>
                                     <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md uppercase">Default</span>
                                  </div>
                                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">Master card</p>
                               </div>
                           </div>
                           {/* Report Item 3 */}
                           <div className="flex items-center justify-between gap-4 border border-slate-100 p-3 rounded-xl hover:border-blue-200 transition-colors cursor-pointer">
                               <div className="flex items-center gap-4 min-w-0">
                                  <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0">
                                    <Building size={16} />
                                  </div>
                                  <div className="min-w-0">
                                     <p className="text-[12px] font-bold text-[#0A1140] truncate">Gibson Holdings</p>
                                     <p className="text-[11px] font-medium text-slate-500 mt-0.5">-20%...</p>
                                  </div>
                               </div>
                               <CheckSquare size={16} className="text-blue-500 shrink-0" />
                           </div>
                        </div>
                     </div>

                     {/* Quick Actions Card */}
                     <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col">
                        <h3 className="text-[14px] font-bold text-[#0A1140] mb-5">Quick Actions</h3>
                        <div className="space-y-3">
                           <button className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors">
                              <FileText size={16} className="text-slate-600" />
                              <span className="text-[12px] font-bold text-slate-700">Wallet Statements</span>
                           </button>
                           <button className="w-full flex items-center gap-3 p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors">
                              <FileText size={16} className="text-slate-600" />
                              <span className="text-[12px] font-bold text-slate-700">Invoice History</span>
                           </button>
                        </div>
                        <div className="mt-6 flex justify-center border-t border-slate-100 pt-5">
                           <a href="#" className="text-[12px] font-bold text-[#FF5C00] hover:underline">View all Reports</a>
                        </div>
                     </div>

                  </div>

               </div>
            </div>
    );
}
