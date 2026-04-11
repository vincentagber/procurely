"use client";

import React from "react";
import { Bell, Menu, Search } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";

export function DashboardHeader() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-slate-100 h-20 px-8 lg:px-12 flex items-center justify-between sticky top-0 z-20">
      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Search for materials, suppliers, or orders..." 
            className="w-full h-11 pl-12 pr-4 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4 md:hidden">
        <button className="p-2 bg-slate-50 rounded-xl text-slate-600"><Menu size={20} /></button>
        <h2 className="text-xl font-black text-[#0A1140]">Procurely</h2>
      </div>

      <div className="flex items-center gap-4 lg:gap-8">
        <div className="relative cursor-pointer group">
          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
            <Bell size={20} />
          </div>
          <div className="absolute top-2 right-2 w-2 h-2 bg-orange-600 rounded-full border-2 border-white" />
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-black text-[#0A1140] leading-none mb-1">{user?.fullName ? user.fullName.split(' ')[0] : 'User'}</p>
            <p className="text-[10px] font-bold text-[#1D4ED8] uppercase tracking-widest">{user?.role || "Global Partner"}</p>
          </div>
          <div className="h-10 w-10 bg-[#0A1140] rounded-xl p-0.5 border border-slate-200 shadow-sm shrink-0 overflow-hidden relative">
             <div className="w-full h-full bg-[#1D4ED8] flex items-center justify-center text-white font-black text-sm uppercase">
               {user?.fullName?.charAt(0) || "U"}
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}
