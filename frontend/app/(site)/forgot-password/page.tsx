import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Reveal } from "@/components/ui/reveal";
import { getProcurelyContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Forgot Password | Procurely",
  description: "Reset your Procurely account password to regain access to your building materials dashboard and orders.",
  keywords: "forgot password, reset password, Procurely account recovery",
};

export default async function ForgotPasswordPage() {
  const content = await getProcurelyContent();

  return (
    <main className="bg-[#f6f7fd] min-h-[85vh] py-16 sm:py-24">
      <div className="container-shell mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-24">
          
          <Reveal className="w-full lg:w-1/2 max-w-xl" distance={44}>
            <div className="hidden lg:block">
              <div className="inline-flex size-14 rounded-2xl bg-[#eff1fa] items-center justify-center text-[#1900ff] mb-8 shadow-sm">
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-4xl lg:text-[46px] font-black text-[#13184f] mb-6 leading-[1.15] tracking-tight">Regain access to your account</h1>
              <p className="text-lg text-slate-500 font-medium mb-10 leading-relaxed max-w-md">
                It happens to the best of us. Check your email for a secure link from Procurely to reset your password and continue building.
              </p>
              
              <div className="flex items-center gap-5 bg-white p-6 rounded-[22px] border border-slate-100 shadow-[0_4px_30px_rgb(0,0,0,0.02)]">
                 <div className="size-[46px] shrink-0 bg-[#e8fbf3] text-[#059669] rounded-xl flex items-center justify-center font-bold">
                   <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 <div>
                   <h4 className="font-bold text-[15px] text-[#13184f] mb-0.5 tracking-tight">Military-grade Encryption</h4>
                   <p className="text-[13px] font-medium text-slate-400 leading-snug">Your credentials are cryptographically hashed for maximum security protocols.</p>
                 </div>
              </div>
            </div>
          </Reveal>

          <Reveal className="w-full lg:w-[480px] shrink-0" amount={0}>
            <div className="relative w-full rounded-[2.5rem] border border-slate-100 bg-white shadow-[0_12px_60px_rgba(19,24,79,0.06)] overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[6px] bg-[#1900ff]"></div>
              
              <div className="p-10 sm:p-14">
                <div className="mb-8 block lg:hidden">
                  <div className="inline-flex size-[42px] rounded-xl bg-[#eff1fa] items-center justify-center text-[#1900ff] mb-6 shadow-sm">
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#13184f] tracking-tight mb-3">Forgot Password</h2>
                  <p className="text-[15px] text-slate-500 font-medium">Enter your email address to receive a secure recovery link.</p>
                </div>
                
                <ForgotPasswordForm
                  description={content.authScreens.forgot.description}
                  submitLabel={content.authScreens.forgot.submitLabel}
                  title={content.authScreens.forgot.title}
                />
                
                <div className="mt-10 text-center border-t border-slate-100 pt-8">
                   <p className="text-[14px] font-semibold text-slate-500">
                     Remember your password?{" "}
                     <a href="/login" className="text-[#1900ff] font-bold hover:underline underline-offset-4 decoration-[2px] transition-all">
                       Log in here
                     </a>
                   </p>
                </div>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </main>
  );
}
