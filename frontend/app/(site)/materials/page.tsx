import React, { Suspense } from "react";
import type { Metadata } from "next";
import { getProcurelyContent } from "@/lib/content";
import { TestimonialSection } from "@/components/home/testimonial-section";
import { ChevronDown } from "lucide-react";
import { MaterialsClient } from "./materials-client";

export const metadata: Metadata = {
  title: "Shop Materials | Procurely",
  description: "Browse verified building materials with competitive pricing and reliable delivery.",
};

export default async function MaterialsPage() {
  const content = await getProcurelyContent();

  return (
    <div className="bg-[#f6f7fd]">
      {/* Breadcrumb Header */}
      <div className="container-shell mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm font-bold tracking-wide text-slate-400">
          Home <span className="mx-3 text-slate-300">/</span> Pages <span className="mx-3 text-slate-300">/</span> <span className="text-[#13184f]">Materials</span>
        </p>
      </div>

      <Suspense fallback={<div className="container-shell mx-auto px-4 py-32 text-center text-[#13184f] font-bold text-2xl">Loading catalog...</div>}>
         <MaterialsClient products={content.products} />
      </Suspense>

      {/* FAQ Section */}
      <section className="container-shell my-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-14 text-center text-4xl font-extrabold tracking-tight text-[#13184f]">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {content.faqs.map((faq, index) => (
             <details key={index} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-6 p-8 text-[#13184f]">
                  <h3 className="text-xl font-bold leading-snug pr-8">{faq.question}</h3>
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition-colors group-hover:bg-[#1900ff]/10 group-hover:text-[#1900ff]">
                    <ChevronDown className="size-6 transition-transform duration-300 group-open:-rotate-180" />
                  </div>
                </summary>
                <div className="px-8 pb-8 pt-0">
                  <p className="text-lg leading-relaxed text-slate-600 font-medium">
                    {faq.answer}
                  </p>
                </div>
             </details>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <div className="bg-[#fde8df] py-32 text-center border-t border-slate-100">
         <div className="container-shell mx-auto">
           <h2 className="mb-16 text-3xl font-extrabold text-[#13184f]">What Contractors Say</h2>
           <TestimonialSection title="" items={content.testimonials.items} />
         </div>
      </div>
    </div>
  );
}
