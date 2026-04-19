import type { Metadata } from "next";
import { getProcurelyContent } from "@/lib/content";
import { TestimonialSection } from "@/components/home/testimonial-section";
import { ChevronDown, CloudUpload, Tag, FileText, Receipt, Truck, Package, Folder, Search, ShoppingCart, CreditCard, MapPin, ArrowUpRight, Users, Store } from "lucide-react";
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
        <div className="mb-20 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div className="max-w-3xl">
            <h2 className="mb-6 text-[32px] font-extrabold text-[#1900ff] tracking-tight">BOQ Procurement Flow</h2>
            <p className="text-[18px] text-slate-700 font-medium leading-relaxed max-w-2xl">
              Designed for contractors, developers, and large-scale projects. Upload your Bill of Quantities and let our system handle the complex matching.
            </p>
          </div>
          <div className="hidden md:block pt-2">
             <div className="flex items-center gap-2 rounded-[8px] bg-blue-50/80 px-4 py-2.5 text-[14px] font-bold text-blue-600 ring-1 ring-blue-100/50">
               <span className="flex items-center justify-center">
                 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M12 15l-2 5l2 2l2-2l-2-5z"/><circle cx="12" cy="9" r="6"/><circle cx="12" cy="9" r="2"/></svg>
               </span>
               For Enterprise
             </div>
          </div>
        </div>

        <div className="mx-auto grid grid-cols-1 md:grid-cols-5 relative" style={{ maxWidth: '1120px', minHeight: '171.29px', gap: '40px', padding: '0px' }}>
          {[
            { icon: CloudUpload, title: "1. Submit BOQ", desc: "Upload your Excel or PDF BOQ. Our AI parses line items automatically." },
            { icon: Tag, title: "2. Pricing & Matching", desc: "System matches items with verified suppliers for best pricing." },
            { icon: Receipt, title: "3. Invoice & Credit", desc: "Review consolidated invoices and apply for credit terms instantly." },
            { icon: Truck, title: "4. Order & Delivery", desc: "Track multi-supplier shipments in one unified dashboard." },
            { icon: Folder, title: "5. Documentation", desc: "Access warranties, certificates, and compliance docs anytime." },
          ].map((step, i) => (
            <div key={i} className="flex flex-col items-center text-center">
               <div 
                 className="mb-6 flex items-center justify-center transition-all hover:scale-105"
                 style={{ 
                   width: '44.69px', 
                   height: '44.69px', 
                   backgroundColor: i === 0 ? '#04071E' : '#FFFFFF', 
                   borderRadius: '10.52px', 
                   padding: '13.14px',
                   boxShadow: '0px 7.89px 13.14px 5.26px rgba(0, 0, 0, 0.15)'
                 }}
               >
                  <step.icon className="h-full w-full" style={{ color: i === 0 ? '#FFFFFF' : '#04071E' }} />
               </div>
               <h3 className="mb-2 text-[18px] font-extrabold text-[#13184f] tracking-tight">{step.title}</h3>
               <p className="text-[14px] leading-tight text-black font-medium max-w-[200px]">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Intelligent Analyzer Graphic */}
        <div className="mt-32 grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          <div>
            <h3 className="mb-8 text-[32px] font-extrabold text-[#13184f] leading-tight">Intelligent BoQ Analysis</h3>
            
            <div className="space-y-8 mb-10">
              <div className="group">
                <p className="font-bold text-slate-900 text-[16px] mb-1">Auto-Categorization:</p>
                <p className="text-[14px] text-slate-500 font-medium leading-relaxed">Our AI automatically sorts thousands of line items into trade categories.</p>
              </div>

              <div className="group relative">
                <p className="font-bold text-slate-900 text-[16px] mb-1">Smart Substitution:</p>
                <p className="text-[14px] text-slate-500 font-medium leading-relaxed">Suggests in-stock alternatives for out-of-stock specifications.</p>
              </div>

              <div className="group">
                <p className="font-bold text-slate-900 text-[16px] mb-1">Bulk Negotiations:</p>
                <p className="text-[14px] text-slate-500 font-medium leading-relaxed">Automatically requests bulk discounts from suppliers for large volumes.</p>
              </div>
            </div>

            <Link href="#" className="inline-flex items-center gap-2 font-bold text-[#1900ff] hover:underline text-[16px]">
              View Sample Report <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="bg-white rounded-[12px] border border-slate-100 p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] ring-1 ring-slate-50">
              <div className="flex items-start justify-between mb-8">
                 <div>
                   <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Project</p>
                   <p className="text-[16px] font-extrabold text-[#13184f]">Skyline Tower - Phase 1</p>
                 </div>
                 <span className="rounded-full bg-orange-50 px-4 py-1.5 text-[11px] font-bold text-orange-600">Processing</span>
              </div>
              
              <div className="w-full h-[1px] bg-slate-100 mb-8" />

              <div className="space-y-8">
                 <div className="flex justify-between items-center group">
                    <div>
                      <p className="font-bold text-[#13184f] text-[14px]">Cement (Grade 53)</p>
                      <p className="text-[12px] text-slate-400 font-medium">5000 Bags</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-[14px]">$42,500</p>
                      <p className="text-[10px] text-emerald-500 font-bold">Matched (3 Suppliers)</p>
                    </div>
                 </div>

                 <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-[#13184f] text-[14px]">Steel Rebar 12mm</p>
                      <p className="text-[12px] text-slate-400 font-medium">25 Tons</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-slate-900 text-[14px]">$18,200</p>
                      <p className="text-[10px] text-emerald-500 font-bold">Matched (3 Suppliers)</p>
                    </div>
                 </div>

                 <div className="flex justify-between items-center opacity-60">
                    <div>
                      <p className="font-bold text-[#13184f] text-[14px]">Exterior Paint</p>
                      <p className="text-[12px] text-slate-400 font-medium">200 Buckets</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-orange-500 font-bold mb-1">Searching...</p>
                      <p className="text-[10px] text-slate-300 font-bold">Pending</p>
                    </div>
                 </div>
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
                  <div className="relative">
                    <select defaultValue="" className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none appearance-none text-slate-600 focus:border-blue-500 focus:bg-white transition-all">
                      <option value="" disabled>Company Type</option>
                      <option value="developer">Developer / Contractor</option>
                      <option value="architect">Architecture Firm</option>
                      <option value="supplier">Supplier / Manufacturer</option>
                      <option value="pro">Independent Professional</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  </div>

                  <div className="relative">
                    <select defaultValue="" className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none appearance-none text-slate-600 focus:border-blue-500 focus:bg-white transition-all">
                      <option value="" disabled>Interested In</option>
                      <option value="boq">BOQ Procurement Flow</option>
                      <option value="store">Online Materials Store</option>
                      <option value="credit">Credit & Financing</option>
                      <option value="logistics">Logistics & Shipping</option>
                      <option value="partnership">Partnership Opportunity</option>
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 size-4 text-slate-400 pointer-events-none" />
                  </div>
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

      <TestimonialSection 
        title={content.modernTestimonials.title} 
        items={content.modernTestimonials.items} 
        variant="modern"
      />
    </div>
  );
}
