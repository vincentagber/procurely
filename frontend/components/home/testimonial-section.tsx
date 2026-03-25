import "use client";
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
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 5px buffer
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
    <div className="relative mx-auto w-full max-w-[1400px]">
      {title && (
        <Reveal>
          <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-[var(--color-brand-navy)] sm:mb-16 sm:text-4xl md:text-[3rem]">
            {title}
          </h2>
        </Reveal>
      )}

      {/* Navigation Arrows */}
      {items.length > 3 && (
        <>
          <button
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={`absolute left-0 top-1/2 z-10 -ml-4 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-all sm:-ml-6 ${!canScrollLeft ? "opacity-30 cursor-not-allowed" : "hover:scale-110 hover:text-[#1900ff]"}`}
            aria-label="Scroll left"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={`absolute right-0 top-1/2 z-10 -mr-4 flex size-12 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-md transition-all sm:-mr-6 ${!canScrollRight ? "opacity-30 cursor-not-allowed" : "hover:scale-110 hover:text-[#1900ff]"}`}
            aria-label="Scroll right"
          >
            <ChevronRight className="size-6" />
          </button>
        </>
      )}

      {/* Carousel Container */}
      <div 
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-8 pt-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item, index) => (
          <Reveal
            className="w-full shrink-0 snap-center sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            delay={index * 0.1}
            key={item.id}
          >
            <motion.article
              className="group relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[24px] bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-slate-100 transition-shadow hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] sm:rounded-[28px]"
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
              
              <div className="mt-2 flex items-center justify-center gap-4">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-full shadow-sm">
                  <img
                    alt={`Avatar of ${item.name}`}
                    className="h-full w-full object-cover"
                    src={item.cardImage}
                  />
                </div>
                <cite className="not-italic text-left">
                  <div className="text-sm font-extrabold text-[var(--color-brand-navy)] leading-tight">{item.name}</div>
                  <div className="text-[13px] font-medium text-slate-500 mt-0.5">{item.role}</div>
                </cite>
              </div>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
