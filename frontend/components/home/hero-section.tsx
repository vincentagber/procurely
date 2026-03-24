import Link from "next/link";
import { ArrowUpRight, Headset, ShieldCheck, Truck } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
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

export function HeroSection({ hero, features }: HeroSectionProps) {
  return (
    <section id="how-it-works">
      <div className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
        />
        <div className="absolute inset-y-0 left-0 w-[58%] bg-[linear-gradient(90deg,rgba(22,14,10,0.95)_0%,rgba(22,14,10,0.88)_58%,rgba(22,14,10,0.22)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,15,14,0.56)_0%,rgba(21,15,14,0.32)_44%,rgba(21,15,14,0.08)_75%,rgba(21,15,14,0.02)_100%)]" />
        <div className="container-shell relative py-20 md:py-24 lg:py-28">
          <Reveal className="max-w-[520px]">
            <h1 className="font-display text-[3.4rem] uppercase leading-[0.88] tracking-[-0.06em] text-white md:text-[5rem] lg:text-[5.8rem]">
              {hero.title}
            </h1>
            <p className="mt-5 max-w-[420px] text-base leading-7 text-white/80">
              {hero.description}
            </p>
            <Link
              className="mt-8 inline-flex h-14 items-center gap-2 rounded-[18px] bg-[var(--color-brand-navy)] px-6 text-base font-semibold text-white transition hover:-translate-y-0.5"
              href={hero.ctaHref}
            >
              <ArrowUpRight className="size-5" />
              {hero.ctaLabel}
            </Link>
          </Reveal>
        </div>
      </div>

      <div className="container-shell">
        <div className="grid gap-6 py-9 md:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon];

            return (
              <Reveal className="text-center" delay={index * 0.08} key={feature.title}>
                <div className="inline-flex size-14 items-center justify-center rounded-full bg-[var(--color-brand-accent)]/12 text-[var(--color-brand-accent)]">
                  <Icon className="size-7" />
                </div>
                <h2 className="mt-4 text-[1.8rem] font-semibold tracking-[-0.04em] text-[var(--color-brand-navy)]">
                  {feature.title}
                </h2>
                <p className="text-slate-500">{feature.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
