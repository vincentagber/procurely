"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import type { PromotionBanner } from "@/lib/types";

type PromoBannerProps = {
  banner: PromotionBanner;
  controls?: boolean;
  id?: string;
};

export function PromoBanner({
  banner,
  controls = false,
  id,
}: PromoBannerProps) {
  // Dynamically assign background gradients based on the banner type
  const isRenovation = banner.title.includes("Renovating");
  const bgClass = isRenovation 
    ? "bg-[#1900ff]" 
    : "bg-gradient-to-r from-[#ff6f4d] to-[#e65432]";

  return (
    <section className="container-shell py-10 md:py-14" id={id}>
      <Reveal className="relative">
        <motion.div
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          whileHover="hover"
        >
          <div className={`group relative block overflow-hidden rounded-[24px] shadow-[0_28px_70px_rgba(19,24,79,0.12)] sm:rounded-[30px] ${bgClass} p-10 sm:p-14 lg:p-20 text-white`}>
            
            {/* Background Texture/Pattern */}
            <div className="absolute right-0 top-0 opacity-20 blur-3xl w-96 h-96 bg-white rounded-full transition-transform group-hover:scale-125 duration-1000 -mr-20 -mt-20"></div>
            
            <div className="relative z-10 max-w-4xl">
               {/* Logo Header */}
               <div className="flex items-center gap-3 mb-8">
                  <div className={`flex size-10 items-center justify-center rounded-xl font-black text-xl shadow-sm ${isRenovation ? 'bg-white text-[#1900ff]' : 'bg-white text-[#ff6f4d]'}`}>
                    P
                  </div>
                  <span className="font-bold text-2xl tracking-tight">Procurely™</span>
               </div>

               <h2 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                 {banner.title}
               </h2>
               
               <p className="mb-10 text-lg sm:text-xl text-white/95 leading-relaxed font-medium max-w-3xl">
                 {banner.description}
               </p>
               
               <Link
                 href={banner.href}
                 className="inline-flex items-center justify-center rounded-xl bg-[#0b103e] px-10 py-5 text-lg font-bold text-white shadow-[0_8px_20px_rgba(11,16,62,0.4)] transition hover:-translate-y-1 hover:bg-[#13184f]"
               >
                 {banner.ctaLabel}
               </Link>
            </div>
            
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,0)_18%,rgba(255,255,255,0.14)_50%,rgba(255,255,255,0)_76%)] opacity-0 transition-card-hover duration-500 group-hover:opacity-100" />
          </div>
        </motion.div>

        {controls ? (
          <>
            <motion.button
              className="absolute left-0 top-1/2 hidden size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-lg md:inline-flex"
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <ArrowLeft className="size-5" />
            </motion.button>
            <motion.button
              className="absolute right-0 top-1/2 hidden size-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-lg md:inline-flex"
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.08, y: -2 }}
              whileTap={{ scale: 0.96 }}
            >
              <ArrowRight className="size-5" />
            </motion.button>
          </>
        ) : null}
      </Reveal>
    </section>
  );
}
