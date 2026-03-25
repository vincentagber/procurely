import type { ReactNode } from "react";
// Force refresh of shared content from procurely.json

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getProcurelyContent } from "@/lib/content";

export default async function SiteLayout({
  children,
}: {
  children: ReactNode;
}) {
  const content = await getProcurelyContent();

  return (
    <>
      <SiteHeader navigation={content.navigation} site={content.site} />
      <main>{children}</main>
      <SiteFooter footer={content.footer} site={content.site} />
    </>
  );
}
