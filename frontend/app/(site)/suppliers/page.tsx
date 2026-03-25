import type { Metadata } from "next";
import { Truck, Handshake, Users, ShieldCheck, Globe, Zap, BarChart3, TrendingUp, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Sell on Procurely | Become a Verified Supplier",
  description: "Join Africa's leading building material marketplace. Access thousands of verified developers and contractors with one single integration.",
};

export default function SuppliersPage() {
  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative py-24 sm:py-32 bg-[#13184f] text-white">
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #1900ff 0%, transparent 50%)" }} />
         <div className="container-shell relative z-10 text-center max-w-4xl">
            <h1 className="text-5xl sm:text-6xl font-black mb-8 leading-tight tracking-tight">Scale your <span className="text-[#ff6f4d]">distribution</span> across Africa.</h1>
            <p className="text-xl text-white/50 font-medium mb-12 max-w-2xl mx-auto">Digitize your inventory and reach thousands of verified contractors and developers through Africa's most trusted procurement engine.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <a href="#onboard" className="w-full sm:w-auto px-10 py-5 bg-[#1900ff] hover:bg-[#1310cc] text-white font-bold rounded-2xl shadow-xl transition hover:-translate-y-1">Apply to Join</a>
               <a href="/materials" className="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/15 backdrop-blur-sm text-white font-bold rounded-2xl transition hover:-translate-y-1 border border-white/20">Check Current Catalog</a>
            </div>
         </div>
      </section>

      {/* Why Sell */}
      <section className="py-24 sm:py-32">
         <div className="container-shell text-center mb-20">
            <h2 className="text-4xl font-black text-[#13184f] mb-4">Why partner with Procurely?</h2>
            <p className="text-slate-500 font-medium text-lg">We handle the tech and logistics, you focus on your supply chain.</p>
         </div>
         <div className="container-shell grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
            {[
               { Icon: Handshake, title: "Verified Demand", description: "Get direct access to purchase orders from thousands of construction firms and real estate developers." },
               { Icon: Zap, title: "Instant Settlements", description: "Get paid on confirmation of orders. No more 60-day credit cycles for your business." },
               { Icon: BarChart3, title: "Insight Dashboard", description: "Real-time visibility into market demand, trending materials, and price performance across regions." },
               { Icon: Truck, title: "Integrated Logistics", description: "Our fulfillment network takes care of the transport. You simply fulfill the pick-up request." },
               { Icon: ShieldCheck, title: "Reduced Fraud", description: "Verified buyers only. Our structured credit model ensures you're selling into a secure ecosystem." },
               { Icon: Globe, title: "Regional Expansion", description: "Reach customers beyond your physical store footprint without opening new warehouses." }
            ].map((feature, i) => (
               <div key={i} className="bg-[#f0f1fa]/40 p-8 rounded-[2rem] border border-slate-50 transition hover:border-[#1900ff]/30">
                  <div className="size-14 rounded-2xl bg-white text-[#1900ff] flex items-center justify-center mb-8 shadow-sm">
                     <feature.Icon className="size-7" />
                  </div>
                  <h3 className="text-xl font-bold text-[#13184f] mb-4">{feature.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{feature.description}</p>
               </div>
            ))}
         </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 sm:py-32 bg-[#f6f7fd]">
         <div className="container-shell flex flex-col lg:flex-row gap-16 items-center">
            <div className="w-full lg:w-1/2">
               <h2 className="text-4xl sm:text-5xl font-black text-[#13184f] mb-8 tracking-tight">Simple onboarding process.</h2>
               <div className="space-y-10">
                  {[
                     { step: "01", title: "Submit Application", description: "Send your company details, brand list, and catalog for verification." },
                     { step: "02", title: "Verification Check", description: "Our team verifies your stock capacity and warehouse locations." },
                     { step: "03", title: "Go Live", description: "Your products are listed on our marketplace and available to buyers immediately." }
                  ].map((item, i) => (
                     <div key={i} className="flex gap-6">
                        <div className="text-3xl font-black text-[#1900ff] leading-none">{item.step}</div>
                        <div>
                           <h4 className="text-xl font-bold text-[#13184f] mb-2">{item.title}</h4>
                           <p className="text-slate-500 font-medium leading-relaxed">{item.description}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            <div className="w-full lg:w-1/2 p-1 rounded-[3rem] bg-gradient-to-tr from-[#13184f] to-[#1900ff]">
               <div id="onboard" className="bg-white rounded-[2.9rem] p-10 sm:p-14">
                  <h3 className="text-2xl font-black text-[#13184f] mb-8">Start Application</h3>
                  <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Company Name</label>
                           <input type="text" className="w-full bg-[#f6f7fd] border border-slate-100 rounded-xl px-4 py-4 outline-none focus:border-[#1900ff] transition" placeholder="e.g. Aliko Supplies Ltd" />
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Inventory Focus</label>
                           <select className="w-full bg-[#f6f7fd] border border-slate-100 rounded-xl px-4 py-4 outline-none focus:border-[#1900ff] transition">
                              <option>Cement & Aggregates</option>
                              <option>Iron & Rebar</option>
                              <option>Finishing & Sanitary</option>
                              <option>Paints & Chemicals</option>
                              <option>General Hardware</option>
                           </select>
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Official Email</label>
                        <input type="email" className="w-full bg-[#f6f7fd] border border-slate-100 rounded-xl px-4 py-4 outline-none focus:border-[#1900ff] transition" placeholder="partners@company.com" />
                     </div>
                     <button type="button" className="w-full h-16 bg-[#13184f] hover:bg-[#1900ff] text-white font-bold rounded-2xl shadow-lg transition flex items-center justify-center gap-3">
                        Submit Application <ArrowRight className="size-5" />
                     </button>
                     <p className="text-[11px] text-center text-slate-400 font-medium">By submitting, you agree to our <a href="/terms-of-use" className="underline">Partnership Agreement</a>.</p>
                  </form>
               </div>
            </div>
         </div>
      </section>

      {/* Quote Banner */}
      <section className="py-24 sm:py-32">
         <div className="container-shell bg-[#fde8df] rounded-[3rem] p-12 sm:p-20 flex flex-col lg:flex-row items-center justify-between gap-12 text-center lg:text-left">
            <div className="max-w-xl">
               <h2 className="text-4xl sm:text-5xl font-black text-[#13184f] mb-6 tracking-tight">Need help with mass onboarding?</h2>
               <p className="text-lg text-slate-600 font-medium leading-relaxed">If you manage multiple regional warehouses or have a complex ERP system, our Enterprise Integration team is here to help.</p>
            </div>
            <a href="/contact-quote" className="inline-flex h-14 items-center gap-2 rounded-[14px] bg-[#13184f] px-10 text-[16px] font-bold text-white transition hover:bg-[#1900ff]">Talk to Sales</a>
         </div>
      </section>
    </main>
  );
}
