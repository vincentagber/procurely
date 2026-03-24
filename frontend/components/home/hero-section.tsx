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
          <Reveal className="max-w-[640px] lg:max-w-[710px]" distance={44}>
            <h1 className="uppercase text-white">
              <span className="block font-display font-bold text-[2.35rem] leading-[0.9] tracking-[-0.05em] sm:text-[2.85rem] md:text-[4.15rem] lg:text-[5.35rem] xl:text-[6rem]">
                {firstLine}
              </span>
              {trailingLine ? (
                <span className="mt-0.5 block leading-[0.9]">
                  <span className="font-display font-bold text-[2.35rem] tracking-[-0.055em] sm:text-[2.85rem] md:text-[4.15rem] lg:text-[5.35rem] xl:text-[6rem]">
                    DEVELOPERS.
                  </span>{" "}
                  <span className="font-display text-[2.05rem] font-normal tracking-[-0.035em] text-white/96 sm:text-[2.45rem] md:text-[3.7rem] lg:text-[4.8rem] xl:text-[5.45rem]">
                    {trailingLine}
                  </span>
                </span>
              ) : null}
            </h1>
            <p className="mt-4 max-w-[540px] text-[0.95rem] leading-[1.55] text-white/82 sm:text-[1rem] md:mt-5 md:text-[1.04rem] lg:text-[1.08rem]">
              <span>{descriptionLead}</span>{" "}
              <span className="sm:block">{descriptionTail}</span>
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
        <div className="grid gap-6 py-8 sm:py-9 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];

            return (
              <Reveal className="text-center" delay={index * 0.08} key={feature.title}>
                <motion.div
                  className="group rounded-[24px] border border-border-subtle/80 bg-white px-5 py-6 shadow-card-soft sm:px-6"
                  transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ y: -8, scale: 1.015 }}
                >
                  <div className="inline-flex size-14 items-center justify-center rounded-full bg-[var(--color-brand-accent)]/12 text-[var(--color-brand-accent)] transition-card-hover group-hover:scale-105 group-hover:bg-[var(--color-brand-accent)]/16">
                    <Icon className="size-7" />
                  </div>
                  <h2 className="mt-4 text-[1.45rem] font-semibold tracking-[-0.04em] text-[var(--color-brand-navy)] sm:text-[1.6rem] lg:text-[1.8rem]">
                    {feature.title}
                  </h2>
                  <p className="text-sm text-slate-500 sm:text-base">
                    {feature.description}
                  </p>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
