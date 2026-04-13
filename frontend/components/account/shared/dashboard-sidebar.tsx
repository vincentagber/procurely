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
    { icon: ShoppingCart, label: "Orders", href: "/account/orders" },
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
    <div className="flex flex-col h-full bg-[#0A1140]">
      {/* Brand & User Card - Compacted Static Top */}
      <div className="shrink-0">
        <div className="px-8 pt-6 pb-2 flex items-center justify-between">
          <Link href="/" className="group">
            <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-1 group-hover:text-blue-400 transition-colors">
              Procurely<span className="text-[10px] align-super">™</span>
            </h2>
          </Link>
          <button onClick={close} className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="mx-6 my-4 p-3 bg-white/5 rounded-xl flex items-center gap-3 border border-white/10">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#1D4ED8] bg-slate-800 shrink-0">
            <img src="/api/placeholder/100/100" className="w-full h-full object-cover" alt="User" />
          </div>
          <div className="min-w-0">
            <p className="font-black text-[12px] leading-tight text-white truncate">
              {user?.fullName || "Olusegun Akapo"}
            </p>
            <p className="text-[8px] text-white/40 font-black uppercase tracking-widest truncate mt-0.5">
              Procurement Manager
            </p>
          </div>
        </div>
      </div>

      {/* Nav - Tight Middle */}
      <div className="px-6 flex-1 overflow-y-auto scrollbar-hide py-1">
        <div className="text-[9px] font-black tracking-[0.2em] text-white/40 mb-4 px-2">
          MAIN MENU
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all h-[44px] shadow-sm ${
                  active
                    ? "bg-[#1D4ED8] text-white font-black shadow-blue-900/40"
                    : "bg-white text-slate-500 hover:bg-slate-50 font-bold border border-slate-100"
                }`}
              >
                <span className={`shrink-0 ${active ? "text-white" : "text-[#1D4ED8]"}`}>
                  <item.icon size={16} />
                </span>
                <span className="text-[11px] tracking-tight truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout - Compact Bottom */}
      <div className="px-6 pb-6 pt-4 shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all h-[44px] bg-white text-slate-500 hover:bg-rose-50 hover:text-rose-500 font-bold border border-slate-100 shadow-sm"
        >
          <LogOut size={16} className="text-[#1D4ED8]" />
          <span className="text-[11px] tracking-tight">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="w-[280px] flex-shrink-0 hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px-30px)] z-10">
        <div className="h-full rounded-[2.5rem] overflow-hidden shadow-2xl">
          {sidebarContent}
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-md" onClick={close} />
      )}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[300px] z-50 overflow-hidden
          transition-transform duration-300 ease-in-out lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
