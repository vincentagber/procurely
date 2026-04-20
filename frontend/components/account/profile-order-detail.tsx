"use client";

import React from "react";
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  CreditCard, 
  FileText, 
  Phone, 
  User, 
  RefreshCw, 
  Download, 
  LifeBuoy,
  ChevronRight,
  ArrowRight,
  Plus
} from "lucide-react";
import Link from "next/link";

/**
 * PROCURELY™ ORDER DETAIL PAGE
 * High-fidelity implementation based on provided design reference.
 */

export default function ProfileOrderDetail() {
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1440px] mx-auto min-w-0">
      
      {/* 🥖 Breadcrumb Section */}
      <div className="bg-white rounded-[10px] border border-slate-100 p-6 flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
         <span>Home</span> 
         <span className="mx-2 text-slate-200">/</span> 
         <span className="text-slate-400">pages</span> 
         <span className="mx-2 text-slate-200">/</span> 
         <span className="text-[#0A1140]">Order #PRC-01234</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_300px] gap-8">
        
        {/* 📦 LEFT COLUMN: MAIN ORDER INFO */}
        <div className="space-y-6 min-w-0">
           
           {/* Order Status Header */}
           <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                 <div className="flex items-center gap-4">
                    <h1 className="text-4xl font-black text-[#0A1140]">#PRC-01234</h1>
                    <span className="bg-orange-50 text-[#FF5C00] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-orange-100">
                      In Transit
                    </span>
                 </div>
                 <div className="flex items-center gap-2 text-slate-500">
                    <Clock size={16} />
                    <span className="text-[13px] font-bold">Expected Delivery: <span className="text-[#0A1140]">Friday, Feb 28, 2026</span> <span className="text-slate-400 font-medium">(2 days from now)</span></span>
                 </div>
              </div>

              {/* Progress Stepper */}
              <div className="relative pt-8 pb-4">
                 {/* Line */}
                 <div className="absolute top-[44px] left-[5%] right-[5%] h-1 bg-slate-100 rounded-full">
                    <div className="absolute top-0 left-0 h-full w-[66%] bg-emerald-500 rounded-full" />
                 </div>
                 
                 <div className="relative flex justify-between">
                    <StepItem label="Confirmed" date="Feb 26, 2026" active completed />
                    <StepItem label="Processing" date="Feb 27, 2026" active completed />
                    <StepItem label="In Transit" date="ETA: Feb 28, 2026" active current />
                    <StepItem label="Delivered" date="-" />
                 </div>
              </div>
           </div>

           {/* Details Row: Order & Delivery */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Order & Supplier Box */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                 <h3 className="text-[16px] font-black text-[#0A1140] mb-6">Order & Supplier Details</h3>
                 <div className="space-y-6">
                    <div>
                       <p className="text-[14px] font-black text-[#13184F] mb-4">#PRC-01234</p>
                       <div className="grid grid-cols-[80px_1fr] gap-y-3 text-[12px]">
                          <span className="font-bold text-slate-400 underline">Supplier:</span>
                          <span className="font-black text-[#0A1140]">Loksand Supplies</span>
                          <span className="font-bold text-slate-400 underline">Contact:</span>
                          <div className="min-w-0">
                             <p className="font-black text-[#0A1140]">Adewale Shola</p>
                             <p className="text-slate-500 font-medium">+234 803 456 7891</p>
                             <p className="text-slate-500 font-medium truncate">info@loksand.ng.com</p>
                          </div>
                          <span className="font-bold text-slate-400 underline mt-2">Order Date:</span>
                          <span className="font-black text-[#0A1140] mt-2">Feb 26, 2024</span>
                       </div>
                    </div>
                    <div className="pt-4 border-t border-slate-50">
                       <p className="text-[12px] font-black text-[#0A1140] uppercase tracking-wider mb-2">Delivery Address</p>
                       <p className="text-[12px] font-black text-[#13184F]">Site A Construction</p>
                       <p className="text-[12px] font-medium text-slate-400 leading-relaxed max-w-[200px]">AH16-R5, Lekki Peninsia II, Lagos Nigeria</p>
                    </div>
                 </div>
              </div>

              {/* Delivery Tracking Map Box */}
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative flex flex-col">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-[16px] font-black text-[#0A1140]">Delivery Tracking</h3>
                    <Link href="#" className="text-[12px] font-black text-[#FF5C00] hover:underline">View Full Tracking</Link>
                 </div>
                 <div className="flex-1 rounded-2xl overflow-hidden border border-slate-100 relative group cursor-pointer">
                    <img 
                      src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=600&h=400" 
                      className="w-full h-full object-cover grayscale opacity-20"
                      alt="Map" 
                    />
                    {/* Animated path overlays (Simulated) */}
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="relative w-[80%] h-[80%] border-2 border-dashed border-blue-200 rounded-full flex items-center justify-center">
                          <div className="w-10 h-10 bg-white rounded-full shadow-lg border border-slate-100 flex items-center justify-center z-10 animate-pulse">
                             <MapPin size={20} className="text-orange-500" />
                          </div>
                          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-4 h-4 bg-blue-600 rounded-full border-2 border-white" />
                          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-4 h-4 bg-orange-600 rounded-full border-2 border-white" />
                       </div>
                    </div>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-[#0A1140] text-white text-[10px] font-black px-4 py-2 rounded-full shadow-xl">
                       Arriving In 2Days
                    </div>
                 </div>
              </div>
           </div>

           {/* Order Items Section */}
           <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                 <h3 className="text-[16px] font-black text-[#0A1140]">Order Items</h3>
                 <span className="text-[12px] font-bold bg-[#F1F5F9] text-slate-500 px-4 py-1.5 rounded-full">
                   3 Items - Total: N80,000
                 </span>
              </div>
              <div className="overflow-x-auto min-w-0">
                 <table className="w-full">
                    <thead>
                       <tr className="bg-slate-50/50 text-[11px] font-black text-slate-400 uppercase tracking-widest text-left">
                          <th className="px-8 py-4">Product</th>
                          <th className="px-4 py-4">Unit Price</th>
                          <th className="px-4 py-4">Quantity</th>
                          <th className="px-4 py-4">Total</th>
                          <th className="px-8 py-4 text-right">Actions</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       <OrderItem 
                          src="https://images.unsplash.com/photo-1518481852452-941c769de22a?auto=format&fit=crop&q=80&w=80&h=80"
                          name="Sharp Sand"
                          details="Procurely Sharp Sand 20 Tons"
                          productId="PRO2334"
                          price="N4,000"
                          qty="20 Tons"
                          total="N80,000"
                       />
                       <OrderItem 
                          src="https://images.unsplash.com/photo-1541888941259-79ad1b8772cc?auto=format&fit=crop&q=80&w=80&h=80"
                          name="Marine Plywood"
                          details="Phoenix Marine Boards"
                          productId="PRO2198"
                          price="N2,200"
                          qty="10 Sheets"
                          total="N22,000"
                       />
                       <OrderItem 
                          src="https://images.unsplash.com/photo-1533062609701-447551cc3771?auto=format&fit=crop&q=80&w=80&h=80"
                          name="Reinforcement Steel (Rebars)"
                          details="10mm Deformed Bars, B500"
                          productId="PRO1108"
                          price="N2,450"
                          qty="2 Bundles"
                          total="4,900"
                       />
                    </tbody>
                 </table>
              </div>
              <div className="p-8 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
                 <span className="text-[14px] font-black text-[#0A1140]">Total Amount</span>
                 <span className="text-xl font-black text-[#0A1140]">N 80,000</span>
              </div>
           </div>

        </div>

        {/* 📊 RIGHT SIDEBAR: BILLING & ACTIONS */}
        <aside className="space-y-6">
           
           {/* Summary Card */}
           <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                 <h3 className="text-[14px] font-black text-[#0A1140]">Payment Status</h3>
                 <span className="bg-blue-50 text-[#1D4ED8] text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">Paid</span>
              </div>
              
              <div className="space-y-4 mb-6">
                 <div>
                    <p className="text-[10px] font-bold text-slate-400 mb-1">Payment Method</p>
                    <p className="text-[12px] font-extrabold text-slate-600">Wallet & Pay Later</p>
                 </div>
                 <div className="flex items-center justify-between group">
                    <div>
                       <p className="text-[10px] font-bold text-slate-400 mb-1">Wallet Balance</p>
                       <p className="text-[14px] font-black text-[#0A1140]">N380,000.00</p>
                    </div>
                    <button className="h-7 px-3 bg-blue-50 text-[#1D4ED8] rounded-lg text-[9px] font-black hover:bg-blue-100 transition-colors flex items-center gap-1">
                       <Plus size={12} /> Fund Wallet
                    </button>
                 </div>
              </div>

              <div className="space-y-2 pt-6 border-t border-dashed border-slate-100 text-[11px] font-bold">
                 <div className="flex justify-between text-slate-500"><span>Subtotal:</span> <span className="text-[#0A1140]">N107,900</span></div>
                 <div className="flex justify-between text-slate-500"><span>Delivery Fee:</span> <span className="text-[#0A1140]">N6,300</span></div>
                 <div className="flex justify-between text-emerald-500 font-extrabold"><span>Wallet Usage:</span> <span>-N96,500</span></div>
              </div>

              <div className="flex justify-between items-center mt-6 py-4 border-y border-slate-50">
                 <span className="text-[12px] font-black text-slate-400">Total Paid</span>
                 <span className="text-[18px] font-black text-[#0A1140]">N17,900</span>
              </div>

              <button className="w-full h-12 bg-[#13184F] hover:bg-[#1a2066] text-white rounded-2xl text-[12px] font-black tracking-tight shadow-md transition-all mt-6 flex items-center justify-center gap-3">
                 <Package size={16} /> Track Order
              </button>
           </div>

           {/* Actions Card */}
           <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
              <h3 className="text-[14px] font-black text-[#0A1140] mb-4">Actions</h3>
              <ActionButton icon={<Download size={16} />} label="Download Invoice" />
              <ActionButton icon={<LifeBuoy size={16} />} label="Request Support" />
              <button 
                 className="w-full h-12 bg-[#FF5C00] hover:bg-[#e65300] text-white rounded-2xl text-[12px] font-black tracking-tight shadow-md transition-all mt-2 flex items-center justify-center gap-3"
              >
                 <RefreshCw size={16} /> Reorder All Items
              </button>
           </div>

           {/* Order Notes Card */}
           <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
              <h3 className="text-[14px] font-black text-[#0A1140] mb-4">Order Notes</h3>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                 <p className="text-[11px] font-bold text-slate-500 leading-relaxed">
                   Please inform us 1 hour before delivery so we can arrange for someone to receive the materials at site. All items must be unloaded and counted before the driver leaves.
                 </p>
                 <p className="text-[9px] font-black text-[#FF5C00] mt-4 uppercase tracking-widest">Tue, Feb 26, 2026 10:25AM</p>
              </div>
           </div>

        </aside>

      </div>
    </div>
  );
}

