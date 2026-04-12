import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Procurely",
  description: "Learn about how Procurely protects your data and privacy.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[#f6f7fd] min-h-screen pb-32">
      {/* Header */}
      <section className="bg-[#13184f] pt-28 pb-40 text-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-white/5" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px', opacity: 0.05 }}></div>
        <div className="container-shell relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6">Privacy Policy</h1>
          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto font-medium">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </section>

      {/* Content */}
      <section className="container-shell -mt-24 relative z-20 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2.5rem] bg-white p-8 sm:p-14 lg:p-16 shadow-[0_10px_50px_rgb(0,0,0,0.05)] border border-slate-100">
          <div className="space-y-10 text-slate-600 leading-relaxed text-lg">
            <div>
               <h2 className="text-2xl font-bold text-[#13184f] mb-4">1. Introduction</h2>
               <p>Welcome to Procurely. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) and tell you about your privacy rights and how the law protects you.</p>
            </div>
            
            <div>
               <h2 className="text-2xl font-bold text-[#13184f] mb-4">2. The Data We Collect About You</h2>
               <p className="mb-4">Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store, and transfer different kinds of personal data about you which we have grouped together as follows:</p>
               <ul className="list-disc pl-6 space-y-3">
                  <li><strong className="text-slate-800">Identity Data</strong> includes first name, last name, username or similar identifier, title, and company name.</li>
                  <li><strong className="text-slate-800">Contact Data</strong> includes billing address, delivery address, email address, and telephone numbers.</li>
                  <li><strong className="text-slate-800">Financial Data</strong> includes bank account and payment card details.</li>
                  <li><strong className="text-slate-800">Transaction Data</strong> includes details about payments to and from you and other details of products and services you have purchased from us.</li>
                  <li><strong className="text-slate-800">Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
               </ul>
            </div>

            <div>
               <h2 className="text-2xl font-bold text-[#13184f] mb-4">3. How We Use Your Personal Data</h2>
               <p className="mb-4">We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:</p>
               <ul className="list-disc pl-6 space-y-3">
                  <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., fulfilling building material orders or processing your BOQ).</li>
                  <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                  <li>Where we need to comply with a legal obligation.</li>
               </ul>
            </div>

            <div>
               <h2 className="text-2xl font-bold text-[#13184f] mb-4">4. Data Security</h2>
               <p>We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and other third parties who have a business need to know.</p>
            </div>

            <div>
               <h2 className="text-2xl font-bold text-[#13184f] mb-4">5. Your Legal Rights</h2>
               <p>Under certain circumstances, you have rights under data protection laws in relation to your personal data, including the right to request access, correction, erasure, restriction, transfer, to object to processing, to portability of data, and (where the lawful ground of processing is consent) to withdraw consent.</p>
            </div>

            <hr className="my-10 border-slate-200" />
            
            <p className="text-slate-500 text-base">If you have any questions about this privacy policy or our privacy practices, please contact our Data Privacy Manager at <Link href="mailto:privacy@useprocurely.com" className="font-bold text-[#1900ff] hover:underline">privacy@useprocurely.com</Link>.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
