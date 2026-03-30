"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Headset, ShieldCheck, Truck } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/format";
import type { SiteContent } from "@/lib/types";

type HeroSectionProps = {
  hero: SiteContent["hero"];
  features: SiteContent["features"];
};

const iconMap = {
  truck: Truck,
  shield: ShieldCheck,
  headset: Headset,
} as const;

const heroShellClassName =
  "mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:px-8 xl:px-10";

export function HeroSection({ hero, features }: HeroSectionProps) {
  const normalizedTitle = hero.title.toUpperCase();
  const titleSegments = normalizedTitle.split("DEVELOPERS.");
  const firstLine =
    titleSegments.length > 1 ? titleSegments[0].trim() : normalizedTitle;
  const trailingLine =
    titleSegments.length > 1 ? titleSegments[1].trim() : "";
  const descriptionTail = "and reliable delivery.";
  const descriptionLead = hero.description.endsWith(descriptionTail)
    ? hero.description.slice(0, -descriptionTail.length).trim()
    : hero.description;

  return (
    <section id="how-it-works">
      <div className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
        />
        <div className="absolute inset-y-0 left-0 w-[88%] bg-[linear-gradient(90deg,rgba(23,13,8,0.72)_0%,rgba(23,13,8,0.54)_34%,rgba(23,13,8,0.2)_58%,rgba(23,13,8,0.02)_86%)] sm:w-[72%] lg:w-[58%] xl:w-[52%]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(14,9,7,0.22)_0%,rgba(14,9,7,0.12)_18%,rgba(14,9,7,0.02)_42%,rgba(14,9,7,0)_62%)]" />
        <div
          className={cn(
            heroShellClassName,
            "relative flex min-h-[320px] items-center py-12 sm:min-h-[390px] sm:py-14 md:min-h-[500px] md:py-16 lg:min-h-[575px] lg:py-18",
          )}
        >
          <Reveal className="max-w-[520px]" distance={44}>
            <h1 className="flex flex-col gap-[1.5px] uppercase text-white w-full max-w-[550px]">
              <span className="block font-black text-[10vw] sm:text-5xl md:text-[52px] leading-[1.05] tracking-tight">
                {firstLine}
              </span>
              {trailingLine ? (
                <span className="flex flex-wrap items-center gap-x-[6px] gap-y-1 leading-[1.05] mt-0.5">
                  <span className="font-black text-[10vw] sm:text-5xl md:text-[52px] tracking-tight">
                    DEVELOPERS.
                  </span>
                  <span className="font-black text-[10vw] sm:text-5xl md:text-[52px] tracking-tight text-transparent [-webkit-text-stroke:1px_white] sm:[-webkit-text-stroke:1.5px_white] opacity-95">
                    {trailingLine}
                  </span>
                </span>
              ) : null}
            </h1>
            <p className="mt-6 max-w-[480px] text-base sm:text-lg md:text-[17px] leading-relaxed text-white/90 font-medium hidden sm:block">
              {hero.description}
            </p>
            <motion.div
              className="mt-7 inline-flex sm:mt-8 lg:mt-9"
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
            >
              <Link
                className="inline-flex h-14 items-center gap-2.5 rounded-[14px] bg-primary-navy px-6 text-[0.98rem] font-semibold text-white shadow-[0_26px_50px_rgba(19,24,79,0.24)] transition-interactive hover:bg-primary-navy-600 sm:h-[60px] sm:px-7 sm:text-[1rem] lg:h-[66px] lg:px-8 lg:text-[1.05rem]"
                href={hero.ctaHref}
              >
                <ArrowUpRight className="size-5 lg:size-6" />
                {hero.ctaLabel}
              </Link>
            </motion.div>
          </Reveal>
        </div>
      </div>

      <div className="container-shell">
        <div className="grid gap-8 py-10 sm:py-16 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];

            return (
              <Reveal className="text-center" delay={index * 0.08} key={feature.title}>
                <div className="flex flex-col items-center group">
                  <div className="mb-6 flex size-16 items-center justify-center rounded-full bg-white text-[#ff6f4d] shadow-[0_8px_30px_rgba(255,111,77,0.12)] transition-transform group-hover:scale-110">
                    <Icon className="size-8" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-[#13184f] mb-2 uppercase">
                    {feature.title}
                  </h2>
                  <p className="text-[15px] font-medium text-slate-500 max-w-[200px]">
                    {feature.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
