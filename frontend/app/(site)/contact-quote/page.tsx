import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, Mail, MapPin, Phone, Clock, UploadCloud, ChevronDown, CheckCircle2 } from "lucide-react";
import { getProcurelyContent } from "@/lib/content";
import { TestimonialSection } from "@/components/home/testimonial-section";

export const metadata: Metadata = {
  title: "Contact & BOQ Upload | Procurely",
  description: "Request a free quote for your architectural drawings or upload your BoQ for a detailed cost breakdown powered by our AI cost consultant.",
};

export default async function ContactQuotePage() {
  const content = await getProcurelyContent();

  return (
    <div className="bg-[#fcfcfc] min-h-screen">
      {/* Breadcrumbs */}
      <div className="bg-[#fcfcfc] py-4">
        <div className="container-shell mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[14px] text-slate-400 font-medium">
            Home  /  pages  /  <span className="text-slate-900 font-bold">Contact & Quote</span>
          </p>
        </div>
      </div>

      {/* Hero Header Area */}
      <section className="container-shell mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative overflow-hidden bg-[#13184f] rounded-[16px] py-24 text-center text-white">
          {/* <div className="absolute inset-0 bg-[url('/assets/design/hero-kitchen.png')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay"></div> */}
          <div className="relative z-10 max-w-4xl mx-auto">
            <h1 className="text-[44px] sm:text-[56px] font-extrabold tracking-tight leading-tight">
              Get your free quote<br />or <span className="text-[#3b82f6]">upload your BoQ</span>
            </h1>
            <p className="mt-6 mx-auto max-w-2xl text-[16px] text-slate-300 font-medium leading-relaxed">
              Get accurate pricing in minutes. Request a free quote for your structural and architectural drawings, or upload your BoQ to receive a detailed cost breakdown consultant fast, simple and reliable.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="container-shell mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center rounded-[12px] bg-white py-12 px-6 text-center ring-1 ring-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
             <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
               <Phone className="size-5" />
             </div>
             <h2 className="mb-1 text-[18px] font-bold text-slate-900">Call</h2>
             <p className="text-[16px] font-bold text-slate-900">+2348139259377</p>
             <p className="mt-1 text-[12px] text-slate-400 font-medium">Mon-Sat, 9am-6pm</p>
          </div>
          <div className="flex flex-col items-center rounded-[12px] bg-white py-12 px-6 text-center ring-1 ring-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
             <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
               <Mail className="size-5" />
             </div>
             <h2 className="mb-1 text-[18px] font-bold text-slate-900">Email</h2>
             <p className="text-[16px] font-bold text-slate-900">sales@procurely.com</p>
             <p className="mt-1 text-[12px] text-slate-400 font-medium">Response within 24h</p>
          </div>
          <div className="flex flex-col items-center rounded-[12px] bg-white py-12 px-6 text-center ring-1 ring-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
             <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
               <MapPin className="size-5" />
             </div>
             <h2 className="mb-1 text-[18px] font-bold text-slate-900">Visit Us</h2>
             <p className="text-[16px] font-bold text-slate-900">Lagos, Nigeria</p>
          </div>
          <div className="flex flex-col items-center rounded-[12px] bg-white py-12 px-6 text-center ring-1 ring-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md">
             <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
               <Clock className="size-5" />
             </div>
             <h2 className="mb-1 text-[18px] font-bold text-slate-900">Working Hours</h2>
             <p className="text-[16px] font-bold text-slate-900">Mon - Sat: 9am - 6pm</p>
             <p className="mt-1 text-[12px] text-slate-400 font-medium">Sun: Closed</p>
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="container-shell mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          
          {/* Quote Form */}
          <div className="rounded-[12px] border border-slate-100 bg-white p-10 shadow-sm">
            <h2 className="mb-8 text-[28px] font-bold text-slate-900">Get a free quote in <span className="text-[#1900ff]">minutes</span></h2>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" placeholder="First Name" type="text" />
                <input className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" placeholder="Last Name" type="text" />
              </div>
              <input className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" placeholder="Email Address" type="email" />
              <input className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" placeholder="Phone Number" type="tel" />
              <div className="relative">
                <select className="w-full appearance-none rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] text-slate-400 outline-none transition-all focus:border-[#1900ff]">
                  <option value="">Select Project Type</option>
                  <option value="residential">Residential Development</option>
                  <option value="commercial">Commercial Building</option>
                </select>
                <ChevronDown className="absolute right-5 top-4 size-4 text-slate-400 pointer-events-none" />
              </div>
              <textarea className="h-32 w-full resize-none rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" placeholder="Describe your projects and materials needs..." />
              
              <button className="w-full rounded-[8px] bg-[#0b103e] py-4 text-[16px] font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]" type="button">
                Get quote
              </button>
              <p className="text-center text-[12px] font-medium text-slate-400">
                By submitting, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </div>

          {/* BoQ Upload Form */}
          <div className="rounded-[12px] border border-slate-100 bg-white p-10 shadow-sm">
             <h2 className="mb-2 text-[28px] font-bold text-slate-900 leading-tight">Generate your free BoQ with <span className="text-[#1900ff]">Procurely's AI</span> cost consultant</h2>
             <p className="mb-8 text-[14px] text-slate-500 font-medium">Extract your structural and architectural drawings, and our AI-cost consultant will generate a detailed and reasonably competitive pricing within 24 hours.</p>
             
             <form className="space-y-4">
                <div className="group rounded-[8px] border-2 border-dashed border-slate-200 bg-[#f9fafb] py-12 text-center transition-colors hover:border-[#1900ff]">
                  <UploadCloud className="mx-auto mb-3 size-8 text-slate-400" />
                  <p className="text-[14px] font-bold text-slate-900">Drag & Drop your structural and architectural drawings flat here</p>
                  <p className="text-[12px] text-slate-400">or click to browse</p>
                  <p className="mt-2 text-[10px] text-slate-300">Supports: XLSX, PDF, CSV (max 25MB)</p>
                </div>

                <input className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" placeholder="Company Name" type="text" />
                <input className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" placeholder="Project Name" type="text" />
                <input className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" placeholder="Email Address" type="email" />
                
                <div className="flex items-center gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input className="size-4 accent-[#1900ff]" type="radio" name="speed" value="standard" defaultChecked />
                    <span className="text-[13px] font-medium text-slate-600 underline underline-offset-4 decoration-slate-200">Standard (24-48h)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input className="size-4 accent-[#1900ff]" type="radio" name="speed" value="urgent" />
                    <span className="text-[13px] font-medium text-slate-600 underline underline-offset-4 decoration-slate-200">Urgent (Same day)</span>
                  </label>
                </div>

                <button className="w-full rounded-[8px] bg-[#0b103e] py-4 text-[16px] font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98]" type="button">
                  Get free BoQ
                </button>
                <p className="text-center text-[10px] text-slate-300 font-medium">
                  Your data is secure and only shared with verified suppliers.
                </p>
             </form>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="container-shell mx-auto px-4 sm:px-6 lg:px-8 mb-32">
        <div className="rounded-[12px] bg-[#1900ff] px-6 py-24 text-center text-white sm:px-12 flex flex-col items-center">
          <h2 className="mb-4 text-[36px] font-bold tracking-tight md:text-[48px]">
            Need help choosing materials?
          </h2>
          <p className="mb-10 text-[18px] text-white/90 font-medium">
            Our procurement experts are available Mon–Sat to guide your project.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
             <Link href="/materials" className="w-[180px] rounded-[8px] bg-slate-900 py-4 text-[16px] font-bold text-white transition-all hover:bg-black">
               Browse Materials
             </Link>
             <Link href="/how-it-works" className="w-[180px] rounded-[8px] bg-[#ff4d00] py-4 text-[16px] font-bold text-white transition-all hover:bg-[#e64500]">
               See How It Works
             </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-shell mx-auto px-4 sm:px-6 lg:px-8 mb-32 max-w-4xl">
        <h2 className="mb-12 text-center text-[32px] font-bold text-slate-900">Frequently Asked Questions</h2>
        <div className="space-y-0 divide-y divide-slate-100 border-t border-slate-100">
          {content.faqs.map((faq, index) => (
             <details key={index} className="group overflow-hidden bg-white [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex cursor-pointer items-center justify-between gap-6 py-6 text-slate-900">
                  <h3 className="text-[18px] font-bold">{faq.question}</h3>
                  <ChevronDown className="size-5 text-slate-400 transition-transform duration-300 group-open:-rotate-180" />
                </summary>
                <div className="pb-6 pt-0">
                  <p className="text-[16px] leading-relaxed text-slate-500 font-medium">
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
