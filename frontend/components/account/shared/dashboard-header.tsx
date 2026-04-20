"use client";

import React from "react";
import { Search, Menu } from "lucide-react";
import { useSidebar } from "./sidebar-context";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { useAuth } from "@/components/auth/auth-provider";
import { usePathname } from "next/navigation";

export function DashboardHeader() {
  const { open } = useSidebar();
  const { user } = useAuth();
  const pathname = usePathname();

  const getBreadcrumb = () => {
    const parts = pathname.split('/').filter(Boolean);
    if (parts.length <= 1) return "Dashboard Overview";
    
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0) ? lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : "Account";
  };

  return (
    <header className="h-[73px] flex items-center justify-between px-6 bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
      <div className="flex items-center gap-4">
        <button 
          onClick={open}
          className="lg:hidden p-2 rounded-xl bg-slate-50 text-slate-500 hover:text-[#1D4ED8]"
        >
          <Menu size={20} />
        </button>

      </div>

      <div className="hidden md:flex flex-1 max-w-sm mx-8 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text" 
          placeholder="Search materials, orders, or help" 
          className="w-full h-11 pl-11 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1D4ED8]/10 focus:border-[#1D4ED8] transition-all"
        />
      </div>

      <div className="flex items-center gap-4">
        <NotificationDropdown />
        
        <div className="h-10 w-px bg-slate-100 mx-2 hidden sm:block" />
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-[12px] font-black text-[#0A1140] truncate max-w-[120px]">
              {user?.fullName}
            </p>
            <p className="text-[10px] font-bold text-slate-400">
              Procurement Manager
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-[14px] shadow-sm border border-white">
            {user?.fullName?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
