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
        className="group flex h-full flex-col rounded-[22px] border border-neutral-100 bg-white p-3.5 shadow-[0_24px_60px_rgba(19,24,79,0.06)] sm:rounded-[28px] sm:p-4"
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -10, scale: 1.012 }}
      >
        <div className="relative rounded-[18px] bg-[var(--color-surface-soft)] p-3 sm:rounded-[24px] sm:p-4">
          {product.badge ? (
            <span className="absolute left-3 top-3 inline-flex h-7 items-center rounded-full bg-[var(--color-brand-blue)] px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
              {product.badge}
            </span>
          ) : null}
          <motion.img
            alt={product.name}
            className="mx-auto h-[150px] w-full rounded-[16px] object-contain sm:h-[180px] sm:rounded-[18px]"
            src={product.image}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.04, rotate: -1 }}
          />
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <p className="text-xs text-slate-400">{product.category}</p>
          <h3 className="mt-1 text-[1.02rem] font-semibold leading-tight text-[var(--color-brand-navy)] sm:text-[1.15rem]">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{product.shortDescription}</p>

          <div className="mt-auto flex items-center justify-between pt-5 sm:pt-6">
            <div className="text-base font-semibold text-[var(--color-brand-navy)] sm:text-lg">
              {formatCurrency(product.price, product.currency)}
            </div>
            <motion.button
              className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--color-brand-navy)] text-white transition hover:scale-105 sm:size-12"
              disabled={loading}
              onClick={() => void addItem(product.id)}
              transition={{ duration: 0.18 }}
              type="button"
              whileHover={{ scale: 1.08, y: -1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="size-5" />
            </motion.button>
          </div>
        </div>
      </motion.article>
    </Reveal>
  );
}
