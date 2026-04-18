"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import type { Testimonial } from "@/lib/types";

type TestimonialSectionProps = {
  title?: string;
  items: Testimonial[];
};

export function TestimonialSection({
  title,
  items,
}: TestimonialSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [items]);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -scrollRef.current.clientWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: scrollRef.current.clientWidth, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-[#fcfcfc] py-24">
      <div className="container-shell mx-auto px-4">
        {title && (
          <Reveal>
            <h2 className="mb-16 text-center text-[28px] md:text-[32px] font-extrabold tracking-tight text-[#13184f]">
              {title}
            </h2>
          </Reveal>
        )}

        <div className="relative group">
          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute -left-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition-all md:-left-12 opacity-0 group-hover:opacity-100 ${!canScrollLeft ? "hidden" : "hover:border-[#13184f] hover:text-[#13184f] hover:scale-110"}`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute -right-4 top-1/2 z-10 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-100 bg-white text-slate-400 shadow-sm transition-all md:-right-12 opacity-0 group-hover:opacity-100 ${!canScrollRight ? "hidden" : "hover:border-[#13184f] hover:text-[#13184f] hover:scale-110"}`}
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Carousel Container */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, index) => (
              <Reveal
                className="w-full shrink-0 snap-center sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                delay={index * 0.1}
                key={item.id}
              >
                <article
                  className="flex h-full w-full flex-col rounded-[16px] bg-white p-10 shadow-[0_4px_30px_rgba(0,0,0,0.03)] ring-1 ring-slate-50 transition-shadow hover:shadow-[0_10px_40px_rgba(0,0,0,0.08)]"
                >
                  <div className="mb-8 flex gap-1 text-[#ff8c00]">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="size-4 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="mb-10 flex-1 text-left text-[16px] leading-[1.6] font-medium text-[#1e293b]">
                    "{item.quote}"
                  </blockquote>
                  
                  <div className="flex items-center gap-4 border-t border-slate-50 pt-8 mt-auto">
                    <div className="relative size-14 overflow-hidden rounded-full ring-2 ring-slate-50">
                      <img
                        alt={`Avatar of ${item.name}`}
                        className="h-full w-full object-cover"
                        src={item.cardImage}
                      />
                    </div>
                    <div>
                      <div className="text-[16px] font-bold text-slate-900">{item.name}</div>
                      <div className="text-[13px] font-medium text-slate-400">{item.role}</div>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
