import { cache } from "react";
import type { ApiEnvelope, Product, SiteContent } from "@/lib/types";
import contentFallback from "./content/procurely.json";

const serverApiBase =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://127.0.0.1:8000";

export const readLocalContent = async (): Promise<SiteContent> => {
  return contentFallback as SiteContent;
};

export const getProcurelyContent = async (): Promise<SiteContent> => {
  // PHASE is set by Next.js during build. we also check for production NODE_ENV
  const isBuildTime = process.env.NEXT_PHASE === 'phase-production-build' || 
                      process.env.PHASE === 'phase-production-build' ||
                      process.env.NODE_ENV === 'production';
  
  // During static export build, we should prefer local content to ensure stability
  if (isBuildTime) {
     try {
       const local = await readLocalContent();
       if (local && local.products && local.products.length > 0) {
         return local;
       }
     } catch (err) {
       console.warn("[getProcurelyContent] Build-time local content read failed.", err);
     }
  }

  // Always try API first for real-time MySQL data in development or if API_BASE_URL is set
  try {
    const response = await fetch(`${serverApiBase}/api/homepage`, {
      cache: isBuildTime ? "force-cache" : "no-store",
      next: isBuildTime ? { revalidate: 3600 } : { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) {
      throw new Error(`Homepage API request failed with status: ${response.status}`);
    }

    const payload = (await response.json()) as ApiEnvelope<SiteContent>;
    return payload.data;
  } catch (err) {
    if (!isBuildTime) {
      console.warn("[getProcurelyContent] API fetch failed, falling back to local content.", err);
    }
    // Fallback to local content
    try {
      const local = await readLocalContent();
      return local;
    } catch (fallbackErr) {
      console.error("[getProcurelyContent] Critical: Both API and local fallback failed.", fallbackErr);
      return {
        site: { name: "Procurely", tagline: "Infrastructure Made Simple", primaryColor: "#1D4ED8", logoDark: "", logoLight: "" },
        navigation: { primaryLinks: [], socialLinks: [], accountLinks: [] },
        footer: { address: [], accountLinks: [], quickLinks: [] },
        products: [],
      } as any;
    }
  }
};

type ProductSearchFilters = {
  q: string;
  slot?: string;
  sort?: string;
  limit?: number;
};

export const searchProducts = cache(
  async ({ q, slot, sort = "relevance", limit = 12 }: ProductSearchFilters): Promise<Product[]> => {
    const query = q.trim();

    if (query === "") {
      return [];
    }

    const params = new URLSearchParams({
      q: query,
      sort,
      limit: String(limit),
    });

    if (slot) {
      params.set("slot", slot);
    }

    try {
      const response = await fetch(`${serverApiBase}/api/products?${params.toString()}`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) {
        throw new Error("Product search failed.");
      }

      const payload = (await response.json()) as ApiEnvelope<Product[]>;
      return payload.data;
    } catch {
      const content = await readLocalContent();
      const loweredQuery = query.toLowerCase();

      return content.products
        .filter((product) =>
          `${product.name} ${product.shortDescription} ${product.category}`
            .toLowerCase()
            .includes(loweredQuery),
        )
        .filter((product) => (slot ? product.homepageSlot === slot : true))
        .slice(0, limit);
    }
  },
);

export function resolveProducts(content: SiteContent, ids: string[]) {
  return ids
    .map((id) => content.products.find((product) => product.id === id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product));
}
