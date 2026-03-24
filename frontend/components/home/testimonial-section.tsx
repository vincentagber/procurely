import { ArrowLeft, ArrowRight } from "lucide-react";

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
      className="bg-[var(--color-brand-peach)]/80 py-16 md:py-20"
      id="contractors"
    >
      <div className="container-shell relative">
        <Reveal>
          <h2 className="text-center text-[2.4rem] font-semibold tracking-[-0.05em] text-[var(--color-brand-navy)] md:text-[3rem]">
            {title}
          </h2>
        </Reveal>

        <button className="absolute left-0 top-1/2 hidden size-10 -translate-x-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg md:inline-flex">
          <ArrowLeft className="size-4" />
        </button>
        <button className="absolute right-0 top-1/2 hidden size-10 translate-x-1/2 items-center justify-center rounded-full bg-white/90 text-slate-700 shadow-lg md:inline-flex">
          <ArrowRight className="size-4" />
        </button>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {items.map((item, index) => (
            <Reveal className="overflow-hidden rounded-[28px]" delay={index * 0.05} key={item.id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img alt={`${item.name} testimonial`} className="w-full object-cover" src={item.cardImage} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
