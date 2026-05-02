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
  FileText
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
    { icon: FileText, label: "Orders", href: "/account/profile-order" },
    { icon: Wallet, label: "Wallet / Payments", href: "/account/wallet" },
    { icon: History, label: "Order History", href: "/account/orders?view=history" },
    { icon: Bookmark, label: "Saved Materials", href: "/account/saved-materials" },
    { icon: Settings, label: "Account Settings", href: "/account/settings" },
  ];

  const isLinkActive = (href: string) => {
    const p = pathname.replace(/\/$/, "");
    const h = href.split('?')[0].replace(/\/$/, "");
    if (h === "/account") return p === "/account";
    return p.startsWith(h);
  };

   const sidebarContent = (
    <div className="flex flex-col h-full bg-[#070B38] pt-[17.47px] pr-[8.73px] pb-6 pl-[8.73px] overflow-hidden">
      {/* Brand & User Card */}
      <div className="shrink-0 mb-2 px-2 mt-2">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="group">
            <h2 className="text-[24px] font-black text-white tracking-tight flex items-center">
              Procurely<span className="text-[10px] align-super ml-0.5 font-normal">™</span>
            </h2>
          </Link>
          <button onClick={close} className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-[50px] h-[50px] rounded-full overflow-hidden border-2 border-white/10 bg-slate-800 shrink-0 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" 
              className="w-full h-full object-cover" 
              alt="User" 
            />
          </div>
          <div className="min-w-0">
             <p className="font-bold text-[13px] leading-tight text-white/90">Olusegun</p>
             <p className="font-black text-[16px] leading-tight text-white mb-0.5">Akapo</p>
             <p className="text-[9px] text-white/50 font-bold tracking-wide">
               Procurement Manager
             </p>
          </div>
        </div>

        <div className="mt-2 mb-6 border-t border-white/20 w-full" />

        <div className="text-[11px] font-black tracking-widest text-white/40 mb-4 px-1 uppercase">
          MAIN MENU
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <nav className="flex flex-col gap-[10px]">
          {menuItems.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-[6.19px] transition-all h-[44px] shadow-sm ${
                  active
                    ? "bg-[#0001FF] text-white"
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

          <div className="mt-2">
             <button
               onClick={logout}
               className="w-full flex items-center gap-3 px-4 py-2 rounded-[6.19px] transition-all h-[44px] bg-white text-[#0C1457] hover:bg-slate-50 shadow-sm"
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
