import React, { Suspense } from "react";
import { AccountClientWrapper } from "@/components/account/account-client-wrapper";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="h-screen bg-[#F8F9FA] animate-pulse" />}>
      <AccountClientWrapper>
        {children}
      </AccountClientWrapper>
    </Suspense>
  );
}
