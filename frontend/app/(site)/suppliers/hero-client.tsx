"use client";

import Image from "next/image";

interface SupplierHeroProps {
  avatars: number[];
}

export function SupplierHeroClient({ avatars }: SupplierHeroProps) {
  return (
    <section className="relative min-h-[500px] flex items-center overflow-hidden bg-[#13184f]">
      <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #1900ff 0%, transparent 40%)" }} />
      <div className="container-shell grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-20 relative z-10">
        <div>
          <span className="inline-block py-1 px-4 rounded-full bg-[#1900ff] text-white text-[11px] font-bold uppercase tracking-[0.2em] mb-8 shadow-lg shadow-[#1900ff]/20">
            Supplier Network
          </span>
          <h1 className="text-5xl sm:text-7xl font-black text-white leading-[0.95] tracking-tight mb-8">
            Digitize your <br/>
            <span className="text-[#ff6f4d]">distribution</span> center.
          </h1>
          <p className="text-xl text-white/50 font-medium max-w-lg mb-12 leading-relaxed">
            Unlock direct access to verified developers and large-scale projects through Africa's most trusted procurement engine.
          </p>
          <div className="flex flex-wrap gap-5">
             <a href="#onboard" className="h-16 px-10 bg-[#1900ff] hover:bg-[#1310cc] text-white font-bold rounded-2xl shadow-2xl shadow-[#1900ff]/30 transition hover:-translate-y-1 flex items-center">
               Apply to Partner
             </a>
             <div className="flex -space-x-4 items-center">
                {avatars.map(i => (
                  <div key={i} className="size-11 rounded-full border-2 border-[#13184f] bg-slate-200 overflow-hidden shadow-xl relative first:ml-0 transition-transform hover:-translate-y-1">
                     <Image 
                        src={`https://ui-avatars.com/api/?name=Supplier+${i}&background=random&color=fff&bold=true`} 
                        alt="Verified Supplier" 
                        fill
                        className="object-cover" 
                     />
                  </div>
                ))}
                <div className="flex flex-col ml-6">
                   <span className="text-white font-black text-lg leading-none">500+</span>
                   <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.15em] mt-1">Verified Suppliers</span>
                </div>
             </div>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-tr from-[#1900ff]/20 to-transparent rounded-[3rem] blur-2xl group-hover:opacity-100 transition duration-1000" />
          <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl">
            <Image 
              src="/assets/suppliers-hero.png" 
              alt="Modern Warehouse" 
              width={800} 
              height={600} 
              className="w-full h-auto object-cover transform transition duration-700 group-hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
