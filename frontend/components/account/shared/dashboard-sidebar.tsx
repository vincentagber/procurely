"use client";

import React, { useEffect } from "react";
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

  // Close drawer on route change
  useEffect(() => {
    close();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [close]);

  const menuItems = [
    { icon: <LayoutDashboard size={18} />, label: "My Dashboard", href: "/account" },
    { icon: <ShoppingCart size={18} />, label: "Orders", href: "/account/orders" },
    { icon: <Wallet size={18} />, label: "Wallet / Payments", href: "/account/wallet" },
    { icon: <History size={18} />, label: "Order History", href: "/account/orders?view=history" },
    { icon: <Bookmark size={18} />, label: "Saved Materials", href: "/account/saved-materials" },
  ];

  const subItems = [
    { icon: <Settings size={18} />, label: "Account Settings", href: "/account/settings" },
  ];

  const isLinkActive = (href: string) => {
    if (href.includes("?")) {
      const [path, query] = href.split("?");
      return (
        pathname === path &&
        typeof window !== "undefined" &&
        window.location.search.includes(query)
      );
    }
    return pathname === href;
  };

  const sidebarContent = (
    <>
      {/* Brand */}
      <div className="p-8 border-b border-white/10 flex items-center justify-between">
        <Link href="/" className="group">
          <h2 className="text-2xl font-black tracking-tight flex items-center gap-1 group-hover:text-blue-400 transition-colors">
            Procurely<span className="text-[10px] align-super">™</span>
          </h2>
        </Link>
        {/* Close button — mobile only */}
        <button
          onClick={close}
          className="lg:hidden p-1.5 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close menu"
        >
          <X size={18} />
        </button>
      </div>

      {/* User Info */}
      <div className="p-8 border-b border-white/10 flex items-center gap-4 text-left">
        <div className="w-12 h-12 rounded-xl overflow-hidden border-2 border-white/20 shrink-0 bg-white/5 flex items-center justify-center text-white font-black text-xl">
          {user?.fullName?.charAt(0) || "U"}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[14px] leading-tight text-white truncate">
            {user?.fullName || "User Account"}
          </p>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-1 truncate">
            {user?.roles?.[0] || "Procurement Manager"}
          </p>
        </div>
      </div>

      {/* Nav */}
      <div className="p-6 pb-8 flex-1">
        <div className="text-[10px] font-black tracking-[0.2em] text-white/40 mb-4 px-2">
          MAIN MENU
        </div>
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <SidebarLink key={item.href} item={item} active={isLinkActive(item.href)} />
          ))}

          <div className="h-4 border-b border-white/10 mx-4 mb-4" />

          {subItems.map((item) => (
            <SidebarLink key={item.href} item={item} active={isLinkActive(item.href)} />
          ))}

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-white/60 hover:bg-rose-500/10 hover:text-rose-400 font-medium mt-4"
          >
            <LogOut size={18} />
            <span className="text-[13px] font-bold">Logout</span>
          </button>
        </nav>
      </div>
    </>
  );

  return (
    <>
      {/* ── Desktop: always-visible sticky sidebar ─────────────────── */}
      <aside className="w-[280px] flex-shrink-0 bg-[#0A1140] text-white hidden lg:flex flex-col sticky top-20 h-[calc(100vh-80px-15px)] overflow-y-auto scrollbar-hide shadow-2xl z-10 pb-10">
        {sidebarContent}
      </aside>

      {/* ── Mobile: backdrop overlay ────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* ── Mobile: slide-in drawer ─────────────────────────────────── */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-[300px] bg-[#0A1140] text-white
          flex flex-col z-50 shadow-2xl overflow-y-auto pb-10
          transition-transform duration-300 ease-in-out
          lg:hidden
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {sidebarContent}
      </aside>
    </>
  );
}

function SidebarLink({ item, active }: { item: any; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
        ? "bg-[#1D4ED8] text-white font-bold shadow-md shadow-blue-900/50"
        : "text-white/60 hover:bg-white/10 hover:text-white font-medium"
        }`}
    >
      <span className={`shrink-0 ${active ? "text-white" : "text-white/40"}`}>
        {item.icon}
      </span>
      <span className="text-[13px] tracking-wide truncate">{item.label}</span>
      {active && (
        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
      )}
    </Link>
  );
}
