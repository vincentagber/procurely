import type { Metadata } from "next";
import { getProcurelyContent } from "@/lib/content";
import { TestimonialSection } from "@/components/home/testimonial-section";
import { ChevronDown, CloudUpload, Tag, FileText, Truck, Folder, Search, ShoppingCart, CreditCard, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "How It Works | Procurely",
  description: "Learn how Procurely makes building materials procurement effortless. Upload BOQs, order online, and manage documents.",
};

export default async function HowItWorksPage() {
  const content = await getProcurelyContent();

  return (
    <div className="bg-[#f6f7fd]">
      {/* Hero Header */}
      <section className="bg-[#13184f] bg-[url('/assets/design/hero-kitchen.png')] bg-cover bg-center bg-no-repeat relative overflow-hidden">
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-[#0b103e]/90"></div>
        <div className="container-shell relative z-10 mx-auto px-4 py-28 text-center sm:px-6 lg:px-8">
           <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
             Procurement made effortless.
           </h1>
           <div className="mt-12 flex flex-wrap justify-center gap-6">
             <Link href="#boq-flow" className="flex items-center justify-center gap-3 rounded bg-white/10 border border-white/20 whitespace-nowrap px-8 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/20 hover:border-white/40 shadow-lg">
                <CloudUpload className="size-5" />
                Explore BOQ Flow
             </Link>
             <Link href="#online-shopping" className="flex items-center justify-center gap-3 rounded bg-[#ff6f4d] whitespace-nowrap px-8 py-4 font-semibold text-white shadow-lg transition hover:bg-[#ff8466]">
                <ShoppingCart className="size-5" />
                Online Shopping
             </Link>
           </div>
        </div>
        <div className="container-shell relative z-10 mx-auto border-t border-white/10 px-4 py-10 sm:px-6">
           <div className="grid grid-cols-2 gap-8 text-center text-white md:grid-cols-4 divide-x divide-white/10">
              <div>
                 <p className="text-4xl font-bold tracking-tight">500+</p>
                 <p className="mt-2 text-sm font-medium text-white/70">Verified Suppliers</p>
              </div>
              <div>
                 <p className="text-4xl font-bold tracking-tight">24h</p>
                 <p className="mt-2 text-sm font-medium text-white/70">Average Quote Time</p>
              </div>
              <div>
                 <p className="text-4xl font-bold tracking-tight">15%</p>
                 <p className="mt-2 text-sm font-medium text-white/70">Cost Savings</p>
              </div>
              <div>
                 <p className="text-4xl font-bold tracking-tight">10K+</p>
                 <p className="mt-2 text-sm font-medium text-white/70">Materials Listed</p>
              </div>
           </div>
        </div>
      </section>

      {/* BOQ Flow */}
      <section id="boq-flow" className="container-shell mx-auto px-4 py-24 sm:px-6 lg:px-8">
         <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
               <h2 className="mb-4 text-4xl font-bold text-[#1900ff]">BOQ Procurement Flow</h2>
               <p className="text-lg text-slate-600 leading-relaxed">Designed for contractors, developers, and large-scale projects. Upload your Bill of Quantities and let our system handle the complex matching.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded bg-blue-50 px-5 py-2.5 text-sm font-bold text-blue-700 shadow-sm">
               <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
               For Enterprise
            </div>
         </div>

         <div className="grid grid-cols-1 gap-8 md:grid-cols-5 relative">
            {/* Connecting line */}
            <div className="absolute top-10 left-10 right-10 h-0.5 bg-slate-200 hidden md:block z-0"></div>

            {[
              { icon: CloudUpload, title: "1. Submit BOQ", desc: "Upload your Excel or PDF BOQ. Our AI parses line items." },
              { icon: Tag, title: "2. Pricing & Matching", desc: "System matches items with verified suppliers for best pricing." },
              { icon: FileText, title: "3. Invoice & Credit", desc: "Review consolidated invoices and apply for credit terms." },
              { icon: Truck, title: "4. Order & Delivery", desc: "Track multi-supplier shipments in one unified dashboard." },
              { icon: Folder, title: "5. Documentation", desc: "Access warranties, certificates, and compliance docs." },
            ].map((step, i) => (
              <div key={i} className="text-center relative z-10 group">
                 <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-2xl bg-[#0b103e] text-white shadow-[0_8px_30px_rgb(11,16,62,0.3)] transition transform group-hover:-translate-y-2">
                    <step.icon className="size-8" />
                 </div>
                 <h3 className="mb-3 text-lg font-bold text-[#13184f]">{step.title}</h3>
                 <p className="text-sm leading-relaxed text-slate-500 max-w-[200px] mx-auto">{step.desc}</p>
              </div>
            ))}
         </div>

         <div className="mt-32 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <div>
               <h3 className="mb-8 text-3xl font-bold text-[#13184f]">Intelligent BOQ Analysis</h3>
               <div className="space-y-8">
                  <div className="flex gap-4">
                     <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0 mt-1">
                        <span className="font-bold">1</span>
                     </div>
                     <div>
                        <p className="text-xl font-bold text-[#13184f] mb-2">Auto-Categorization</p>
                        <p className="text-slate-600 leading-relaxed">Our AI automatically sorts thousands of line items into trade categories, instantly structuring unstructured data.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0 mt-1">
                        <span className="font-bold">2</span>
                     </div>
                     <div>
                        <p className="text-xl font-bold text-[#13184f] mb-2">Smart Substitution</p>
                        <p className="text-slate-600 leading-relaxed">Suggests in-stock alternatives for out-of-stock specifications to ensure zero delays.</p>
                     </div>
                  </div>
                  <div className="flex gap-4">
                     <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0 mt-1">
                        <span className="font-bold">3</span>
                     </div>
                     <div>
                        <p className="text-xl font-bold text-[#13184f] mb-2">Bulk Negotiations</p>
                        <p className="text-slate-600 leading-relaxed">Automatically requests bulk discounts from suppliers for large volumes on your behalf.</p>
                     </div>
                  </div>
                  <Link href="#" className="inline-flex items-center gap-2 font-bold text-[#1900ff] hover:text-[#0b103e] pt-4 transition">
                     View Sample Report <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                  </Link>
               </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
               <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
                  <div>
                     <p className="mb-1 text-xs font-bold tracking-widest text-slate-400">PROJECT</p>
                     <p className="text-xl font-bold text-[#13184f]">Skyline Tower - Phase 1</p>
                  </div>
                  <span className="rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700">Matched</span>
               </div>
               <div className="space-y-6">
                 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                    <div>
                       <p className="font-bold text-[#13184f]">Cement (Grade 53)</p>
                       <p className="text-sm text-slate-500">5000 Bags</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-bold text-[#13184f]">$42,500</p>
                       <p className="text-xs font-semibold text-emerald-600">3 Suppliers</p>
                    </div>
                 </div>
                 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                    <div>
                       <p className="font-bold text-[#13184f]">Steel Rebar 12mm</p>
                       <p className="text-sm text-slate-500">25 Tons</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-bold text-[#13184f]">$18,200</p>
                       <p className="text-xs font-semibold text-emerald-600">3 Suppliers</p>
                    </div>
                 </div>
                 <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-orange-100">
                    <div>
                       <p className="font-bold text-[#13184f]">200 Buckets</p>
                       <p className="text-sm text-slate-500">Exterior Paint</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-bold text-orange-500">Searching...</p>
                       <p className="text-xs font-semibold text-slate-400">Pending Quotes</p>
                    </div>
                 </div>
               </div>
            </div>
         </div>
      </section>

      {/* Online Shopping Flow */}
      <section id="online-shopping" className="container-shell mx-auto border-t border-slate-200 px-4 py-24 sm:px-6 lg:px-8">
         <div className="mb-16 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
               <h2 className="mb-4 text-4xl font-bold text-[#13184f]">Online Shopping Flow</h2>
               <p className="text-lg text-slate-600 leading-relaxed">Perfect for quick purchases, smaller projects, and immediate material needs. A familiar e-commerce experience tailored for construction.</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded bg-orange-50 px-5 py-2.5 text-sm font-bold text-orange-600 shadow-sm">
               <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
               For Individuals & SMEs
            </div>
         </div>

         <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { num: "01", icon: Search, title: "Browse Catalog", desc: "Explore thousands of materials with technical specs, real-time stock, and localized pricing." },
              { num: "02", icon: ShoppingCart, title: "Build Your Cart", desc: "Add items, adjust quantities, and see estimated delivery dates for each supplier batch." },
              { num: "03", icon: CreditCard, title: "See Checkout", desc: "Pay via card, bank transfer, or apply your company credit line. Multiple options supported." },
              { num: "04", icon: MapPin, title: "Site Delivery", desc: "Real-time GPS tracking for your materials. Schedule offloading and manage site access." },
            ].map((step, i) => (
              <div key={i} className="group relative overflow-hidden rounded-3xl bg-white p-8 shadow-[0_4px_20px_rgb(0,0,0,0.03)] ring-1 ring-slate-100 transition hover:shadow-[0_10px_40px_rgb(0,0,0,0.08)]">
                 <div className="absolute -right-4 -top-4 text-8xl font-black text-slate-50 transition group-hover:scale-110">{step.num}</div>
                 <div className="relative z-10">
                    <div className="mb-8 flex size-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition">
                       <step.icon className="size-6" />
                    </div>
                    <h3 className="mb-4 text-xl font-bold text-[#13184f]">{step.title}</h3>
                    <p className="text-slate-600 leading-relaxed min-h-[100px]">{step.desc}</p>
                 </div>
              </div>
            ))}
         </div>
      </section>

      {/* Experience Section */}
      <section className="bg-[#1900ff] px-4 py-24 text-white sm:px-6 lg:px-8 relative overflow-hidden">
         {/* Background pattern */}
         <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
         
         <div className="container-shell mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 relative z-10">
            <div>
               <h2 className="mb-6 text-4xl font-bold leading-tight lg:text-5xl">Experience Procurely in Action</h2>
               <p className="mb-12 text-lg text-white/80 leading-relaxed">Get a personalized walkthrough of our platform tailored to your business needs. See how we can reduce your procurement time by 60%.</p>
               <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                     <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-[#1900ff] shadow-lg transition group-hover:scale-110">
                        <FileText className="size-6" />
                     </div>
                     <div>
                        <h4 className="text-xl font-bold mb-2">Cost Analysis Demo</h4>
                        <p className="text-white/70 leading-relaxed">See real-time price comparisons across regions.</p>
                     </div>
                  </div>
                  <div className="flex items-start gap-6 group">
                     <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-[#ffccbb] text-[#13184f] shadow-lg transition group-hover:scale-110">
                        <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                     </div>
                     <div>
                        <h4 className="text-xl font-bold mb-2">Integration Capabilities</h4>
                        <p className="text-white/70 leading-relaxed">Connect with your existing ERP or accounting software.</p>
                     </div>
                  </div>
               </div>
            </div>
            
            <div className="rounded-3xl bg-white p-10 text-[#13184f] shadow-2xl">
               <h3 className="mb-8 text-3xl font-bold">Request Interactive Demo</h3>
               <form className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                     <div>
                        <label className="mb-2 block text-sm font-bold text-slate-600">First Name</label>
                        <input className="w-full rounded-lg bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition focus:border-slate-400 focus:bg-white" type="text" placeholder="John" />
                     </div>
                     <div>
                        <label className="mb-2 block text-sm font-bold text-slate-600">Last Name</label>
                        <input className="w-full rounded-lg bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition focus:border-slate-400 focus:bg-white" type="text" placeholder="Doe" />
                     </div>
                  </div>
                  <div>
                     <label className="mb-2 block text-sm font-bold text-slate-600">Work Email</label>
                     <input className="w-full rounded-lg bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition focus:border-slate-400 focus:bg-white" type="email" placeholder="john@company.com" />
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                       <label className="mb-2 block text-sm font-bold text-slate-600">Company Type</label>
                       <select className="w-full rounded-lg bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition focus:border-slate-400 focus:bg-white appearance-none">
                          <option>Select type</option>
                          <option>Contractor</option>
                          <option>Developer</option>
                          <option>Individual</option>
                       </select>
                    </div>
                    <div>
                       <label className="mb-2 block text-sm font-bold text-slate-600">Interested In</label>
                       <select className="w-full rounded-lg bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition focus:border-slate-400 focus:bg-white appearance-none">
                          <option>Select interest</option>
                          <option>BOQ Uploads</option>
                          <option>Credit Lines</option>
                          <option>Marketplace</option>
                       </select>
                    </div>
                  </div>
                  <button className="mt-8 w-full rounded-lg bg-[#0b103e] py-5 text-lg font-bold text-white shadow-[0_8px_20px_rgba(11,16,62,0.3)] transition hover:bg-[#13184f] hover:-translate-y-1" type="button">
                     Schedule Demo
                  </button>
                  <p className="text-center text-sm font-medium text-slate-500">By submitting, you agree to our <Link href="#" className="text-[#13184f] underline">Terms of Service</Link> and <Link href="#" className="text-[#13184f] underline">Privacy Policy</Link>.</p>
               </form>
            </div>
         </div>
      </section>

      {/* FAQ & Testimonials */}
      <section className="container-shell mx-auto px-4 py-24 sm:px-6 lg:px-8">
         <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-center text-4xl font-bold tracking-tight text-[#13184f]">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {content.faqs.map((faq, index) => (
                 <details key={index} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:shadow-md [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 p-8 text-[#13184f]">
                      <h3 className="text-xl font-bold">{faq.question}</h3>
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-slate-50 text-slate-500 transition-colors group-hover:bg-[#1900ff]/10 group-hover:text-[#1900ff]">
                        <ChevronDown className="size-6 transition duration-300 group-open:-rotate-180" />
                      </div>
                    </summary>
                    <div className="px-8 pb-8 pt-0">
                      <p className="leading-relaxed text-slate-600 text-lg">
                        {faq.answer}
                      </p>
                    </div>
                 </details>
              ))}
            </div>
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
