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
    <section className="container-shell py-14 md:py-24" id="faq">
      <Reveal>
        <h2 className="text-center text-[1.9rem] font-semibold tracking-[-0.05em] text-[var(--color-brand-navy)] sm:text-[2.2rem] md:text-[3rem]">
          Frequently Asked Questions
        </h2>
      </Reveal>

      <div className="mx-auto mt-8 max-w-[760px] space-y-4 md:mt-10">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;

          return (
            <Reveal delay={index * 0.05} key={faq.question}>
              <motion.div
                className="rounded-[18px] border border-slate-100 bg-white px-4 py-4 shadow-[0_18px_46px_rgba(19,24,79,0.05)] transition-card-hover hover:-translate-y-0.5 hover:shadow-[0_22px_56px_rgba(19,24,79,0.08)] sm:rounded-[20px] sm:px-5 sm:py-5"
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  className="flex w-full items-center justify-between gap-6 text-left transition-interactive hover:text-primary-blue-500"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  type="button"
                >
                  <span className="text-base font-semibold text-[var(--color-brand-navy)] sm:text-lg">
                    {faq.question}
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <ChevronDown className="size-5 text-slate-500" />
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      className="overflow-hidden"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.p
                        className="pt-4 text-sm leading-6 text-slate-500 sm:leading-7"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18, delay: 0.03 }}
                      >
                        {faq.answer}
                      </motion.p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
