import type { Metadata } from "next";
import { BlogPage } from "@/components/blog/blog-page";

export const metadata: Metadata = {
  title: "Blog – Procurely | Construction Materials Insights",
  description:
    "Expert articles, procurement guides, and industry news for construction professionals. Stay informed with Procurely's blog.",
  keywords:
    "construction blog, procurement tips, building materials guide, Lagos construction, BOQ, rebar, cement, Procurely",
};

export default function BlogRoute() {
  return <BlogPage />;
}
