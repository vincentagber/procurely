import type { Metadata } from "next";
import { ChevronDown, HelpCircle, MessageCircle, FileText, Truck, CreditCard, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Procurely",
  description: "Find answers to common questions about BoQ processing, material orders, phased deliveries, and structured financing.",
};

const faqCategories = [
  {
    title: "BoQ & Procurement",
    icon: FileText,
    faqs: [
      {
        question: "How long does it take to process my BoQ?",
        answer: "Standard BoQs are reviewed within 4 business hours. If you upload architectural drawings, our AI cost consultant typically generates a matched quote within 24 hours."
      },
      {
        question: "Can I upload drawings instead of a BoQ?",
        answer: "Yes! Procurely is designed for developers. You can upload your structural or architectural drawings, and we will extract the material requirements for you."
      },
      {
        question: "Are your prices truly competitive?",
        answer: "We source directly from manufacturers and Tier-1 distributors. By aggregating demand from multiple developers, we secure bulk pricing that is typically 10-15% lower than retail site prices."
      }
    ]
  },
  {
    title: "Payments & Credit",
    icon: CreditCard,
    faqs: [
      {
        question: "How does the 'Buy Now, Pay Later' work?",
        answer: "Eligible projects can spread the total material cost across four installments. This is interest-free for standard promotional periods, helping you maintain cash flow during the build."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept bank transfers, debit/credit cards via Paystack, and corporate purchase orders (for pre-approved institutional clients)."
      }
    ]
  },
  {
    title: "Logistics & Delivery",
    icon: Truck,
    faqs: [
      {
        question: "Do you deliver to construction sites outside Lagos?",
        answer: "Currently, we offer same-day and next-day delivery within Lagos. We are expanding to Ibadan and Abuja in Q3 2026. For bulk orders outside Lagos, please contact our logistics team directly."
      },
      {
        question: "How do you handle phased deliveries?",
        answer: "You can schedule your order based on project milestones. For example, have your rebars delivered this week and your cement batch next month. This prevents on-site spoilage and theft."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <div className="bg-[#f6f7fd] min-h-screen pb-32">
      {/* Header */}
      <section className="bg-[#13184f] pt-28 pb-44 text-center text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#1900ff 1px, transparent 1px), linear-gradient(90deg, #1900ff 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
         <div className="container-shell relative z-10 mx-auto px-4">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-7xl mb-6">How can we help?</h1>
            <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto font-medium">Search our frequent questions or choose a category below to find the answers you need.</p>
         </div>
      </section>

      {/* Main Content */}
      <div className="container-shell -mt-24 relative z-20 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12">
          
          {faqCategories.map((category, catIdx) => (
            <div key={catIdx} className="space-y-6">
              <div className="flex items-center gap-4 mb-8">
                 <div className="flex size-14 items-center justify-center rounded-2xl bg-[#1900ff] text-white shadow-lg shadow-[#1900ff]/20">
                    <category.icon className="size-7" />
                 </div>
                 <h2 className="text-2xl font-black text-[#13184f] uppercase tracking-wider">{category.title}</h2>
              </div>
              
              <div className="space-y-4">
                {category.faqs.map((faq, idx) => (
                   <details key={idx} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] [&_summary::-webkit-details-marker]:hidden">
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
            </div>
          ))}

          {/* Contact CTA */}
          <div className="mt-12 rounded-[2.5rem] bg-[#ff6f4d] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-[#ff6f4d]/30">
             <div className="absolute top-0 right-0 p-8 opacity-20">
                <HelpCircle className="size-48" />
             </div>
             <div className="relative z-10">
               <h2 className="text-3xl font-black mb-4">Still have questions?</h2>
               <p className="text-lg font-medium text-white/90 mb-10 max-w-2xl mx-auto">We're here to help! Our procurement experts are available Monday through Saturday to assist with your project needs.</p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/contact-quote" className="w-full sm:w-auto rounded-2xl bg-[#13184f] px-10 py-5 font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#0b103e]">
                    Contact Support
                  </Link>
                  <Link href="https://wa.me/1234567890" target="_blank" className="w-full sm:w-auto rounded-2xl bg-white px-10 py-5 font-bold text-[#13184f] shadow-lg transition hover:-translate-y-1 hover:bg-slate-50 flex items-center justify-center gap-2">
                    <MessageCircle className="size-5" />
                    Chat on WhatsApp
                  </Link>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
