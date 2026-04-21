"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { HelpCircle, Mail, MapPin, Phone, Clock, UploadCloud, ChevronDown, CheckCircle2, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { TestimonialSection } from "@/components/home/testimonial-section";

export default function ContactQuotePage() {
  const [content, setContent] = useState<any>(null);
  const [loadingContent, setLoadingContent] = useState(true);

  // Form states
  const [quoteForm, setQuoteForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    projectType: "",
    boqNotes: "",
  });
  
  const [boqForm, setBoqForm] = useState({
    companyName: "",
    projectName: "",
    email: "",
    speed: "standard"
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = (typeof window !== "undefined") ? require("react").useRef(null) : { current: null };

  const [submittingQuote, setSubmittingQuote] = useState(false);
  const [submittingBoq, setSubmittingBoq] = useState(false);
  const [quoteMessage, setQuoteMessage] = useState<string | null>(null);
  const [boqMessage, setBoqMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
        const res = await fetch(`${baseUrl}/api/homepage`);
        
        if (!res.ok) {
          throw new Error(`API returned ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();
        if (data && data.data) {
          setContent(data.data);
        } else {
          console.warn("API response missing data field", data);
        }
      } catch (e) {
        console.error("Failed to load content from Procurely API:", e);
      } finally {
        setLoadingContent(false);
      }
    }
    load();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv', 'application/vnd.ms-excel'];
    const maxSize = 25 * 1024 * 1024; // 25MB

    if (!allowedTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setError("Invalid file type. Please upload XLSX, PDF, or CSV.");
      return;
    }

    if (file.size > maxSize) {
      setError("File size exceeds 25MB limit.");
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingQuote(true);
    setQuoteMessage(null);
    setError(null);
    try {
      const payload = {
        companyName: "N/A", 
        fullName: `${quoteForm.firstName} ${quoteForm.lastName}`,
        email: quoteForm.email,
        phone: quoteForm.phone,
        projectLocation: quoteForm.projectType || "General",
        boqNotes: quoteForm.boqNotes,
      };
      const res = await api.requestQuote(payload);
      setQuoteMessage(res.message);
      setQuoteForm({ firstName: "", lastName: "", email: "", phone: "", projectType: "", boqNotes: "" });
    } catch (err: any) {
      setError(err.message || "Failed to submit quote request.");
    } finally {
      setSubmittingQuote(false);
    }
  };

  const handleBoqSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError("Please upload your structural or architectural drawings.");
      return;
    }

    setSubmittingBoq(true);
    setBoqMessage(null);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("companyName", boqForm.companyName);
      formData.append("fullName", "N/A");
      formData.append("email", boqForm.email);
      formData.append("phone", "N/A");
      formData.append("projectLocation", boqForm.projectName);
      formData.append("boqNotes", `Speed: ${boqForm.speed}. AI BoQ Generation Request.`);
      formData.append("boq_file", selectedFile);

      const res = await api.submitBoq(formData);
      setBoqMessage(res.message);
      setBoqForm({ companyName: "", projectName: "", email: "", speed: "standard" });
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.message || "Failed to submit BoQ request.");
    } finally {
      setSubmittingBoq(false);
    }
  };

  if (loadingContent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fcfcfc]">
        <Loader2 className="size-8 animate-spin text-[var(--color-brand-blue)]" />
      </div>
    );
  }

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
            {quoteMessage ? (
              <div className="mb-6 flex items-center gap-3 rounded-[12px] bg-emerald-50 p-4 text-emerald-700">
                <CheckCircle2 className="size-5" />
                <p className="text-sm font-medium">{quoteMessage}</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleQuoteSubmit}>
                {error && (
                  <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
                    {error}
                  </div>
                )}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <input 
                    className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" 
                    placeholder="First Name" 
                    type="text" 
                    required
                    value={quoteForm.firstName}
                    onChange={(e) => setQuoteForm({...quoteForm, firstName: e.target.value})}
                  />
                  <input 
                    className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" 
                    placeholder="Last Name" 
                    type="text" 
                    required
                    value={quoteForm.lastName}
                    onChange={(e) => setQuoteForm({...quoteForm, lastName: e.target.value})}
                  />
                </div>
                <input 
                  className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" 
                  placeholder="Email Address" 
                  type="email" 
                  required
                  value={quoteForm.email}
                  onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})}
                />
                <input 
                  className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" 
                  placeholder="Phone Number" 
                  type="tel" 
                  required
                  value={quoteForm.phone}
                  onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})}
                />
                <div className="relative">
                  <select 
                    className="w-full appearance-none rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] text-slate-400 outline-none transition-all focus:border-[#1900ff]"
                    value={quoteForm.projectType}
                    onChange={(e) => setQuoteForm({...quoteForm, projectType: e.target.value})}
                  >
                    <option value="">Select Project Type</option>
                    <option value="residential">Residential Development</option>
                    <option value="commercial">Commercial Building</option>
                  </select>
                  <ChevronDown className="absolute right-5 top-4 size-4 text-slate-400 pointer-events-none" />
                </div>
                <textarea 
                  className="h-32 w-full resize-none rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" 
                  placeholder="Describe your projects and materials needs..." 
                  required
                  value={quoteForm.boqNotes}
                  onChange={(e) => setQuoteForm({...quoteForm, boqNotes: e.target.value})}
                />
                
                <button 
                  className="w-full rounded-[8px] bg-[#0b103e] py-4 text-[16px] font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50" 
                  type="submit"
                  disabled={submittingQuote}
                >
                  {submittingQuote ? "Sending..." : "Get quote"}
                </button>
              </form>
            )}
          </div>

          {/* BoQ Upload Form */}
          <div className="rounded-[12px] border border-slate-100 bg-white p-10 shadow-sm">
             <h2 className="mb-2 text-[28px] font-bold text-slate-900 leading-tight">Generate your free BoQ with <span className="text-[#1900ff]">Procurely's AI</span> cost consultant</h2>
             <p className="mb-8 text-[14px] text-slate-500 font-medium">Extract your structural and architectural drawings, and our AI-cost consultant will generate a detailed and reasonably competitive pricing within 24 hours.</p>
             
             {boqMessage ? (
               <div className="mb-6 flex items-center gap-3 rounded-[12px] bg-emerald-50 p-4 text-emerald-700">
                 <CheckCircle2 className="size-5" />
                 <p className="text-sm font-medium">{boqMessage}</p>
               </div>
             ) : (
               <form className="space-y-4" onSubmit={handleBoqSubmit}>
                  {error && (
                    <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">
                      {error}
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.xlsx,.csv" 
                  />

                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-[#1900ff]'); }}
                    onDragLeave={(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-[#1900ff]'); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.currentTarget.classList.remove('border-[#1900ff]');
                      const file = e.dataTransfer.files?.[0];
                      if (file) validateAndSetFile(file);
                    }}
                    className="group cursor-pointer rounded-[8px] border-2 border-dashed border-slate-200 bg-[#f9fafb] py-12 text-center transition-colors hover:border-[#1900ff]"
                  >
                    <UploadCloud className={`mx-auto mb-3 size-8 ${selectedFile ? 'text-[#1900ff]' : 'text-slate-400'}`} />
                    <p className="text-[14px] font-bold text-slate-900">
                      {selectedFile ? selectedFile.name : "Drag & Drop your structural and architectural drawings flat here"}
                    </p>
                    <p className="text-[12px] text-slate-400">
                      {selectedFile ? "Click to change file" : "or click to browse"}
                    </p>
                    <p className="mt-2 text-[10px] text-slate-300">Supports: XLSX, PDF, CSV (max 25MB)</p>
                  </div>

                  <input 
                    className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" 
                    placeholder="Company Name" 
                    type="text" 
                    required
                    value={boqForm.companyName}
                    onChange={(e) => setBoqForm({...boqForm, companyName: e.target.value})}
                  />
                  <input 
                    className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" 
                    placeholder="Project Name" 
                    type="text" 
                    required
                    value={boqForm.projectName}
                    onChange={(e) => setBoqForm({...boqForm, projectName: e.target.value})}
                  />
                  <input 
                    className="w-full rounded-[8px] border border-slate-200 bg-[#f9fafb] px-5 py-3.5 text-[14px] outline-none transition-all placeholder:text-slate-400 focus:border-[#1900ff]" 
                    placeholder="Email Address" 
                    type="email" 
                    required
                    value={boqForm.email}
                    onChange={(e) => setBoqForm({...boqForm, email: e.target.value})}
                  />
                  
                  <div className="flex items-center gap-6 py-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        className="size-4 accent-[#1900ff]" 
                        type="radio" 
                        name="speed" 
                        value="standard" 
                        checked={boqForm.speed === "standard"} 
                        onChange={() => setBoqForm({...boqForm, speed: "standard"})}
                      />
                      <span className="text-[13px] font-medium text-slate-600 underline underline-offset-4 decoration-slate-200">Standard (24-48h)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        className="size-4 accent-[#1900ff]" 
                        type="radio" 
                        name="speed" 
                        value="urgent" 
                        checked={boqForm.speed === "urgent"} 
                        onChange={() => setBoqForm({...boqForm, speed: "urgent"})}
                      />
                      <span className="text-[13px] font-medium text-slate-600 underline underline-offset-4 decoration-slate-200">Urgent (Same day)</span>
                    </label>
                  </div>

                  <button 
                    className="w-full rounded-[8px] bg-[#0b103e] py-4 text-[16px] font-bold text-white transition-opacity hover:opacity-90 active:scale-[0.98] disabled:opacity-50" 
                    type="submit"
                    disabled={submittingBoq}
                  >
                    {submittingBoq ? "Processing..." : "Get free BoQ"}
                  </button>
               </form>
             )}
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
             <Link href="/materials" className="w-[180px] rounded-[8px] bg-slate-900 py-4 text-[16px] font-bold text-white transition-all hover:bg-black text-center">
               Browse Materials
             </Link>
             <Link href="/how-it-works" className="w-[180px] rounded-[8px] bg-[#ff4d00] py-4 text-[16px] font-bold text-white transition-all hover:bg-[#e64500] text-center">
               See How It Works
             </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container-shell mx-auto px-4 sm:px-6 lg:px-8 mb-32 max-w-4xl">
        <h2 className="mb-12 text-center text-[32px] font-bold text-slate-900">Frequently Asked Questions</h2>
        <div className="space-y-0 divide-y divide-slate-100 border-t border-slate-100">
          {content?.faqs?.map((faq: any, index: number) => (
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
           <TestimonialSection title="" items={content?.testimonials?.items || []} />
         </div>
      </div>
    </div>
  );
}
