"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { Reveal } from "@/components/ui/reveal";
import type { FaqItem } from "@/lib/types";

type FaqSectionProps = {
  faqs: FaqItem[];
};

export function FaqSection({ faqs }: FaqSectionProps) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="container-shell py-16 md:py-24" id="faq">
      <Reveal>
        <h2 className="text-center text-[2.4rem] font-semibold tracking-[-0.05em] text-[var(--color-brand-navy)] md:text-[3rem]">
          Frequently Asked Questions
        </h2>
      </Reveal>

      <div className="mx-auto mt-10 max-w-[760px] space-y-4">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <Reveal delay={index * 0.05} key={faq.question}>
              <div className="rounded-[20px] border border-slate-100 bg-white px-5 py-5 shadow-[0_18px_46px_rgba(19,24,79,0.05)]">
                <button
                  className="flex w-full items-center justify-between gap-6 text-left"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  type="button"
                >
                  <span className="text-lg font-semibold text-[var(--color-brand-navy)]">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`size-5 text-slate-500 transition ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="pt-4 text-sm leading-7 text-slate-500">
                        {faq.answer}
                      </p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
