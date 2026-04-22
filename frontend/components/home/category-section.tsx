"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/format";
import type { SiteContent } from "@/lib/types";

type CategorySectionProps = {
  section: SiteContent["categoriesSection"];
};

const variantClasses = {
  wide: "md:col-span-8 md:row-span-2",
  tall: "md:col-span-4 md:row-span-2",
  "wide-small": "md:col-span-6",
  small: "md:col-span-3",
} as const;

const renderOverlay = (item: SiteContent["categoriesSection"]["items"][0]) => {
  switch (item.id) {
    case "smart-building-materials":
      return (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-center p-5 sm:p-6 md:p-8 lg:p-12">
          <div className="max-w-[240px] sm:max-w-[320px] md:max-w-[300px] lg:max-w-[360px]">
            <h3 className="text-2xl font-light leading-[1.1] text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Smart Building<br />Materials<br />
              <span className="font-bold">Procurement</span>
            </h3>
            <p className="mt-2 text-[0.65rem] leading-relaxed text-white/90 sm:mt-3 sm:text-sm md:mt-4 md:text-sm lg:text-base">
              {item.description}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-navy px-3 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm font-bold text-white transition-interactive group-hover:bg-primary-navy-800 md:mt-6 lg:mt-8">
              <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-secondary-orange" strokeWidth={2.5} />
              {item.ctaLabel}
            </div>
          </div>
        </div>
      );
    case "rebars-category":
      return (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-between p-6 pt-8 md:p-6 md:pt-10 lg:p-8 lg:pt-14">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white sm:text-3xl md:text-2xl lg:text-4xl">
              {item.title}
            </h3>
            <p className="mt-1 text-xs font-medium text-white/90 sm:text-sm md:text-xs lg:text-sm">
              {item.description}
            </p>
          </div>
          <div className="inline-flex items-center justify-center rounded-full bg-surface-peach px-4 py-2 sm:px-6 sm:py-3 text-xs font-bold text-secondary-orange transition-interactive group-hover:scale-105 sm:text-sm">
            {item.ctaLabel}
          </div>
        </div>
      );
    case "sharp-sand-category":
      return (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-5 md:p-6 lg:p-8">
          <div>
            <h3 className="text-xl font-bold text-primary-blue sm:text-2xl md:text-xl lg:text-3xl">
              {item.title}
            </h3>
            <p className="mt-1 max-w-[160px] md:max-w-[150px] lg:max-w-[240px] text-base font-medium leading-tight text-primary-navy sm:text-lg md:text-base lg:text-xl">
              Solid Foundation<br />in Every Grain
            </p>
          </div>
          <div className="self-start rounded-full bg-primary-navy px-4 py-2 text-xs sm:px-6 sm:py-2.5 sm:text-sm font-bold text-white transition-interactive group-hover:scale-105 md:px-4 md:py-2 md:text-xs lg:px-6 lg:py-2.5 lg:text-sm">
            {item.ctaLabel}
          </div>
        </div>
      );
    case "plaster-sand-category":
      return (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 pb-5 sm:p-5 md:p-4 lg:p-5 lg:pb-6">
          <div>
            <h3 className="text-lg font-bold text-primary-navy sm:text-xl md:text-base lg:text-xl xl:text-2xl">
              {item.title}
            </h3>
            <p className="mt-2 max-w-[100px] text-[0.55rem] font-bold leading-tight tracking-wider text-primary-navy uppercase sm:text-xs md:mt-2 md:text-[0.55rem] lg:mt-3 lg:text-[0.65rem] xl:text-xs">
              SMOOTH<br />FINISH.<br />PERFECT<br />TEXTURE.
            </p>
          </div>
          <div className="self-start rounded-full bg-primary-navy px-3 py-1.5 text-[0.65rem] font-bold text-white transition-interactive group-hover:scale-105 sm:px-5 sm:py-2 sm:text-xs md:px-3 md:py-1.5 md:text-[0.65rem] lg:px-5 lg:py-2 lg:text-xs">
            {item.ctaLabel}
          </div>
        </div>
      );
    case "granite-category":
      return (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-4 pb-5 sm:p-5 md:p-4 lg:p-5 lg:pb-6">
          <div>
            <h3 className="text-base font-bold uppercase tracking-wide text-white sm:text-lg md:text-sm lg:text-lg xl:text-xl">
              GRANITE (½ & ¾)
            </h3>
            <p className="mt-1 max-w-[100px] text-xs font-medium leading-tight text-white/95 sm:text-sm md:text-[0.65rem] lg:text-sm">
              Premium<br />Aggregates
            </p>
          </div>
          <div className="self-start rounded-full bg-surface-peach px-3 py-1.5 text-[0.6rem] sm:px-4 sm:py-2 sm:text-[0.65rem] font-bold text-secondary-orange transition-interactive group-hover:scale-105 md:px-3 md:py-1.5 md:text-[0.6rem] lg:px-4 lg:py-2 lg:text-xs">
            {item.ctaLabel}
          </div>
        </div>
      );
    default:
      return null;
  }
};

export function CategorySection({ section }: CategorySectionProps) {
  return (
    <section className="container-shell py-16 md:py-24">
      <div className="mb-12">
        <SectionHeading 
          lead="Shop Popular" 
          accent="Category" 
          actionLabel="View All" 
          actionHref="/materials"
        />
      </div>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-12 md:auto-rows-[180px] lg:auto-rows-[220px]">
        {section.items.map((item, index) => {
          // Custom Grid Mapping
          let gridClass = "md:col-span-4";
          if (item.id === "smart-building-materials") gridClass = "md:col-span-8 md:row-span-2";
          else if (item.id === "rebars-category") gridClass = "md:col-span-4 md:row-span-2";
          else if (item.id === "sharp-sand-category") gridClass = "md:col-span-6 md:row-span-1";
          else if (item.id === "plaster-sand-category") gridClass = "md:col-span-3 md:row-span-1";
          else if (item.id === "granite-category") gridClass = "md:col-span-3 md:row-span-1";

          return (
            <Reveal
              className={cn("group", gridClass)}
              delay={index * 0.06}
              key={item.id}
            >
              <motion.div
                className="h-full"
                transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                whileHover="hover"
                whileTap={{ scale: 0.992 }}
              >
                <Link
                  aria-label={item.title}
                  className="group relative block h-full overflow-hidden rounded-[28px] border border-white/70 shadow-[0_24px_60px_rgba(19,24,79,0.08)] transition-all duration-500 focus-visible:outline-none"
                  href={item.href}
                >
                  <motion.img
                    alt={item.title}
                    className="h-full min-h-[220px] w-full object-cover md:min-h-0"
                    src={item.cardImage}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    variants={{ hover: { scale: 1.06 } }}
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-50 group-hover:opacity-40 transition-opacity" />
                  {renderOverlay(item)}
                </Link>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

import { ChevronRight } from "lucide-react";
