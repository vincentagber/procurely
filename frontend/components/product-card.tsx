"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

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
      <motion.article
        className="group flex h-full flex-col bg-transparent"
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        whileHover="hover"
      >
        <div className="relative rounded-[16px] bg-[#f8f9fa] p-6 h-[260px] flex items-center justify-center transition-all duration-300 group-hover:bg-[#f1f3f6]">
          {product.badge ? (
            <span className="absolute left-4 top-4 z-20 inline-flex h-[22px] items-center rounded bg-[#e8ecf4] px-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {product.badge}
            </span>
          ) : null}
          
          <div className="absolute right-3 top-3 z-20 flex size-[30px] cursor-pointer items-center justify-center rounded-full border border-[#ff6f4d]/20 bg-[#fff5f2] text-[#ff6f4d] shadow-sm transition hover:scale-110 hover:bg-[#ff6f4d] hover:text-white">
            <svg className="size-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>

          <Link href={`/products/${product.id}`} className="block relative z-10 w-full h-full flex items-center justify-center">
            <motion.img
              alt={product.name}
              className="max-h-[190px] w-auto max-w-full object-contain drop-shadow-md"
              src={product.image}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              variants={{ hover: { scale: 1.04, y: -2 } }}
            />
          </Link>
        </div>

        <div className="mt-4 flex flex-1 flex-col">
          <p className="text-[11px] font-medium uppercase tracking-widest text-[#a1a1aa] mb-1">{product.category}</p>
          <Link href={`/products/${product.id}`} className="block group-hover:opacity-80 transition">
            <h3 className="text-[15px] font-bold leading-snug text-[#13184f]">
              {product.name}
            </h3>
          </Link>
          <p className="mt-1.5 text-[13px] font-medium text-slate-500 leading-relaxed line-clamp-2">{product.shortDescription}</p>

          <div className="mt-auto flex items-end justify-between pt-6">
            <div className="text-[20px] font-black text-[#13184f] tracking-tight">
              {formatCurrency(product.price, product.currency)}
            </div>
            <motion.button
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#0b103e] text-white shadow-md transition disabled:opacity-50"
              disabled={loading}
              onClick={() => void addItem(product.id)}
              transition={{ duration: 0.18 }}
              type="button"
              whileHover={{ scale: 1.1, backgroundColor: "#1900ff" }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className="size-[18px]" strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </motion.article>
  );
}
