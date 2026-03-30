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
            <h1 className="flex flex-col gap-0 uppercase text-white w-full max-w-[800px]">
              <span className="block font-medium text-[9vw] sm:text-5xl md:text-[60px] leading-[1.1] tracking-tight">
                {firstLine}
              </span>
              {trailingLine ? (
                <span className="flex flex-wrap items-center gap-x-4 leading-[1.1]">
                  <span className="font-black text-[10vw] sm:text-5xl md:text-[72px] tracking-tight">
                    DEVELOPERS.
                  </span>
                  <span className="font-light text-[9vw] sm:text-5xl md:text-[60px] tracking-tight opacity-90">
                    {trailingLine}
                  </span>
                </span>
              ) : null}
            </h1>
            <p className="mt-8 max-w-[520px] text-base sm:text-lg md:text-[16px] leading-relaxed text-white opacity-80 font-medium hidden sm:block">
              {hero.description}
            </p>
            <motion.div
              className="mt-10 inline-flex sm:mt-12 lg:mt-14"
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
            >
              <Link
                className="inline-flex h-12 items-center gap-3 rounded-[4px] bg-[#0b103e] px-8 text-sm font-black text-white shadow-xl transition-interactive hover:bg-[#1900ff]"
                href={hero.ctaHref}
              >
                <ArrowUpRight className="size-5" />
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
                  <div className="mb-4 text-[#ff6f4d] transition-transform group-hover:scale-110">
                    <Icon className="size-10" />
                  </div>
                  <h2 className="text-xl font-black tracking-tight text-[#13184f] mb-1">
                    {feature.title}
                  </h2>
                  <p className="text-[14px] font-medium text-slate-500">
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
