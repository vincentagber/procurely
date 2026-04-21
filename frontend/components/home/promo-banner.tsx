"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import type { PromotionBanner } from "@/lib/types";
import type { CSSProperties } from "react";

type PromoBannerProps = {
  banner: PromotionBanner;
  controls?: boolean;
  id?: string;
  className?: string;
  style?: CSSProperties;
};

export function PromoBanner({
  banner,
  controls = false,
  id,
  className = "",
  style,
}: PromoBannerProps) {
  // Dynamically assign background gradients based on the banner type
  const isRenovation = banner.title.includes("Renovating");
  const bgClass = isRenovation 
    ? "bg-[#1900ff]" 
    : "bg-gradient-to-r from-[#ff6f4d] to-[#e65432]";

  return (
    <section className={`py-10 md:py-14 ${className}`} id={id} style={style}>
      <div className="container-shell">
      <Reveal className="relative">
        <motion.div
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          whileHover="hover"
        >
          <div className="group relative flex overflow-hidden rounded-none shadow-[0_28px_70px_rgba(19,20,79,0.12)] bg-[#1900ff] text-white flex-col lg:flex-row min-h-[420px]">
            
            {/* Background Texture/Pattern */}
            <div className="absolute right-0 top-0 opacity-20 blur-3xl w-[600px] h-[600px] bg-white rounded-full transition-transform group-hover:scale-110 duration-1000 -mr-40 -mt-20"></div>

            {isRenovation ? (
              <div className="relative z-10 w-full p-10 sm:p-14 lg:p-20 flex flex-col justify-center max-w-4xl">
                 <div className="mb-10">
                    <img src="/assets/design/logo-light.png" alt="Procurely" className="h-8 w-auto object-contain" />
                 </div>
                 <h2 className="mb-6 text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                   {banner.title}
                 </h2>
                 <p className="mb-12 text-lg sm:text-xl text-white/95 leading-relaxed font-medium max-w-2xl">
                   {banner.description}
                 </p>
                 <div>
                   <Link
                     href={banner.href}
                     className="inline-flex items-center justify-center rounded-xl bg-[#0b103e] px-10 py-5 text-lg font-bold text-white shadow-[0_8px_20px_rgba(11,16,62,0.4)] transition hover:-translate-y-1 hover:bg-[#13184f]"
                   >
                     {banner.ctaLabel}
                   </Link>
                 </div>
              </div>
            ) : (
              <>
                 <div className="relative z-10 w-full lg:w-1/2 p-10 sm:p-14 lg:p-20 flex flex-col justify-center">
                   <div className="mb-6 sm:mb-8">
                      <img src="/assets/design/logo-light.png" alt="Procurely" className="h-7 sm:h-8 w-auto object-contain" />
                   </div>
                   
                   <p className="mb-3 sm:mb-4 text-base sm:text-lg text-white/95 font-medium tracking-wide">
                     {banner.description}
                   </p>

                   <h2 className="mb-10 text-[2.75rem] sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight flex flex-col">
                     <span className="font-extrabold">{banner.title.split(',')[0]},</span>
                     <span className="font-light">{banner.title.split(',')[1] || banner.title}</span>
                   </h2>
                   
                   <div>
                     <Link
                       href={banner.href}
                       className="inline-flex items-center justify-center rounded-xl bg-[#fff0eb] px-10 py-4 text-base sm:text-lg font-bold text-[#ff6f4d] shadow-sm transition hover:-translate-y-1 hover:bg-white"
                     >
                       {banner.ctaLabel}
                     </Link>
                   </div>
                 </div>

                 {banner.bannerImage && (
                   <div className="hidden lg:block absolute right-[-5%] bottom-[-5%] z-10 w-[60%] pointer-events-none">
                      <motion.img
                        src={banner.bannerImage}
                        alt="Sand Mountain Background"
                        className="w-full h-auto object-contain object-bottom drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] origin-bottom-right"
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        variants={{ hover: { scale: 1.08, y: -10, originX: 1, originY: 1 } }}
                      />
                   </div>
                 )}
              </>
            )}

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
      </div>
    </section>
  );
}
