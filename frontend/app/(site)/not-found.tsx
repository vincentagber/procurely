import Link from "next/link";
import { Search, Home, ArrowRight, PackageX } from "lucide-react";
import { getProcurelyContent } from "@/lib/content";

export default async function NotFound() {
  const content = await getProcurelyContent();

  return (
    <>
      <main className="relative min-h-[80vh] flex items-center justify-center bg-[#f6f7fd] overflow-hidden px-4 sm:px-6 pt-10 pb-20">
        {/* Decorative Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-[#1900ff]/5 blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#ff6f4d]/5 blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center mt-10">

          {/* 404 Typography */}
          <div className="relative mb-6">
            <h1 className="text-[120px] leading-none font-black tracking-tighter text-transparent [-webkit-text-stroke:3px_#13184f] sm:text-[180px] md:text-[220px] select-none opacity-20 transition-all hover:opacity-40 hover:scale-105 duration-500">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-20 sm:size-28 bg-white border border-slate-200 shadow-xl rounded-full flex items-center justify-center text-[#ff6f4d] z-10 animate-bounce">
                <PackageX className="size-10 sm:size-14" strokeWidth={2} />
              </div>
            </div>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#13184f] tracking-tight mb-4">
            Page Not Found
          </h2>
          <p className="text-lg sm:text-xl text-slate-500 font-medium max-w-xl mx-auto mb-10 leading-relaxed">
            The building material or page you're searching for might have been removed, relocated, or is temporarily unavailable.
          </p>

          {/* Action Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto justify-center">
            <Link 
              href="/" 
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-[#13184f] px-8 py-4 text-base font-bold text-white shadow-[0_8px_20px_rgba(19,24,79,0.3)] transition-all hover:-translate-y-1 hover:bg-[#1900ff]"
            >
              <Home className="size-5" />
              Back to Home
            </Link>
            <Link 
              href="/materials" 
              className="group flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white border-2 border-slate-200 px-8 py-4 text-base font-bold text-[#13184f] transition-all hover:border-[#1900ff] hover:text-[#1900ff]"
            >
              <Search className="size-5" />
              Browse Catalog
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-20 pt-8 border-t border-slate-200/60 w-full max-w-sm flex items-center justify-center gap-6">
             <Link href="/contact-quote" className="text-sm font-semibold text-slate-400 hover:text-[#13184f] transition">Need Help?</Link>
             <div className="size-1.5 rounded-full bg-slate-200"></div>
             <Link href="/faq" className="text-sm font-semibold text-slate-400 hover:text-[#13184f] transition">Visit FAQ</Link>
          </div>
        </div>
      </main>
    </>
  );
}