// --- Helper Components ---

function StepItem({ label, date, active, completed, current }: any) {
  return (
    <div className="flex flex-col items-center gap-3 relative z-10">
       <div className={`w-8 h-8 rounded-full border-4 flex items-center justify-center transition-all ${
         completed ? "bg-emerald-500 border-emerald-100 text-white" :
         current ? "bg-white border-[#FF5C00] text-[#FF5C00] shadow-[0_0_15px_rgba(255,92,0,0.3)]" :
         "bg-white border-slate-100 text-slate-300"
       }`}>
          {completed ? <CheckCircle2 size={16} /> : <div className={`w-2 h-2 rounded-full ${current ? "bg-[#FF5C00]" : "bg-slate-200"}`} />}
       </div>
       <div className="text-center">
          <p className={`text-[12px] font-black ${active ? "text-[#0A1140]" : "text-slate-300"}`}>{label}</p>
          <p className="text-[10px] font-bold text-slate-400 mt-0.5">{date}</p>
       </div>
    </div>
  );
}

function OrderItem({ src, name, details, productId, price, qty, total }: any) {
  return (
    <tr className="group hover:bg-slate-50/30 transition-colors">
       <td className="px-8 py-6">
          <div className="flex items-center gap-5">
             <div className="w-16 h-16 rounded-2xl border border-slate-100 overflow-hidden bg-slate-50 group-hover:shadow-md transition-all shrink-0 p-2">
                <img src={src} className="w-full h-full object-contain" alt={name} />
             </div>
             <div className="min-w-0">
                <p className="text-[14px] font-black text-[#0A1140]">{name}</p>
                <p className="text-[11px] font-medium text-slate-500 mt-1 line-clamp-1">{details}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">Product ID: {productId}</p>
             </div>
          </div>
       </td>
       <td className="px-4 py-6">
          <p className="text-[12px] font-bold text-slate-400 mb-1">Unit Price</p>
          <p className="text-[13px] font-black text-[#0A1140]">{price}</p>
       </td>
       <td className="px-4 py-6">
          <p className="text-[12px] font-bold text-slate-400 mb-1">Quantity</p>
          <p className="text-[13px] font-black text-[#0A1140]">{qty}</p>
       </td>
       <td className="px-4 py-6">
          <p className="text-[12px] font-bold text-slate-400 mb-1">Total</p>
          <p className="text-[14px] font-black text-[#0A1140]">{total}</p>
       </td>
       <td className="px-8 py-6 text-right">
          <button className="px-6 py-2 border border-blue-100 bg-white text-[#1D4ED8] rounded-xl text-[11px] font-black hover:bg-blue-50 transition-all shadow-sm flex items-center justify-center gap-2 ml-auto group-hover:border-blue-200">
             <RefreshCw size={14} /> Reorder
          </button>
       </td>
    </tr>
  );
}

function ActionButton({ icon, label }: any) {
  return (
    <button className="w-full h-12 px-5 bg-white border border-slate-100 rounded-2xl flex items-center justify-between text-slate-500 hover:text-[#1D4ED8] hover:border-blue-100 hover:bg-blue-50/20 transition-all group">
       <div className="flex items-center gap-3">
          <div className="group-hover:translate-y-[-1px] transition-transform">{icon}</div>
          <span className="text-[12px] font-black group-hover:tracking-tight transition-all">{label}</span>
       </div>
       <ChevronRight size={14} className="text-slate-300 group-hover:translate-x-1 group-hover:text-blue-400 transition-all" />
    </button>
  );
}
