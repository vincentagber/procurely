"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/account/shared/dashboard-sidebar";
import { SidebarProvider } from "@/components/account/shared/sidebar-context";

export function AccountClientWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (!mounted || loading || !user) {
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
        {/* Breadcrumbs Section */}
        <div className="flex justify-center pt-8 pb-4">
          <div className="w-full max-w-[1240px] h-[81px] bg-white rounded-[10px] flex items-center px-10 shadow-sm border border-slate-100">
            <div className="flex items-center gap-2 text-[14px] font-bold">
               <span className="text-slate-400">Home</span>
               <span className="text-slate-300">/</span>
               <span className="text-slate-400 font-medium">pages</span>
               <span className="text-slate-300">/</span>
               <span className="text-[#0A1140] font-black">my account</span>
            </div>
          </div>
        </div>

        <div className="flex-1 flex justify-center py-4">
          <div className="w-full max-w-[1240px] flex flex-col md:flex-row gap-[40px] px-4 md:px-6 lg:px-0 items-start">
            <DashboardSidebar />
            <main className="flex-1 w-full min-w-0 pb-[100px]">
              <React.Suspense fallback={<div className="bg-[#F8F9FA] min-h-screen animate-pulse" />}>
                {children}
              </React.Suspense>
            </main>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
