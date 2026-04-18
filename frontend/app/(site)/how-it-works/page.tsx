import type { Metadata } from "next";
import { getProcurelyContent } from "@/lib/content";
import { TestimonialSection } from "@/components/home/testimonial-section";
import { ChevronDown, CloudUpload, Tag, FileText, Truck, Folder, Search, ShoppingCart, CreditCard, MapPin, ArrowUpRight, Users, Store } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "How It Works | Procurely",
  description: "Learn how Procurely makes building materials procurement effortless. Upload BOQs, order online, and manage documents.",
};

export default async function HowItWorksPage() {
  const content = await getProcurelyContent();

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-[#fcfcfc] py-4 border-b border-slate-50">
        <div className="container-shell mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[14px] text-slate-400 font-medium">
            Home  /  Pages  /  <span className="text-slate-900 font-bold">How It Works</span>
          </p>
        </div>
      </div>

      {/* Hero Header area - Full Width */}
      <section className="relative overflow-hidden bg-[#13184f] py-24 text-center text-white">
        <div className="absolute inset-0 bg-[url('/assets/design/hero-kitchen.png')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay"></div>
        <div className="container-shell relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-[48px] sm:text-[72px] font-extrabold tracking-tight leading-[1.1] mb-12">
              Procurement made<br />effortless.
            </h1>
            <div className="flex flex-wrap justify-center gap-4 mb-20">
              <Link href="#boq-flow" className="flex items-center gap-3 rounded-[8px] bg-[#020617] border border-white/5 px-10 py-5 text-[18px] font-bold text-white transition-all hover:bg-black">
                <ArrowUpRight className="size-5" />
                Explore BOQ Flow
              </Link>
              <Link href="/materials" className="flex items-center gap-3 rounded-[8px] bg-[#ff4d00] px-10 py-5 text-[18px] font-bold text-white transition-all hover:bg-[#e64500]">
                <ArrowUpRight className="size-5" />
                Online Shopping
              </Link>
            </div>
            
            <div className="w-full h-[1px] bg-white opacity-40 mb-12" />

            <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
              <div className="flex flex-col items-center">
                <p className="text-[36px] font-extrabold tracking-tight">500+</p>
                <p className="text-[14px] text-white font-medium">Verified Suppliers</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[36px] font-extrabold tracking-tight">24h</p>
                <p className="text-[14px] text-white font-medium">Average Quote Time</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[36px] font-extrabold tracking-tight">15%</p>
                <p className="text-[14px] text-white font-medium">Cost Savings</p>
              </div>
              <div className="flex flex-col items-center">
                <p className="text-[36px] font-extrabold tracking-tight">10K+</p>
                <p className="text-[14px] text-white font-medium">Materials Listed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOQ Flow Section */}
      <section id="boq-flow" className="container-shell mx-auto px-4 py-24 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-[28px] font-extrabold text-[#1900ff]">BOQ Procurement Flow</h2>
            <p className="text-[16px] text-slate-500 font-medium leading-relaxed">For complex procurement needs, upload your Bill of Quantities and let our AI system handle the complex matching.</p>
          </div>
          <div className="hidden md:block">
             <div className="rounded-[8px] border border-blue-100 bg-blue-50 px-5 py-2 text-[14px] font-bold text-blue-700">
               For Enterprise
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-5 relative">
          {[
            { icon: CloudUpload, title: "1. Submit BOQ", desc: "Upload your existing BOQ document to our platform." },
            { icon: Search, title: "2. Pricing & Matching", desc: "Our AI analyzes and matches quantities with current pricing." },
            { icon: CreditCard, title: "3. Quote & Credit", desc: "Review your detailed quote and apply for construction credit." },
            { icon: Truck, title: "4. Order & Delivery", desc: "Confirm your order and track logistics in real time." },
            { icon: FileText, title: "5. Documentation", desc: "Automated invoices, receipts and compliance certificates." },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
               <div className="mb-6 flex size-16 items-center justify-center rounded-[12px] bg-[#13184f] text-white">
                  <step.icon className="size-6" />
               </div>
               <h3 className="mb-2 text-[18px] font-bold text-slate-900">{step.title}</h3>
               <p className="text-[14px] leading-relaxed text-slate-400 font-medium">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Intelligent Analyzer Graphic */}
        <div className="mt-32 grid grid-cols-1 items-center gap-16 lg:grid-cols-2 bg-[#f9fafb] rounded-[24px] p-12 border border-slate-100">
          <div>
            <h3 className="mb-6 text-[32px] font-extrabold text-slate-900 leading-tight">Intelligent BOQ Analysis</h3>
            <p className="mb-8 text-[16px] text-slate-500 font-medium leading-relaxed">Our AI extract every single line items from your BOQ and match them with verified suppliers.</p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="size-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">1</div>
                <div>
                   <p className="font-bold text-slate-900">Auto-Categorization</p>
                   <p className="text-[14px] text-slate-500">Automatically sorts line items into trade categories.</p>
                </div>
              </div>
              <Link href="#" className="font-bold text-[#1900ff] underline block mt-4">View Sample Report →</Link>
            </div>
          </div>
          <div className="bg-white rounded-[16px] border border-slate-100 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Matched Item</p>
                 <p className="text-[16px] font-bold text-slate-900">Steel Rebar 16mm</p>
               </div>
               <span className="rounded-full bg-emerald-100 px-3 py-1.5 text-[10px] font-medium text-emerald-700">Matched</span>
            </div>
            <div className="space-y-4">
               <div className="flex justify-between items-center bg-slate-50 p-4 rounded-[12px]">
                  <p className="font-bold text-slate-900">Quantity Matched</p>
                  <p className="font-bold text-slate-900">500 Tons</p>
               </div>
               <div className="flex justify-between items-center bg-slate-50 p-4 rounded-[12px]">
                  <p className="font-bold text-slate-900">Best Price Tag</p>
                  <p className="font-bold text-emerald-600">₦45,000</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Online Shopping Flow */}
      <section id="online-shopping" className="container-shell mx-auto px-4 py-24 sm:px-6 lg:px-8">
         <div className="mb-16">
            <h2 className="mb-4 text-[28px] font-extrabold text-slate-900">Online Shopping Flow</h2>
            <p className="text-[16px] text-slate-500 font-medium leading-relaxed max-w-2xl">Perfect for quick purchases, smaller projects, and immediate material needs. A familiar e-commerce experience tailored for construction.</p>
         </div>

         <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Search, title: "Browse Catalog", desc: "Browse thousands of materials with technical specs, and real-time stock and localized pricing." },
              { icon: ShoppingCart, title: "Build Your Cart", desc: "Add items, adjust quantities, and see estimated delivery dates for each supplier batch." },
              { icon: CreditCard, title: "See Checkout", desc: "Pay via card, bank transfer, or multiple payment options are multiple supported." },
              { icon: MapPin, title: "Site Delivery", desc: "Real-time GPS tracking for your materials. schedule offloading and site access for arrival." },
            ].map((step, i) => (
              <div key={i} className="rounded-[16px] bg-white border border-slate-100 p-8 shadow-sm transition-shadow hover:shadow-md">
                 <div className="mb-8 flex size-12 items-center justify-center rounded-[12px] bg-orange-50 text-orange-500">
                    <step.icon className="size-5" />
                 </div>
                 <h3 className="mb-4 text-[20px] font-bold text-slate-900">{step.title}</h3>
                 <p className="text-[14px] text-slate-500 font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
         </div>
      </section>

      {/* Experience Section */}
      <section id="demo" className="bg-[#1900ff] px-4 py-24 text-white sm:px-6 lg:px-8">
         <div className="container-shell mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
               <h2 className="mb-8 text-[36px] font-bold leading-tight md:text-[48px]">Experience Procurely In Action</h2>
               <p className="mb-12 text-[18px] text-white/90 font-medium">Get a personalized walkthrough of our platform tailored to your business needs and your site procurement needs.</p>
               <div className="space-y-8">
                  <div className="flex items-center gap-6">
                     <div className="size-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                        <FileText className="size-6" />
                     </div>
                     <div>
                        <p className="font-bold text-[20px]">Cost Analysis Demo</p>
                        <p className="text-white/80 text-[16px]">See real-time price comparisons across regions.</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <div className="size-16 rounded-full bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm">
                        <CloudUpload className="size-6" />
                     </div>
                     <div>
                        <p className="font-bold text-[20px]">Integration Capabilities</p>
                        <p className="text-white/80 text-[16px]">Connect with your existing ERP or accounting software.</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="rounded-[16px] bg-white p-10 text-slate-900 shadow-xl">
               <h3 className="mb-8 text-[28px] font-bold text-center">Request Interactive Demo</h3>
               <form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <input className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none" placeholder="First Name" />
                    <input className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none" placeholder="Last Name" />
                  </div>
                  <input className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none" placeholder="Work Email" />
                  <select className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none appearance-none text-slate-400">
                    <option>Company Type</option>
                  </select>
                  <select className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none appearance-none text-slate-400">
                    <option>Interested In</option>
                  </select>
                  <button className="w-full rounded-[8px] bg-[#0b103e] py-4 text-[16px] font-bold text-white mt-4 transition-all hover:bg-black">
                     Schedule Demo
                  </button>
                  <p className="text-center text-[10px] text-slate-400 font-medium">By submitting, you agree to our Terms and Privacy Policy.</p>
               </form>
            </div>
         </div>
      </section>

      {/* FAQ & Testimonials */}
      <section className="container-shell mx-auto px-4 py-24 sm:px-6 lg:px-8 max-w-4xl">
         <h2 className="mb-12 text-center text-[32px] font-bold text-slate-900">Frequently Asked Questions</h2>
         <div className="space-y-0 divide-y divide-slate-100 border-t border-slate-100">
          {content.faqs.map((faq, index) => (
             <details key={index} className="group overflow-hidden bg-white [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-slate-900">
                  <h3 className="text-[18px] font-bold">{faq.question}</h3>
                  <ChevronDown className="size-5 text-slate-400 transition-transform duration-300 group-open:-rotate-180" />
                </summary>
                <div className="pb-6 pt-0">
                  <p className="text-[16px] leading-relaxed text-slate-500 font-medium">{faq.answer}</p>
                </div>
             </details>
          ))}
        </div>
      </section>

      <TestimonialSection title="Trusted by modern construction teams" items={content.testimonials.items} />
    </div>
  );
}
