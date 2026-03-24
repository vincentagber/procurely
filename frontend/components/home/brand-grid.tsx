"use client";

import { motion } from "framer-motion";

import { Reveal } from "@/components/ui/reveal";

type BrandGridProps = {
  brands: string[];
};

export function BrandGrid({ brands }: BrandGridProps) {
  return (
    <section className="container-shell border-t border-slate-100 py-12 sm:py-14 md:py-16">
      <Reveal>
        <h2 className="text-[1.45rem] font-semibold uppercase tracking-[-0.05em] text-slate-400 sm:text-[1.6rem] md:text-[1.8rem]">
          Trusted by <span className="text-[var(--color-brand-blue)]">industry leaders</span>
        </h2>
      </Reveal>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 md:mt-10 md:grid-cols-3 xl:grid-cols-6">
        {brands.map((brand, index) => (
          <Reveal delay={index * 0.04} key={brand}>
            <motion.div
              className="group rounded-[18px] border border-slate-100 bg-white px-4 py-5 text-center shadow-[0_16px_40px_rgba(19,24,79,0.04)] sm:rounded-[20px] sm:px-5 sm:py-6"
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6, scale: 1.015 }}
            >
              <p className="text-[1.55rem] font-semibold uppercase tracking-[-0.06em] text-slate-400 sm:text-[1.9rem]">
                {brand}
              </p>
              <p className="mt-3 text-sm font-semibold text-[var(--color-brand-navy)] transition-interactive group-hover:text-primary-blue-500">
                {brand}
              </p>
            </motion.div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
