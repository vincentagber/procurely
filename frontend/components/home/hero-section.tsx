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
export function HeroSection({ hero, features }: HeroSectionProps) {
  const normalizedTitle = hero.title.toUpperCase();
  const titleSegments = normalizedTitle.split("DEVELOPERS.");
  const firstLine = titleSegments.length > 1 ? titleSegments[0].trim() : normalizedTitle;
  const trailingLine = titleSegments.length > 1 ? titleSegments[1].trim() : "";

  return (
    <section id="how-it-works" className="w-full bg-white">
      <div className="relative isolate overflow-hidden mx-auto w-full max-w-[1440px] h-[433px] bg-[#0A1140]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
        />

        <div className="absolute inset-0 w-full max-w-[1440px] mx-auto">
          <Reveal
            className="absolute top-1/2 -translate-y-1/2 left-5 xl:top-[103px] xl:translate-y-0 xl:left-[164px] w-[90%] max-w-[550px] xl:h-[228px] flex flex-col gap-[10px] z-10"
            distance={44}
          >
            <h1 className="flex flex-col gap-0 uppercase text-white w-full font-display">
              <span
                className="block font-bold tracking-tight"
                style={{ fontSize: '66.11px', lineHeight: '66.79px' }}
              >
                {firstLine}
              </span>
              <span
                className="flex items-baseline gap-x-[15px] mt-[-4px]"
                style={{ fontSize: '66.11px', lineHeight: '66.79px' }}
              >
                <span className="font-bold tracking-tight text-white whitespace-nowrap">
                  DEVELOPERS.
                </span>
                <span
                  className="font-normal tracking-tight text-white/95 whitespace-nowrap"
                  style={{ fontSize: '50px', lineHeight: '66.79px', fontWeight: 400 }}
                >
                  {trailingLine}
                </span>
              </span>
            </h1>
            <p className="max-w-[480px] text-[13px] leading-[1.6] text-white opacity-90 font-medium whitespace-pre-line">
              {hero.description}
            </p>
            <motion.div
              className="inline-flex"
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4, scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
            >
              <Link
                className="inline-flex h-[44px] items-center gap-[10px] rounded-[5px] bg-[#03001C] px-[#24px] text-[15px] font-bold text-white shadow-lg transition-interactive hover:bg-slate-900 pr-7 pl-6"
                href={hero.ctaHref}
              >
                <ArrowUpRight className="size-[18px] text-[#FFB6A0]" strokeWidth={2.5} />
                {hero.ctaLabel}
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
