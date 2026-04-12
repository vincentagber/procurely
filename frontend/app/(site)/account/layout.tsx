"use client"

import React, { useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/account/shared/dashboard-sidebar";
import { DashboardHeader } from "@/components/account/shared/dashboard-header";
import { SidebarProvider } from "@/components/account/shared/sidebar-context";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#1D4ED8] border-t-transparent"></div>
          <p className="text-xs font-bold text-[#0A1140] uppercase tracking-widest animate-pulse">Initializing Identity Hub...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-[#F8F9FA] text-slate-800 font-sans flex flex-col">
        {/* Full-width header */}
        <DashboardHeader />

        {/* Centred, boxed shell */}
        <div className="flex-1 flex justify-center px-4 xl:px-6">
          <div className="w-full max-w-[1440px] flex min-w-0 mb-[15px]">
            <DashboardSidebar />
            <main className="flex-1 p-[10px] pb-[80px] min-w-0 overflow-y-auto">
              {children}
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
