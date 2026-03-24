import rawContent from "../../../shared/content/procurely.json";

import type { Product, SiteContent } from "@/lib/types";

export const procurelyContent = rawContent as SiteContent;

export const bestSellerProducts = resolveProducts(
  procurelyContent,
  procurelyContent.bestSellerSection.productIds,
);

export const exploreProducts = resolveProducts(
  procurelyContent,
  procurelyContent.exploreSection.productIds,
);

export const primaryProduct = bestSellerProducts[0] as Product;

function resolveProducts(content: SiteContent, ids: string[]) {
  return ids
    .map((id) => content.products.find((product) => product.id === id))
    .filter((product): product is Product => Boolean(product));
}
