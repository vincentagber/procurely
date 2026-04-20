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
    <div className="flex flex-col h-full bg-[#0C1457] pt-[17.47px] pr-[8.73px]">
      {/* Brand & User Card */}
      <div className="shrink-0 mb-8 pl-8">
        <div className="flex items-center justify-between mb-10">
          <Link href="/" className="group">
            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center">
              Procurely<span className="text-[12px] align-super ml-0.5">™</span>
            </h2>
          </Link>
          <button onClick={close} className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary-blue bg-slate-800 shrink-0 shadow-lg">
            <img 
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop" 
              className="w-full h-full object-cover" 
              alt="User" 
            />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-[15px] leading-tight text-white mb-0.5">
              Olusegun <br /> <span className="text-white">Akapo</span>
            </p>
            <p className="text-[10px] text-white/60 font-medium">
              Procurement Manager
            </p>
          </div>
        </div>

        <div className="mt-8 mb-8 border-t border-white/20 w-full" />

        <div className="text-[11px] font-bold tracking-wider text-white mb-4">
          MAIN MENU
        </div>
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <nav className="flex flex-col" style={{ gap: '13.1px' }}>
          {menuItems.map((item) => {
            const active = isLinkActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`w-full flex items-center gap-3 pl-8 pr-4 py-2.5 transition-all h-[44px] ${
                  active
                    ? "bg-[#0001FF] text-white font-bold"
                    : "bg-transparent text-white hover:bg-white/10 font-bold"
                }`}
              >
                <span className="shrink-0">
                  <item.icon size={18} />
                </span>
                <span className="text-[13px] tracking-tight truncate">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 pl-8 pr-4 py-2.5 transition-all h-[44px] bg-transparent text-white hover:bg-white/10 font-bold mt-auto"
          >
            <LogOut size={18} />
            <span className="text-[13px] tracking-tight">Logout</span>
          </button>
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
