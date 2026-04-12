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
    <section className="w-full bg-[#fde8df] py-16 md:py-24">
      <div className="container-shell">
        {title && (
          <Reveal>
            <h2 className="mb-12 text-center text-[1.8rem] font-bold tracking-tight text-[#0A1140] sm:mb-16 md:text-[2.2rem]">
              {title}
            </h2>
          </Reveal>
        )}

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 z-10 -ml-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all sm:-ml-6 ${!canScrollLeft ? "opacity-30 cursor-not-allowed" : "hover:scale-110 hover:text-[#1900ff]"}`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 z-10 -mr-4 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 shadow-sm transition-all sm:-mr-6 ${!canScrollRight ? "opacity-30 cursor-not-allowed" : "hover:scale-110 hover:text-[#1900ff]"}`}
            aria-label="Scroll right"
          >
            <ChevronRight className="size-5" />
          </button>

          {/* Carousel Container */}
          <div 
            ref={scrollRef}
            onScroll={checkScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-6"
          >
            {items.map((item, index) => (
              <Reveal
                className="w-full shrink-0 snap-center sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                delay={index * 0.1}
                key={item.id}
              >
                <article
                  className="relative flex h-full w-full flex-col items-center justify-between rounded-[8px] bg-white p-8 md:p-10"
                >
                  <div className="mb-6 flex justify-center gap-1.5 text-[#f59e0b]">
                    {Array.from({ length: item.rating || 5 }).map((_, i) => (
                      <Star key={i} className="size-5 fill-current" />
                    ))}
                  </div>
                  
                  <blockquote className="mb-8 flex-1 text-center text-[1rem] leading-[1.6] font-medium text-[#1E293B]">
                    "{item.quote}"
                  </blockquote>
                  
                  <div className="flex flex-col items-center">
                    <div className="relative mb-4 size-16 overflow-hidden rounded-full shadow-sm bg-slate-100">
                      <img
                        alt={`Avatar of ${item.name}`}
                        className="h-full w-full object-cover"
                        src={item.cardImage}
                      />
                    </div>
                    <div className="text-center">
                      <div className="text-[0.9rem] font-bold text-slate-400 uppercase tracking-wide">{item.name}</div>
                      <div className="text-[13px] font-medium text-slate-300 mt-1">{item.role}</div>
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
