import { HomePage } from "@/components/home/home-page";
import { getProcurelyContent, searchProducts } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Procurely - Order Construction Materials",
  description: "Order construction materials online. Fast delivery, authentic brands, and expert support. Upload BOQ for competitive pricing.",
  keywords: "home, Procurely, building materials, construction, online ordering, fast delivery",
};

export default async function LandingPage() {
  const content = await getProcurelyContent();

  return <HomePage content={content} />;
}
