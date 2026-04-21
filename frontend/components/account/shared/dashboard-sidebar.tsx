"use client";

import React from "react";
import {
  LayoutDashboard,
  ShoppingCart,
  Wallet,
  History,
  Bookmark,
  Settings,
  LogOut,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { useSidebar } from "./sidebar-context";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isOpen, close } = useSidebar();

  const menuItems = [
    { icon: LayoutDashboard, label: "My Dashboard", href: "/account" },
    { icon: ShoppingCart, label: "Orders", href: "/account/profile-order" },
    { icon: Wallet, label: "Wallet / Payments", href: "/account/wallet" },
    { icon: History, label: "Order History", href: "/account/orders?view=history" },
    { icon: Bookmark, label: "Saved Materials", href: "/account/saved-materials" },
    { icon: Settings, label: "Account Settings", href: "/account/settings" },
  ];

  const isLinkActive = (href: string) => {
    if (href === "/account") return pathname === "/account";
    return pathname.startsWith(href.split('?')[0]);
  };

   const sidebarContent = (
    <div className="flex flex-col h-full bg-[#0C1457] pt-6 pb-6 px-4">
      {/* Brand & User Card */}
      <div className="shrink-0 mb-4 px-2">
        <div className="flex items-center justify-between mb-6">
          <Link href="/" className="group">
            <h2 className="text-2xl font-black text-white tracking-tight flex items-center">
              Procurely<span className="text-[10px] align-super ml-0.5 font-normal">™</span>
            </h2>
          </Link>
          <button onClick={close} className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 bg-slate-800 shrink-0 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" 
              className="w-full h-full object-cover" 
              alt="User" 
            />
          </div>
          <div className="min-w-0">
             <p className="font-bold text-[12px] leading-tight text-white/90">Olusegun</p>
             <p className="font-black text-[15px] leading-tight text-white mb-0.5">Akapo</p>
             <p className="text-[9px] text-white/40 font-bold uppercase tracking-wider">
               Procurement Manager
             </p>
          </div>
        </div>

        <div className="mt-4 mb-4 border-t border-white/10 w-full" />

        <div className="text-[10px] font-black tracking-[0.2em] text-white/30 mb-3 px-1 uppercase">
          MAIN MENU
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <nav className="flex flex-col gap-2">
          {menuItems.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all h-[46px] shadow-sm ${
                  active
                    ? "bg-[#0001FF] text-white shadow-blue-500/10"
                    : "bg-white text-[#0C1457] hover:bg-slate-50"
                }`}
              >
                <span className="shrink-0">
                  <item.icon size={18} strokeWidth={2.5} />
                </span>
                <span className="text-[13px] font-bold tracking-tight">{item.label}</span>
              </Link>
            );
          })}

          <div className="mt-6">
             <button
               onClick={logout}
               className="w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all h-[46px] bg-white text-[#0C1457] hover:bg-slate-50 shadow-sm"
             >
               <LogOut size={18} strokeWidth={2.5} />
               <span className="text-[13px] font-bold tracking-tight">Logout</span>
             </button>
          </div>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-[211px] flex-shrink-0 hidden lg:flex flex-col sticky top-0 h-screen z-10 p-0">
        <div className="h-full rounded-r-[6.19px] overflow-hidden shadow-2xl">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md" onClick={close} />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[211px] z-50 overflow-hidden
          transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
