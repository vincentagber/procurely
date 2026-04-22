"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { ShoppingCart, Eye, Heart } from "lucide-react";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { useCart } from "@/components/cart/cart-provider";
import { useWishlist } from "@/components/wishlist-provider";
import { formatCurrency } from "@/lib/format";
import type { Product } from "@/lib/types";

type ProductCardProps = {
  product: Product;
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem, loading: cartLoading } = useCart();
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist, loading: wishlistLoading } = useWishlist();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isFavorited = mounted ? isInWishlist(product.id) : false;

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorited) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
  };

  return (
      <motion.article
        className="group flex h-full flex-col bg-transparent"
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        whileHover="hover"
      >
        <div className="relative rounded-[12px] sm:rounded-[16px] bg-[#f8f9fa] h-[180px] sm:h-[260px] flex items-center justify-center transition-all duration-300 group-hover:bg-[#f1f3f6] overflow-hidden">
          {product.badge ? (
            <span className="absolute left-2 sm:left-4 top-2 sm:top-4 z-20 inline-flex h-[18px] sm:h-[22px] items-center rounded-full bg-[#1D4ED8] px-2 sm:px-2.5 text-[9px] sm:text-[11px] font-bold lowercase tracking-wider text-white">
              {product.badge}
            </span>
          ) : null}
          
          {/* Floating Actions Stack */}
          <div className="absolute right-2 sm:right-3 top-2 sm:top-3 z-30 flex flex-col gap-1.5 sm:gap-2">
            <button 
              type="button"
              onClick={toggleWishlist}
              disabled={mounted ? wishlistLoading : false}
              className={`flex size-8 sm:size-[38px] cursor-pointer items-center justify-center rounded-full border shadow-sm transition-all hover:scale-110 disabled:opacity-50 ${
                isFavorited 
                  ? "border-[#ff6f4d] bg-[#ff6f4d] text-white" 
                  : "border-[#ff6f4d]/10 bg-[#fff5f2] text-[#ff6f4d] hover:bg-[#ff6f4d] hover:text-white"
              }`}
            >
              <Heart size={14} className="sm:w-[18px] sm:h-[18px]" fill={isFavorited ? "currentColor" : "none"} strokeWidth={2.5} />
            </button>

            <Link 
              href={`/products/${product.id}`}
              className="flex size-8 sm:size-[38px] items-center justify-center rounded-full border border-[#ff6f4d]/10 bg-[#fff5f2] text-[#ff6f4d] shadow-sm transition-all hover:scale-110 hover:bg-[#ff6f4d] hover:text-white"
            >
              <Eye size={14} className="sm:w-[18px] sm:h-[18px]" strokeWidth={2.5} />
            </Link>
          </div>

          <Link href={`/products/${product.id}`} className="block relative z-10 w-full h-full">
            <motion.img
              alt={product.name}
              className="h-full w-full object-cover"
              src={product.image}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              variants={{ hover: { scale: 1.05 } }}
            />
          </Link>
        </div>

        <div className="mt-4 flex flex-1 flex-col">

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
              disabled={mounted ? cartLoading : false}
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
