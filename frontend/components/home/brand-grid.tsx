"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Reveal } from "@/components/ui/reveal";
import type { Brand } from "@/lib/types";

type BrandGridProps = {
  brands: Brand[];
};

export function BrandGrid({ brands }: BrandGridProps) {
  return (
    <section className="container-shell border-t border-slate-100 py-12 md:py-20">
      <Reveal>
        <h2 className="text-[1.5rem] font-bold uppercase tracking-[-0.02em] text-slate-400 sm:text-[1.8rem]">
          TRUSTED BY <span className="text-[var(--color-brand-blue)]">INDUSTRY LEADERS</span>
        </h2>
      </Reveal>
      
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:gap-8">
        {brands.map((brand) => (
          <Reveal key={brand.name} className="flex h-full w-full">
            <div className="flex w-full flex-col items-center justify-between border border-slate-100 bg-white p-5 h-[120px] transition-all hover:border-[var(--color-brand-blue)] hover:shadow-sm">
              {/* Logo Area - Centered and scaled responsibly */}
              <div className="relative flex-1 w-full flex items-center justify-center p-2">
                <div className="relative h-10 w-full">
                  <Image
                    alt={brand.name}
                    src={brand.logo}
                    fill
                    className="object-contain"
                    sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, 50vw"
                  />
                </div>
              </div>
              
              {/* Brand Label - Bold and dark */}
              <p className="text-[1.05rem] font-bold tracking-tight text-slate-900">
                {brand.name}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
