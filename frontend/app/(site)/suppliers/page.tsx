import type { Metadata } from "next";
import { Truck, Users, ShieldCheck, Globe, Zap, BarChart3, TrendingUp, Wallet, LayoutDashboard } from "lucide-react";
import { SupplierOnboardingForm } from "./onboarding-form";
import { SupplierHeroClient } from "./hero-client";

export const metadata: Metadata = {
  title: "Sell on Procurely | Become a Verified Supplier",
  description: "Join Africa's leading building material marketplace. Access thousands of verified developers and contractors with one single integration.",
};

export default function SuppliersPage() {
  return (
    <main className="bg-white">
      {/* Hero Section - Professional Split Layout (Client Component) */}
      <SupplierHeroClient avatars={[1, 2, 3, 4]} />

      {/* Global Impact Grid */}
      <section className="py-32">
         <div className="container-shell mb-24 text-center">
            <h2 className="text-4xl sm:text-5xl font-black text-[#13184f] tracking-tight mb-6">Built for Enterprise Scale</h2>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">We connect localized inventory centers with cross-regional demand hubs.</p>
         </div>
         <div className="container-shell grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {[
               { Icon: Users, title: "Verified Demand", description: "Direct access to real BOM-based Purchase Orders from top-tier construction firms." },
               { Icon: Wallet, title: "Instant Payments", description: "Receive settlements immediately upon fulfillment. Zero 60-day credit lag for suppliers." },
               { Icon: BarChart3, title: "Real-time Insights", description: "Deep visibility into trending materials and regional price performance through our Dashboard." },
               { Icon: Truck, title: "Integrated Logistics", description: "Our fulfillment fleet handles the last mile. You simply prep the inventory for pick-up." },
               { Icon: ShieldCheck, title: "Enterprise Security", description: "Automated fraud detection and secure settlements ensure 100% transaction safety." },
               { Icon: Globe, title: "Regional Expansion", description: "Scale your footprint beyond physical storefronts to reach projects nationwide." }
            ].map((item, i) => (
               <div key={i} className="relative group hover:-translate-y-2 transition-transform duration-500">
                  <div className="size-16 rounded-3xl bg-[#f0f1fa] text-[#1900ff] flex items-center justify-center mb-8 shadow-sm group-hover:bg-[#1900ff] group-hover:text-white transition-colors duration-500">
                     <item.Icon className="size-8" />
                  </div>
                  <h3 className="text-2xl font-black text-[#13184f] mb-4 tracking-tight">{item.title}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.description}</p>
               </div>
            ))}
         </div>
      </section>

      {/* Process Flow */}
      <section className="py-32 bg-[#f6f7fd]">
         <div className="container-shell flex flex-col lg:flex-row gap-24 items-center">
            <div className="w-full lg:w-1/2">
               <h2 className="text-4xl sm:text-6xl font-black text-[#13184f] mb-12 tracking-tight">Streamlined <br/>Onboarding.</h2>
               <div className="space-y-12 relative">
                  <div className="absolute left-[31px] top-6 bottom-6 w-[2px] bg-[#1900ff]/10" />
                  {[
                     { Icon: LayoutDashboard, title: "1. Digital Catalog", text: "Submit your verified inventory and current price list through our secure portal." },
                     { Icon: ShieldCheck, title: "2. Site Verification", text: "Our field team confirms stock availability and warehouse logistics capacity." },
                     { Icon: TrendingUp, title: "3. Market Active", text: "Go live on our marketplace to start receiving structured POs immediately." }
                  ].map((step, i) => (
                     <div key={i} className="flex gap-8 relative z-10">
                        <div className="size-16 shrink-0 rounded-2xl bg-white text-[#1900ff] border border-slate-100 shadow-sm flex items-center justify-center">
                           <step.Icon className="size-7" />
                        </div>
                        <div>
                           <h4 className="text-xl font-bold text-[#13184f] mb-2">{step.title}</h4>
                           <p className="text-slate-500 font-medium leading-relaxed">{step.text}</p>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
            
            <div className="w-full lg:w-1/2 p-1.5 rounded-[3.5rem] bg-gradient-to-tr from-[#13184f] to-[#1900ff] shadow-3xl">
               <SupplierOnboardingForm />
            </div>
         </div>
      </section>

      {/* Final Banner */}
      <section className="py-32">
         <div className="container-shell bg-[#13184f] rounded-[4rem] p-16 sm:p-24 text-center group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#1900ff]/40 to-transparent pointer-events-none" />
            <h3 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-10 relative z-10">Ready to lead the future of building?</h3>
            <div className="flex justify-center relative z-10">
               <a href="#onboard" className="h-16 px-12 bg-white text-[#13184f] font-bold rounded-2xl shadow-xl transition hover:-translate-y-1 flex items-center gap-3">
                  Talk to a Partnership Manager <TrendingUp className="size-5" />
               </a>
            </div>
         </div>
      </section>
    </main>
  );
}
