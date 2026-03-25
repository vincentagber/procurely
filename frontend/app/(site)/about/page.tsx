import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Target, Users, Building2, Zap, Globe } from "lucide-react";
import { getProcurelyContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us | Procurely",
  description: "Learn about Procurely's mission to revolutionize construction procurement through technology, structured credit, and reliable logistics.",
};

export default async function AboutPage() {
  const content = await getProcurelyContent();

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[#f6f7fd] z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#1900ff]/5 to-transparent z-0" />
        
        <div className="container-shell relative z-10">
          <div className="max-w-3xl">
            <span className="inline-block py-1 px-3 rounded-full bg-[#1900ff]/10 text-[#1900ff] text-xs font-bold uppercase tracking-widest mb-6">
              Our Story
            </span>
            <h1 className="text-5xl sm:text-6xl font-black text-[#13184f] leading-[1.05] tracking-tight mb-8">
              Building the future of <span className="text-[#1900ff]">procurement</span> for Africa.
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
              Procurely was founded with a single mission: to eliminate the friction in construction supply chains. We combine technology, finance, and logistics to ensure developers get what they need, exactly when they need it.
            </p>
          </div>
        </div>
      </section>

      {/* Grid of Values */}
      <section className="py-24 sm:py-32">
        <div className="container-shell">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-16">
            {[
              {
                Icon: Target,
                title: "Our Mission",
                description: "To become the pulse of Africa's infrastructure growth by providing seamless access to quality materials."
              },
              {
                Icon: ShieldCheck,
                title: "Quality First",
                description: "We partner directly with manufacturers and verified distributors to ensure 100% authenticity on every order."
              },
              {
                Icon: Zap,
                title: "Efficiency",
                description: "From BOQ upload to doorstep delivery, we've optimized every second to keep your project on schedule."
              },
              {
                Icon: Building2,
                title: "Developers First",
                description: "Our platform is built specifically for the needs of developers, contractors, and site managers."
              },
              {
                Icon: Users,
                title: "Expert Team",
                description: "Our team brings decades of experience in construction, logistics, and fintech to the table."
              },
              {
                Icon: Globe,
                title: "Scaleable Impact",
                description: "We are building infrastructure that scales, starting from Lagos and expanding across the continent."
              }
            ].map((value, i) => (
              <div key={i} className="group">
                <div className="size-14 rounded-2xl bg-[#f0f1fa] text-[#1900ff] flex items-center justify-center mb-6 transition-transform group-hover:scale-110">
                  <value.Icon className="size-7" />
                </div>
                <h3 className="text-xl font-bold text-[#13184f] mb-3">{value.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#13184f] py-24 sm:py-32 text-white">
        <div className="container-shell">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
            {[
              { label: "Orders Delivered", value: "10,000+" },
              { label: "Verified Suppliers", value: "500+" },
              { label: "Project Sites", value: "1,200+" },
              { label: "Developers Saved", value: "₦1.5B+" }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl sm:text-5xl font-black mb-2">{stat.value}</div>
                <div className="text-white/60 font-bold uppercase tracking-wider text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-24 sm:py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] bg-[#ff6f4d]/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="container-shell text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black text-[#13184f] mb-8 tracking-tight max-w-2xl mx-auto">
            Ready to streamline your next project?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <a href="/materials" className="w-full sm:w-auto px-10 py-5 bg-[#1900ff] hover:bg-[#1310cc] text-white font-bold rounded-2xl shadow-xl transition hover:-translate-y-1">
                Explore Catalog
             </a>
             <a href="/contact-quote" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 text-[#13184f] hover:border-[#13184f] font-bold rounded-2xl transition hover:-translate-y-1">
                Request Bulk Quote
             </a>
          </div>
        </div>
      </section>
    </main>
  );
}
