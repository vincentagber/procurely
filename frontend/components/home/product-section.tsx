import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Product } from "@/lib/types";

type ProductSectionProps = {
  id: string;
  eyebrow: string;
  lead: string;
  accent: string;
  products: Product[];
  topActionLabel?: string;
  bottomActionLabel?: string;
  showCarouselControls?: boolean;
  searchQuery?: string;
};

export function ProductSection({
  id,
  eyebrow,
  lead,
  accent,
  products,
  topActionLabel,
  bottomActionLabel,
  showCarouselControls = false,
  searchQuery,
}: ProductSectionProps) {
  return (
    <section className="container-shell py-12 md:py-16" id={id}>
      <div className="flex items-start justify-between gap-4">
        <SectionHeading
          actionHref="#explore-products"
          actionLabel={topActionLabel}
          accent={accent}
          eyebrow={eyebrow}
          lead={lead}
        />

        {showCarouselControls ? (
          <div className="hidden gap-3 pt-14 md:flex">
            <button className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-surface-soft)] text-slate-700">
              <ArrowLeft className="size-5" />
            </button>
            <button className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-surface-soft)] text-slate-700">
              <ArrowRight className="size-5" />
            </button>
          </div>
        ) : null}
      </div>

      {searchQuery ? (
        <Reveal className="mt-6 rounded-[18px] border border-[var(--color-brand-blue)]/12 bg-[var(--color-brand-blue)]/5 px-4 py-3 text-sm text-[var(--color-brand-navy)]">
          Showing results for <span className="font-semibold">&quot;{searchQuery}&quot;</span>
        </Reveal>
      ) : null}

      {products.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard index={index} key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[28px] border border-dashed border-slate-200 bg-[var(--color-surface-soft)] px-6 py-12 text-center">
          <h3 className="text-xl font-semibold text-[var(--color-brand-navy)]">
            No materials matched this search
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Try a different keyword or remove the filter to see the full catalog.
          </p>
        </div>
      )}

      {bottomActionLabel ? (
        <div className="mt-10 flex justify-center">
          <Link
            className="inline-flex h-14 items-center justify-center rounded-[16px] bg-[var(--color-brand-blue)] px-8 text-base font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(25,0,255,0.28)]"
            href="#explore-products"
          >
            {bottomActionLabel}
          </Link>
        </div>
      ) : null}
    </section>
  );
}
