import { HomePage } from "@/components/home/home-page";
import { getProcurelyContent, searchProducts } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procurely - Order Construction Materials",
  description: "Order construction materials online. Fast delivery, authentic brands, and expert support. Upload BOQ for competitive pricing.",
  keywords: "home, Procurely, building materials, construction, online ordering, fast delivery",
};

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const content = await getProcurelyContent();
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const searchResults =
    query.trim() !== ""
      ? await searchProducts({ q: query, slot: "explore", sort: "relevance", limit: 12 })
      : undefined;

  return <HomePage content={content} searchQuery={query} searchResults={searchResults} />;
}
