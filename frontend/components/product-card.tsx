"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { useCart } from "@/components/cart/cart-provider";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, loading } = useCart();

  return (
    <Reveal delay={index * 0.05}>
      <motion.article
        className="group flex h-full flex-col rounded-[28px] bg-white p-4 shadow-[0_24px_60px_rgba(19,24,79,0.06)]"
        transition={{ duration: 0.22 }}
        whileHover={{ y: -8 }}
      >
        <div className="relative rounded-[24px] bg-[var(--color-surface-soft)] p-4">
          {product.badge ? (
            <span className="absolute left-3 top-3 inline-flex h-7 items-center rounded-full bg-[var(--color-brand-blue)] px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              {product.badge}
            </span>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={product.name}
            className="mx-auto h-[180px] w-full rounded-[18px] object-contain"
            src={product.image}
          />
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <p className="text-xs text-slate-400">{product.category}</p>
          <h3 className="mt-1 text-[1.15rem] font-semibold leading-tight text-[var(--color-brand-navy)]">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{product.shortDescription}</p>

          <div className="mt-auto flex items-center justify-between pt-6">
            <div className="text-lg font-semibold text-[var(--color-brand-navy)]">
              {formatCurrency(product.price, product.currency)}
            </div>
            <button
              className="inline-flex size-12 items-center justify-center rounded-full bg-[var(--color-brand-navy)] text-white transition hover:scale-105"
              disabled={loading}
              onClick={() => void addItem(product.id)}
              type="button"
            >
              <ShoppingCart className="size-5" />
            </button>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}
