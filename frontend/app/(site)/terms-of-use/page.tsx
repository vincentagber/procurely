import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use | Procurely",
  description: "Read the rules and guidelines governing the use of the Procurely platform.",
};

export default function TermsOfUsePage() {
  return (
    <div className="bg-[#f6f7fd] min-h-screen pb-32">
      {/* Header */}
      <section className="bg-[#13184f] pt-28 pb-40 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px', opacity: 0.05 }}></div>
        <div className="container-shell relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">Terms of Use</h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto font-medium">Effective as of {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </section>

      {/* Content */}
      <section className="container-shell -mt-24 relative z-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-white p-8 sm:p-14 lg:p-16 shadow-[0_10px_50px_rgb(0,0,0,0.05)] border border-slate-100">
          <div className="space-y-10 text-slate-600 leading-relaxed text-lg">
            <div>
               <h2 className="text-2xl font-bold text-[#13184f] mb-4">1. Agreement to Terms</h2>
               <p>These Terms of Use constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and Procurely ("we," "us" or "our"), concerning your access to and use of our platform as well as any other media form, mobile application, or website related, linked, or otherwise connected thereto.</p>
            </div>
            
            <div>
               <h2 className="text-2xl font-bold text-[#13184f] mb-4">2. Intellectual Property Rights</h2>
               <p>Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws.</p>
            </div>

            <div>
               <h2 className="text-2xl font-bold text-[#13184f] mb-4">3. User Representations</h2>
               <p className="mb-4">By using the Site, you represent and warrant that:</p>
               <ol className="list-decimal pl-6 space-y-3">
                  <li>All registration information you submit will be true, accurate, current, and complete.</li>
                  <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
                  <li>You have the legal capacity and you agree to comply with these Terms of Use.</li>
                  <li>You will not access the Site through automated or non-human means, whether through a bot, script, or otherwise.</li>
                  <li>You will not use the Site for any illegal or unauthorized purpose.</li>
               </ol>
            </div>

            <div>
               <h2 className="text-2xl font-bold text-[#13184f] mb-4">4. BOQ & Procurement Process</h2>
               <p>When you submit a Bill of Quantities (BOQ) or request a quote through our platform, our AI and procurement specialists will analyze your request based on current market data and availability. Prices provided are estimates and are only confirmed upon final checkout and invoice generation. We reserve the right to suggest alternative materials or adjust prices if supplier inventory changes before final confirmation.</p>
            </div>

            <div>
               <h2 className="text-2xl font-bold text-[#13184f] mb-4">5. Modifications and Interruptions</h2>
               <p>We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason at our sole discretion without notice. However, we have no obligation to update any information on our Site. We also reserve the right to modify or discontinue all or part of the Site without notice at any time.</p>
            </div>

            <hr className="my-10 border-slate-200" />
            
            <p className="text-slate-500 text-base">For resolving complaints regarding the site or to receive further information regarding use of the site, please contact us at <Link href="mailto:support@procurely.com" className="font-bold text-[#1900ff] hover:underline">support@procurely.com</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
