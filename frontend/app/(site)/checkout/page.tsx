import type { Metadata } from "next";
import { getProcurelyContent } from "@/lib/content";
import { TestimonialSection } from "@/components/home/testimonial-section";
import { ChevronDown } from "lucide-react";
import { CheckoutPageClient } from "./checkout-client";

export const metadata: Metadata = {
  title: "Checkout | Procurely",
  description: "Complete your online building materials procurement on Procurely.",
};

export default async function CheckoutPage() {
  const content = await getProcurelyContent();

  return (
    <div className="bg-[#f6f7fd]">
      <div className="container-shell mx-auto px-4 py-6 sm:px-6">
        <p className="text-sm font-medium text-slate-400">
          Home <span className="mx-2">/</span> pages <span className="mx-2">/</span> product <span className="mx-2">/</span> view cart <span className="mx-2">/</span> <span className="text-[#13184f] font-semibold">checkout</span>
        </p>
      </div>

      <CheckoutPageClient />

      <section className="container-shell my-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-[#13184f] sm:text-4xl">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {content.faqs.map((faq, index) => (
             <details key={index} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-[#1900ff]/30 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-4 p-6 text-[#13184f]">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-colors group-hover:bg-[#1900ff]/10 group-hover:text-[#1900ff]">
                    <ChevronDown className="size-5 transition duration-300 group-open:-rotate-180" />
                  </div>
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="leading-relaxed text-slate-600">
                    {faq.answer}
                  </p>
                </div>
             </details>
          ))}
        </div>
      </section>

      <div className="bg-[#fde8df] py-32 text-center border-t border-slate-100">
         <div className="container-shell mx-auto">
           <h2 className="mb-16 text-3xl font-extrabold text-[#13184f]">What Contractors Say</h2>
           <TestimonialSection title="" items={content.testimonials.items} />
         </div>
      </div>
    </div>
  );
}
