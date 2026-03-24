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
  return (
    <section className="container-shell py-10 md:py-14" id={id}>
      <Reveal className="relative">
        <motion.div
          transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          whileHover="hover"
        >
          <Link
            className="group relative block overflow-hidden rounded-[24px] shadow-[0_28px_70px_rgba(19,24,79,0.12)] sm:rounded-[30px]"
            href={banner.href}
          >
            <motion.img
              alt={banner.title}
              className="h-auto w-full object-cover"
              src={banner.bannerImage}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              variants={{ hover: { scale: 1.025 } }}
            />
            <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(255,255,255,0)_18%,rgba(255,255,255,0.14)_50%,rgba(255,255,255,0)_76%)] opacity-0 transition-card-hover duration-500 group-hover:opacity-100" />
            <span className="sr-only">
              {banner.title} {banner.description}
            </span>
          </Link>
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
