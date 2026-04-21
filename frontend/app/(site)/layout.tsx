import { type ReactNode, Suspense } from "react";
// Force refresh of shared content from procurely.json

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { getProcurelyContent } from "@/lib/content";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const content = await getProcurelyContent();

  return (
    <>
      <Suspense fallback={<div className="h-[179px] bg-[#E7E8EE] animate-pulse" />}>
        <SiteHeader navigation={content.navigation} site={content.site} />
      </Suspense>
      <main>{children}</main>
      <Suspense fallback={<div className="h-[400px] bg-[#0B1457] animate-pulse" />}>
        <SiteFooter footer={content.footer} site={content.site} />
      </Suspense>
      <WhatsAppButton />
    </>
  );
}
