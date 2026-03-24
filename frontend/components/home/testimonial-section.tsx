"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import type { Testimonial } from "@/lib/types";

type TestimonialSectionProps = {
  title: string;
  items: Testimonial[];
};

export function TestimonialSection({
  title,
  items,
}: TestimonialSectionProps) {
  return (
    <section
      className="bg-[#fde8df]/80 py-16 md:py-24"
      id="contractors"
    >
      <div className="container-shell relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-[var(--color-brand-navy)] sm:mb-16 sm:text-4xl md:text-[3rem]">
            {title}
          </h2>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal
              className="flex"
              delay={index * 0.1}
              key={item.id}
            >
              <motion.article
                className="group relative flex w-full flex-col justify-between overflow-hidden rounded-[24px] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-slate-100 transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:rounded-[28px]"
                transition={{ duration: 0.3 }}
                whileHover="hover"
              >
                <div className="mb-6 flex justify-center gap-1 text-[#f59e0b]">
                  {Array.from({ length: item.rating || 5 }).map((_, i) => (
                    <Star key={i} className="size-5 fill-current" />
                  ))}
                </div>
                
                <blockquote className="mb-8 flex-1 text-center text-[15px] leading-relaxed text-slate-600 sm:text-base">
                  "{item.quote}"
                </blockquote>
                
                <div className="flex flex-col items-center">
                  <div className="relative mb-3 size-16 overflow-hidden rounded-full shadow-sm ring-4 ring-slate-50">
                    <img
                      alt={`Avatar of ${item.name}`}
                      className="h-full w-full object-cover"
                      src={item.cardImage}
                    />
                  </div>
                  <cite className="not-italic text-center">
                    <div className="text-base font-semibold text-[var(--color-brand-navy)]">{item.name}</div>
                    <div className="text-sm font-medium text-slate-500">{item.role}</div>
                  </cite>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
