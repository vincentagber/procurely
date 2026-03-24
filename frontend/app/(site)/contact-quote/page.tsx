import type { Metadata } from "next";
import { HelpCircle, Mail, MapPin, Phone, Clock, UploadCloud, ChevronDown } from "lucide-react";
import { getProcurelyContent } from "@/lib/content";
import { TestimonialSection } from "@/components/home/testimonial-section";

export const metadata: Metadata = {
  title: "Get a Free Quote or Upload BoQ | Procurely",
  description: "Request a free quote for your architectural drawings or upload your BoQ for a detailed cost breakdown powered by our AI cost consultant.",
  keywords: "quote, BoQ, procurement, construction materials, AI cost consultant, building materials",
  openGraph: {
    title: "Get a Free Quote or Upload BoQ | Procurely",
    description: "Request a free quote for your architectural drawings or upload your BoQ for a detailed cost breakdown powered by our AI cost consultant.",
    images: [{ url: "/assets/design/logo-light.png", width: 800, height: 600, alt: "Procurely Logo" }],
    type: "website",
  },
};

export default async function ContactQuotePage() {
  const content = await getProcurelyContent();

  return (
    <div className="bg-white">
      {/* Hero Header Area */}
      <section className="bg-[#13184f] px-4 py-20 text-center text-white">
        <h1 className="mx-auto max-w-3xl text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          Get your free quote<br />or <span className="text-[#1900ff]">upload your BoQ</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
          Get accurate pricing in minutes. Request a free quote for your structural and architectural drawings, or upload your BoQ to receive a detailed cost breakdown <span className="text-[#1900ff]">powered by our AI cost</span> consultant fast, simple, and reliable.
        </p>
      </section>

      {/* Contact Cards */}
      <section className="container-shell relative z-10 -mt-10 mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-slate-100 transition-transform hover:-translate-y-1">
             <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
               <Phone className="size-5" />
             </div>
             <h2 className="mb-1 text-lg font-bold text-[#13184f]">Call</h2>
             <p className="font-semibold text-slate-800">+8016-88888-9999</p>
             <p className="text-sm text-slate-500">Mon-Sat, 9am-6pm</p>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-slate-100 transition-transform hover:-translate-y-1">
             <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-500">
               <Mail className="size-5" />
             </div>
             <h2 className="mb-1 text-lg font-bold text-[#13184f]">Email</h2>
             <p className="font-semibold text-slate-800">sales@procurely.com</p>
             <p className="text-sm text-slate-500">Response within 24h</p>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-slate-100 transition-transform hover:-translate-y-1">
             <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
               <MapPin className="size-5" />
             </div>
             <h2 className="mb-1 text-lg font-bold text-[#13184f]">Visit Us</h2>
             <p className="font-semibold text-slate-800">111 Bijou Street, Ikeja</p>
             <p className="text-sm text-slate-500">Lagos Island, Nigeria</p>
          </div>
          <div className="flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-slate-100 transition-transform hover:-translate-y-1">
             <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-orange-50 text-orange-500">
               <Clock className="size-5" />
             </div>
             <h2 className="mb-1 text-lg font-bold text-[#13184f]">Working Hours</h2>
             <p className="font-semibold text-slate-800">Mon - Sat: 9am - 6pm</p>
             <p className="text-sm text-slate-500">Sun: Closed</p>
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="container-shell mb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Quote Form */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
            <h2 className="mb-8 text-3xl font-bold text-[#13184f]">Get a free quote in <span className="text-[#1900ff]">minutes</span></h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="sr-only">First Name</label>
                  <input id="firstName" className="w-full rounded-lg border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-[#1900ff] focus:outline-none focus:ring-1 focus:ring-[#1900ff]" placeholder="First Name" type="text" />
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">Last Name</label>
                  <input id="lastName" className="w-full rounded-lg border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-[#1900ff] focus:outline-none focus:ring-1 focus:ring-[#1900ff]" placeholder="Last Name" type="text" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input id="email" className="w-full rounded-lg border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-[#1900ff] focus:outline-none focus:ring-1 focus:ring-[#1900ff]" placeholder="Email Address" type="email" />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">Phone Number</label>
                <input id="phone" className="w-full rounded-lg border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-[#1900ff] focus:outline-none focus:ring-1 focus:ring-[#1900ff]" placeholder="Phone Number" type="tel" />
              </div>
              <div className="relative">
                <label htmlFor="projectType" className="sr-only">Select Project Type</label>
                <select id="projectType" className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-600 focus:border-[#1900ff] focus:outline-none focus:ring-1 focus:ring-[#1900ff]">
                  <option value="">Select Project Type</option>
                  <option value="residential">Residential</option>
                  <option value="commercial">Commercial</option>
                  <option value="industrial">Industrial</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 size-5 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <div>
                <label htmlFor="description" className="sr-only">Describe your projects and materials needs</label>
                <textarea id="description" className="h-32 w-full resize-none rounded-lg border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-[#1900ff] focus:outline-none focus:ring-1 focus:ring-[#1900ff]" placeholder="Describe your projects and materials needs..." />
              </div>
              <button className="mt-2 w-full rounded-xl bg-[#13184f] py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-[#13184f]/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1900ff] focus:ring-offset-2" type="button">
                Get quote
              </button>
              <p className="text-center text-xs text-slate-500">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
            </form>
          </div>

          {/* BoQ Upload Form */}
          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-10">
            <h2 className="mb-3 text-3xl font-bold leading-tight text-[#13184f]">Generate your free BoQ with <span className="text-[#1900ff]">Procurely's AI</span> cost consultant</h2>
            <p className="mb-8 text-sm leading-relaxed text-slate-500">Upload your structural and architectural drawings, and our AI cost consultant will generate a BoQ and deliver competitive pricing within 24 hours.</p>
            
            <form className="space-y-4">
              <div className="group mb-6 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-10 text-center transition-all hover:border-[#1900ff] hover:bg-slate-50/80 cursor-pointer">
                <UploadCloud className="mx-auto mb-4 size-10 text-slate-400 transition-colors group-hover:text-[#1900ff]" />
                <p className="mb-1 text-sm font-semibold text-slate-700">Drag & Drop your structural and architectural drawings file here</p>
                <p className="text-xs text-slate-500">or click to browse</p>
                <p className="mt-4 text-xs font-medium text-slate-400">Supports: .xlsx, .xls, .pdf, .csv (Max 25MB)</p>
              </div>

              <div>
                <label htmlFor="companyName" className="sr-only">Company Name</label>
                <input id="companyName" className="w-full rounded-lg border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-[#1900ff] focus:outline-none focus:ring-1 focus:ring-[#1900ff]" placeholder="Company Name" type="text" />
              </div>
              <div>
                <label htmlFor="projectName" className="sr-only">Project Name</label>
                <input id="projectName" className="w-full rounded-lg border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-[#1900ff] focus:outline-none focus:ring-1 focus:ring-[#1900ff]" placeholder="Project Name" type="text" />
              </div>
              <div>
                <label htmlFor="boqEmail" className="sr-only">Email Address</label>
                <input id="boqEmail" className="w-full rounded-lg border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-[#1900ff] focus:outline-none focus:ring-1 focus:ring-[#1900ff]" placeholder="Email Address" type="email" />
              </div>
              
              <fieldset className="flex gap-8 py-3">
                <legend className="sr-only">Delivery Speed</legend>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input className="peer size-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-[#1900ff] checked:border-[6px] transition-all" type="radio" name="speed" value="standard" defaultChecked />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-[#13184f]">Standard (24-48h)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center">
                    <input className="peer size-5 cursor-pointer appearance-none rounded-full border border-slate-300 checked:border-[#1900ff] checked:border-[6px] transition-all" type="radio" name="speed" value="urgent" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-[#13184f]">Urgent (Same day)</span>
                </label>
              </fieldset>

              <button className="mt-2 w-full rounded-xl bg-[#13184f] py-4 text-center font-semibold text-white shadow-md transition-all hover:bg-[#13184f]/90 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#1900ff] focus:ring-offset-2" type="button">
                Get free BoQ
              </button>
              <p className="text-center text-xs text-slate-500">Your data is secure and only shared with verified suppliers.</p>
            </form>
          </div>
        </div>
      </section>

      {/* Banner */}
      <section className="container-shell mb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[2.5rem] bg-[#1900ff] px-8 py-16 text-center text-white shadow-xl sm:px-16 sm:py-20 lg:py-24">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl lg:text-5xl">Need help choosing materials?</h2>
            <p className="mx-auto mb-10 max-w-xl text-lg text-white/90">Our procurement experts are available Mon-Sat to guide your project start to finish.</p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="w-full rounded-full bg-[#13184f] px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:bg-[#13184f]/90 sm:w-auto">
                Browse Materials
              </button>
              <button className="w-full rounded-full bg-[#ff6f4d] px-8 py-4 font-semibold text-white transition-all hover:scale-105 hover:bg-[#ff6f4d]/90 sm:w-auto">
                See How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-shell mb-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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

      {/* Testimonials */}
      <TestimonialSection title={content.testimonials.title} items={content.testimonials.items} />
    </div>
  );
}
