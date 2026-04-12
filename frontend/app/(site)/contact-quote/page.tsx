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
    <div className="bg-[#f6f7fd] min-h-screen">
      {/* Hero Header Area */}
      <section className="relative overflow-hidden bg-[#13184f] pt-28 pb-40">
        <div className="absolute inset-0 bg-[url('/assets/design/hero-kitchen.png')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-overlay"></div>
        <div className="container-shell relative z-10 mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight leading-tight md:text-6xl lg:text-7xl">
            Get your free quote<br />or <span className="text-[#1900ff]">upload your BoQ</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-300 md:text-xl leading-relaxed">
            Get accurate pricing in minutes. Request a free quote for your architectural drawings or upload your BoQ to receive a detailed cost breakdown powered by our AI cost consultant.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="container-shell relative z-20 -mt-24 mb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-[0_10px_40px_rgb(0,0,0,0.05)] ring-1 ring-slate-100 transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)]">
             <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
               <Phone className="size-7" />
             </div>
             <h2 className="mb-2 text-xl font-bold text-[#13184f]">Call</h2>
             <p className="font-semibold text-slate-800 text-lg">+8016-88888-9999</p>
             <p className="mt-1 text-sm text-slate-500 font-medium">Mon-Sat, 9am-6pm</p>
          </div>
          <div className="group flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-[0_10px_40px_rgb(0,0,0,0.05)] ring-1 ring-slate-100 transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)]">
             <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition-colors group-hover:bg-red-500 group-hover:text-white">
               <Mail className="size-7" />
             </div>
             <h2 className="mb-2 text-xl font-bold text-[#13184f]">Email</h2>
             <p className="font-semibold text-slate-800 text-lg">sales@useprocurely.com</p>
             <p className="mt-1 text-sm text-slate-500 font-medium">Response within 24h</p>
          </div>
          <div className="group flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-[0_10px_40px_rgb(0,0,0,0.05)] ring-1 ring-slate-100 transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)]">
             <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-500 transition-colors group-hover:bg-orange-500 group-hover:text-white">
               <MapPin className="size-7" />
             </div>
             <h2 className="mb-2 text-xl font-bold text-[#13184f]">Visit Us</h2>
             <p className="font-semibold text-slate-800 text-lg">111 Bijou Street, Ikeja</p>
             <p className="mt-1 text-sm text-slate-500 font-medium">Lagos Island, Nigeria</p>
          </div>
          <div className="group flex flex-col items-center rounded-3xl bg-white p-10 text-center shadow-[0_10px_40px_rgb(0,0,0,0.05)] ring-1 ring-slate-100 transition-all hover:-translate-y-2 hover:shadow-[0_20px_60px_rgb(0,0,0,0.08)]">
             <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 transition-colors group-hover:bg-emerald-500 group-hover:text-white">
               <Clock className="size-7" />
             </div>
             <h2 className="mb-2 text-xl font-bold text-[#13184f]">Working Hours</h2>
             <p className="font-semibold text-slate-800 text-lg">Mon - Sat: 9am - 6pm</p>
             <p className="mt-1 text-sm text-slate-500 font-medium">Sun: Closed</p>
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="container-shell mb-32 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-14">
          
          {/* Quote Form */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] sm:p-14 transition-shadow hover:shadow-[0_8px_50px_rgb(0,0,0,0.06)]">
            <h2 className="mb-10 text-4xl font-extrabold tracking-tight text-[#13184f]">Get a free quote in <span className="text-[#1900ff]">minutes</span></h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="mb-2 block text-sm font-bold text-slate-700">First Name</label>
                  <input id="firstName" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff] focus:bg-white focus:ring-4 focus:ring-[#1900ff]/10" placeholder="John" type="text" />
                </div>
                <div>
                  <label htmlFor="lastName" className="mb-2 block text-sm font-bold text-slate-700">Last Name</label>
                  <input id="lastName" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff] focus:bg-white focus:ring-4 focus:ring-[#1900ff]/10" placeholder="Doe" type="text" />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-700">Email Address</label>
                <input id="email" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff] focus:bg-white focus:ring-4 focus:ring-[#1900ff]/10" placeholder="john@company.com" type="email" />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-bold text-slate-700">Phone Number</label>
                <input id="phone" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff] focus:bg-white focus:ring-4 focus:ring-[#1900ff]/10" placeholder="+123 456 7890" type="tel" />
              </div>
              <div className="relative">
                <label htmlFor="projectType" className="mb-2 block text-sm font-bold text-slate-700">Project Type</label>
                <select id="projectType" className="w-full appearance-none rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 text-slate-700 outline-none transition-all focus:border-[#1900ff] focus:bg-white focus:ring-4 focus:ring-[#1900ff]/10">
                  <option value="">Select Project Type</option>
                  <option value="residential">Residential Development</option>
                  <option value="commercial">Commercial Building</option>
                  <option value="industrial">Industrial Infrastructure</option>
                </select>
                <ChevronDown className="absolute right-5 top-[50px] size-5 text-slate-400 pointer-events-none" />
              </div>
              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-bold text-slate-700">Project Description</label>
                <textarea id="description" className="h-40 w-full resize-none rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff] focus:bg-white focus:ring-4 focus:ring-[#1900ff]/10" placeholder="Describe your project size, timeline, and material requirements..." />
              </div>
              <button className="mt-4 w-full rounded-2xl bg-[#0b103e] py-5 text-lg font-bold text-white shadow-[0_8px_20px_rgba(11,16,62,0.3)] transition-all hover:-translate-y-1 hover:bg-[#13184f] focus:outline-none focus:ring-4 focus:ring-[#1900ff]/30" type="button">
                Submit Quote Request
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-slate-500">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>Your information is secure and confidential</span>
              </div>
            </form>
          </div>

          {/* BoQ Upload Form */}
          <div className="rounded-[2.5rem] border border-slate-100 bg-white p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] sm:p-14 relative overflow-hidden transition-shadow hover:shadow-[0_8px_50px_rgb(0,0,0,0.06)]">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <UploadCloud className="size-64" />
            </div>
            <div className="relative z-10">
              <h2 className="mb-4 text-4xl font-extrabold leading-tight tracking-tight text-[#13184f]">Generate your free BoQ with <span className="text-[#1900ff]">AI</span></h2>
              <p className="mb-10 text-lg text-slate-600 leading-relaxed font-medium">Upload your structural drawings, and our AI will generate a detailed BoQ and competitive pricing within 24 hours.</p>
              
              <form className="space-y-6">
                <div className="group mb-8 rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-12 text-center transition-all hover:border-[#1900ff] hover:bg-blue-50/30 cursor-pointer">
                  <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-white shadow-sm transition-transform group-hover:scale-110 group-hover:shadow-md">
                    <UploadCloud className="size-8 text-[#1900ff]" />
                  </div>
                  <p className="mb-2 text-lg font-bold text-[#13184f]">Drag & Drop your files here</p>
                  <p className="text-sm font-medium text-slate-500">or click to browse from your computer</p>
                  <div className="mt-6 inline-flex rounded-full bg-slate-200/50 px-4 py-1.5 px text-xs font-bold text-slate-500">
                    Supports: .XLSX, .PDF, .CSV (Max 25MB)
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="companyName" className="mb-2 block text-sm font-bold text-slate-700">Company Name</label>
                    <input id="companyName" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff] focus:bg-white focus:ring-4 focus:ring-[#1900ff]/10" placeholder="Company Name" type="text" />
                  </div>
                  <div>
                    <label htmlFor="projectName" className="mb-2 block text-sm font-bold text-slate-700">Project Name</label>
                    <input id="projectName" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff] focus:bg-white focus:ring-4 focus:ring-[#1900ff]/10" placeholder="Project Name" type="text" />
                  </div>
                </div>
                <div>
                  <label htmlFor="boqEmail" className="mb-2 block text-sm font-bold text-slate-700">Email Address</label>
                  <input id="boqEmail" className="w-full rounded-xl bg-slate-50 border border-slate-200 px-5 py-4 outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff] focus:bg-white focus:ring-4 focus:ring-[#1900ff]/10" placeholder="Email Address" type="email" />
                </div>
                
                <div className="pt-2 pb-4">
                  <label className="mb-4 block text-sm font-bold text-slate-700">Processing Speed</label>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <label className="flex-1 cursor-pointer group">
                      <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:bg-slate-50 has-[:checked]:border-[#1900ff] has-[:checked]:bg-blue-50/50 has-[:checked]:ring-1 has-[:checked]:ring-[#1900ff]">
                        <input className="size-5 accent-[#1900ff]" type="radio" name="speed" value="standard" defaultChecked />
                        <div>
                          <p className="font-bold text-[#13184f]">Standard</p>
                          <p className="text-xs font-semibold text-slate-500">24-48 hours</p>
                        </div>
                      </div>
                    </label>
                    <label className="flex-1 cursor-pointer group">
                      <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition-all hover:bg-slate-50 has-[:checked]:border-[#1900ff] has-[:checked]:bg-blue-50/50 has-[:checked]:ring-1 has-[:checked]:ring-[#1900ff]">
                        <input className="size-5 accent-[#1900ff]" type="radio" name="speed" value="urgent" />
                        <div>
                          <p className="font-bold text-[#13184f]">Urgent</p>
                          <p className="text-xs font-semibold text-orange-500">Same day (+15%)</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <button className="mt-4 w-full rounded-2xl bg-[#ff6f4d] py-5 text-lg font-bold text-white shadow-[0_8px_20px_rgba(255,111,77,0.3)] transition-all hover:-translate-y-1 hover:bg-[#ff8466] focus:outline-none focus:ring-4 focus:ring-[#ff6f4d]/30" type="button">
                  Analyze My BoQ Let's Go
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Banner */}
      {/* Banner */}
      <section className="container-shell mb-32 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-[20px] bg-[#1900ff] px-6 py-16 text-center text-white sm:px-12 sm:py-20 flex flex-col items-center">
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-[46px]">
            Need help choosing materials?
          </h2>
          <p className="mb-10 text-[16px] text-white/90 font-medium sm:text-[18px]">
            Our procurement experts are available Mon–Sat to guide your project.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
             <Link href="/materials" className="w-full sm:w-auto rounded-xl bg-[#0b103e] px-8 py-4 text-[16px] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#13184f]">
               Browse Materials
             </Link>
             <Link href="/how-it-works" className="w-full sm:w-auto rounded-xl bg-[#ff2e00] px-8 py-4 text-[16px] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#e62900]">
               See How It Works
             </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-shell mb-32 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
