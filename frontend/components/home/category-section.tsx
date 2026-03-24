"use client";

import Link from "next/link";
import { motion } from "framer-motion";

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

export function CategorySection({ section }: CategorySectionProps) {
  return (
    <section className="container-shell py-12 md:py-16">
      <SectionHeading
        actionHref="#explore-products"
        actionLabel={section.linkLabel}
        accent={section.eyebrowAccent}
        lead={section.eyebrowLead}
      />

      <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-12 md:auto-rows-[160px]">
        {section.items.map((item, index) => (
          <Reveal
            className={cn("group", variantClasses[item.variant])}
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
                className="group relative block h-full overflow-hidden rounded-[24px] border border-white/70 shadow-[0_24px_60px_rgba(19,24,79,0.08)] transition-card-hover focus-visible:outline-none focus-visible:shadow-focus sm:rounded-[30px]"
                href={item.href}
              >
                <motion.img
                  alt={item.title}
                  className="h-full min-h-[220px] w-full object-cover md:min-h-0"
                  src={item.cardImage}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  variants={{ hover: { scale: 1.045 } }}
                />
                <span className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(19,24,79,0.06)_100%)] opacity-90 transition-card-hover group-hover:opacity-100" />
                <span className="pointer-events-none absolute inset-x-6 bottom-5 h-px bg-white/70 opacity-0 transition-card-hover group-hover:opacity-100" />
                <span className="sr-only">
                  {item.title} {item.description} {item.ctaLabel}
                </span>
              </Link>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
