import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";

import type { ApiEnvelope, Product, SiteContent } from "@/lib/types";

const localContentPath = path.join(
  process.cwd(),
  "..",
  "shared",
  "content",
  "procurely.json",
);

const serverApiBase =
  process.env.API_BASE_URL ??
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://127.0.0.1:8000";

export const readLocalContent = cache(async (): Promise<SiteContent> => {
  const raw = await readFile(localContentPath, "utf8");
  return JSON.parse(raw) as SiteContent;
});

export const getProcurelyContent = cache(async (): Promise<SiteContent> => {
  try {
    const response = await fetch(`${serverApiBase}/api/homepage`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(1500),
    });

    if (!response.ok) {
      throw new Error("Homepage request failed.");
    }

    const payload = (await response.json()) as ApiEnvelope<SiteContent>;
    return payload.data;
  } catch {
    return readLocalContent();
  }
});

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
        signal: AbortSignal.timeout(1500),
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
