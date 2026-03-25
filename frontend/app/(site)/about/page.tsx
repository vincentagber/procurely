import type { Metadata } from "next";
import Image from "next/image";
import { ShieldCheck, Rocket, Award, Zap, Truck, Users2, Map, MessageSquareQuote, CheckCircle2 } from "lucide-react";
import { getProcurelyContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "About Us | Procurely",
  description: "Learn about Procurely's mission to revolutionize construction procurement through technology, structured credit, and reliable logistics.",
};

export default async function AboutPage() {
  const content = await getProcurelyContent();

  return (
    <main className="bg-white">
      {/* Hero Section - Professional Split */}
      <section className="relative min-h-[550px] flex items-center bg-[#f6f7fd] overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-soft-light" style={{ backgroundImage: "radial-gradient(circle at 10% 50%, #1900ff 0%, transparent 40%)" }} />
        <div className="container-shell grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20 relative z-10">
          <div>
            <span className="inline-block py-1 px-4 rounded-full bg-[#1900ff]/10 text-[#1900ff] text-[11px] font-bold uppercase tracking-[0.2em] mb-8">
              Since 2024
            </span>
            <h1 className="text-5xl sm:text-7xl font-black text-[#13184f] leading-[0.95] tracking-tight mb-8">
              Building Africa's <br />
              <span className="text-[#1900ff]">procurement</span> pulse.
            </h1>
            <p className="text-xl text-slate-500 font-medium max-w-lg mb-12 leading-relaxed">
              We eliminate the friction in construction supply chains by merging fintech, technology, and advanced logistics.
            </p>
            <div className="flex items-center gap-10">
              <div>
                <div className="text-3xl font-black text-[#13184f]">₦1.5B+</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Saved for Developers</div>
              </div>
              <div className="w-[1px] h-12 bg-slate-200" />
              <div>
                <div className="text-3xl font-black text-[#13184f]">10k+</div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Deliveries Fulfilled</div>
              </div>
            </div>
          </div>
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-[#1900ff]/10 to-transparent rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700" />
            <div className="relative rounded-[2.5rem] overflow-hidden border border-white shadow-2xl">
              <Image
                src="/assets/about-hero.png"
                alt="Procurely Team"
                width={800}
                height={600}
                className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Values */}
      <section className="py-32">
        <div className="container-shell mb-24 text-center">
          <h2 className="text-4xl sm:text-5xl font-black text-[#13184f] tracking-tight mb-6">Our Foundational Values</h2>
          <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto">We are architecting a transparent, efficient, and scaleable material ecosystem.</p>
        </div>
        <div className="container-shell">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
            {[
              {
                Icon: Rocket,
                title: "Our Mission",
                description: "To become the pulse of Africa's infrastructure growth by providing seamless access to quality materials."
              },
              {
                Icon: Award,
                title: "Quality Integrity",
                description: "We partner directly with manufacturers and verified distributors to ensure 100% authenticity on every order."
              },
              {
                Icon: Zap,
                title: "Radical Efficiency",
                description: "From BOQ upload to doorstep delivery, we've optimized every second to keep your project on schedule."
              },
              {
                Icon: Truck,
                title: "Logistics First",
                description: "Our proprietary fulfillment network handles the complexity of transport so you don't have to."
              },
              {
                Icon: Users2,
                title: "Collaborative Team",
                description: "A world-class group of engineers, logisticians, and finance experts dedicated to your success."
              },
              {
                Icon: Map,
                title: "Continental Scale",
                description: "We're expanding rapidly across major African hubs to power the next generation of real estate."
              }
            ].map((value, i) => (
              <div key={i} className="group">
                <div className="size-16 rounded-2xl bg-[#f0f1fa] text-[#1900ff] flex items-center justify-center mb-8 transition-all group-hover:bg-[#1900ff] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[#1900ff]/20">
                  <value.Icon className="size-8" />
                </div>
                <h3 className="text-2xl font-black text-[#13184f] mb-4 tracking-tight">{value.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote/Vision Section */}
      <section className="bg-[#13184f] py-32 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="container-shell relative z-10 flex flex-col items-center text-center max-w-4xl">
          <MessageSquareQuote className="size-16 text-[#ff6f4d] mb-10 opacity-50" />
          <h3 className="text-3xl sm:text-5xl font-black leading-[1.1] mb-12 tracking-tight">
            "Infrastructure is the skeleton of a nation. We're here to make sure that skeleton is built with the best materials, at the right price, with zero friction."
          </h3>
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-full bg-slate-200 overflow-hidden border-2 border-[#1900ff]">
              <Image src="https://ui-avatars.com/api/?name=Founder+Name&background=0D8ABC&color=fff" alt="Founder" width={48} height={48} />
            </div>
            <div className="text-left">
              <div className="font-bold text-lg">Vincent Agber</div>
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest">Founder & CEO, Procurely</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="container-shell text-center relative z-10">
          <h2 className="text-4xl sm:text-6xl font-black text-[#13184f] mb-10 tracking-tight max-w-3xl mx-auto">
            Ready to lead the future <br />of building?
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <a href="/materials" className="h-16 px-12 bg-[#1900ff] hover:bg-[#1310cc] text-white font-bold rounded-2xl shadow-xl shadow-[#1900ff]/20 transition hover:-translate-y-1 flex items-center justify-center gap-3">
              Join our Marketplace <CheckCircle2 className="size-5" />
            </a>
            <a href="/contact-quote" className="h-16 px-12 bg-white border-2 border-slate-200 text-[#13184f] hover:border-[#13184f] font-bold rounded-2xl transition hover:-translate-y-1 flex items-center justify-center">
              Enterprise Partnership
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
