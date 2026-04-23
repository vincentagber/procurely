"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/format";
import type { SiteContent } from "@/lib/types";

type HeroSectionProps = {
  hero: SiteContent["hero"];
  features: SiteContent["features"];
};

const iconMap: Record<string, string> = {
  truck: "/assets/design/feature-truck.png",
  shield: "/assets/design/feature-shield.png",
  headset: "/assets/design/feature-headset.png",
};

const heroShellClassName =
  "mx-auto w-full max-w-[1440px] px-5 sm:px-6 lg:px-8 xl:px-10";
export function HeroSection({ hero, features = [] }: HeroSectionProps) {
  const normalizedTitle = (hero?.title || "").toUpperCase();
  const titleSegments = normalizedTitle.split("DEVELOPERS.");
  const firstLine = titleSegments.length > 1 ? titleSegments[0].trim() : normalizedTitle;
  const trailingLine = titleSegments.length > 1 ? titleSegments[1].trim() : "";

  return (
    <section id="how-it-works" className="w-full bg-white">
      <div className="relative isolate overflow-hidden mx-auto w-full max-w-[1440px] h-[320px] sm:h-[380px] lg:h-[433px] bg-[#0A1140]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero?.backgroundImage || ""})` }}
        />

        <div className="absolute inset-0 w-full max-w-[1440px] mx-auto bg-black/20 lg:bg-transparent">
          <Reveal
            className="absolute top-1/2 -translate-y-1/2 left-5 lg:top-[103px] lg:translate-y-0 lg:left-[164px] w-[90%] max-w-[550px] flex flex-col gap-3 lg:gap-[10px] z-10"
            distance={44}
          >
            <h1 className="flex flex-col gap-0 uppercase text-white w-full font-display">
              <span className="block font-bold tracking-tight text-[32px] sm:text-[48px] lg:text-[66.11px] leading-[1] lg:leading-[66.79px]">
                {firstLine}
              </span>
              <span className="flex flex-wrap items-baseline gap-x-3 lg:gap-x-[15px] mt-0 lg:mt-[-4px]">
                <span className="font-bold tracking-tight text-white whitespace-nowrap text-[32px] sm:text-[48px] lg:text-[66.11px] leading-[1] lg:leading-[66.79px]">
                  DEVELOPERS.
                </span>
                <span className="font-normal tracking-tight text-white/95 text-[24px] sm:text-[36px] lg:text-[50px] leading-[1] lg:leading-[66.79px] font-normal">
                  {trailingLine}
                </span>
              </span>
            </h1>
            <p className="max-w-[480px] text-[11px] sm:text-[13px] leading-[1.6] text-white opacity-90 font-medium whitespace-pre-line line-clamp-3 sm:line-clamp-none">
              {hero?.description || ""}
            </p>
            <motion.div
              className="inline-flex"
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
            >
              <Link
                className="inline-flex h-[38px] sm:h-[44px] items-center gap-[8px] lg:gap-[10px] rounded-[5px] bg-[#03001C] px-4 sm:px-[24px] text-[13px] sm:text-[15px] font-bold text-white shadow-lg transition-interactive hover:bg-slate-900"
                href={hero?.ctaHref || "/materials"}
              >
                <ArrowUpRight className="size-4 lg:size-[18px] text-[#FFB6A0]" strokeWidth={2.5} />
                {hero?.ctaLabel || "Shop"}
              </Link>
            </motion.div>
          </Reveal>
        </div>
      </div>

      <div className="container-shell bg-white">
        <div className="mx-auto max-w-[1100px] grid gap-6 py-10 my-6 border-b border-slate-100/80 md:grid-cols-3">
          {features.map((feature, index) => {
            const iconUrl = iconMap[feature.icon];

            return (
              <Reveal className="text-center" delay={index * 0.08} key={feature.title}>
                <div className="flex flex-col items-center group">
                  <div className="mb-3.5 transition-transform group-hover:scale-105 flex items-center justify-center">
                    <img src={iconUrl} alt={feature.title} className="h-[42px] w-auto" />
                  </div>
                  <h2 className="text-[17px] font-bold tracking-tight text-[#13184f] mb-1">
                    {feature.title}
                  </h2>
                  <p className="text-[13px] font-normal text-slate-500">
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
