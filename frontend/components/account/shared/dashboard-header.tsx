"use client";

import React from "react";
import { Bell, Menu, Search, X, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { useSidebar } from "./sidebar-context";

export function DashboardHeader() {
  const { user } = useAuth();
  const { isOpen, toggle } = useSidebar();

  return (
    <header 
      className="bg-white flex items-center justify-between sticky top-0 z-30"
      style={{
        maxWidth: '1158px',
        width: '100%',
        height: '61px',
        paddingLeft: '10px'
      }}
    >
      {/* Welcome Message */}
      <div className="flex flex-col">
        <h1 className="text-[20px] font-black text-[#0001FF] leading-none mb-1">Hello {user?.fullName?.split(' ')[0] || 'Olusegun'}!</h1>
        <p className="text-[12px] font-bold text-slate-400">Welcome back, lets manage your procurement.</p>
      </div>

      {/* Right Actions Cluster */}
      <div className="flex items-center gap-4">
        {/* Search Bar - Rounded Pill */}
        <div className="relative w-[340px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search anything here..." 
            className="w-full h-11 pl-12 pr-4 bg-white border border-slate-200 rounded-full text-[13px] font-medium text-slate-700 focus:ring-1 focus:ring-blue-100 outline-none transition-all shadow-sm"
          />
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#0C1457] hover:border-slate-300 transition-all shadow-sm">
            <Bell size={20} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF4A17] rounded-full border border-white" />
          </button>
          <button className="relative w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-[#0C1457] hover:border-slate-300 transition-all shadow-sm">
            <Settings size={20} />
            <div className="absolute top-2 right-2 w-2 h-2 bg-[#FF4A17] rounded-full border border-white" />
          </button>
        </div>

        {/* Profile / Language Dropdown Pill */}
        <div className="flex items-center gap-3 pl-2 pr-4 h-11 bg-white border border-slate-200 rounded-full shadow-sm hover:border-slate-300 transition-all cursor-pointer">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-50">
            <img 
               src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100" 
               alt="User" 
               className="w-full h-full object-cover" 
            />
          </div>
          <span className="text-[12px] font-black text-[#0C1457]">Eng (NG)</span>
          <ChevronDown size={14} className="text-[#0C1457]" />
        </div>
      </div>
    </header>
  );
}
