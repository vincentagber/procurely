import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { Reveal } from "@/components/ui/reveal";
import { readLocalContent } from "@/lib/content";

export const metadata: Metadata = {
  title: "Forgot Password | Procurely",
  description: "Reset your Procurely account password to regain access to your building materials dashboard and orders.",
  keywords: "forgot password, reset password, Procurely account recovery",
};

export default async function ForgotPasswordPage() {
  const content = await readLocalContent();

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f6f7fd] px-4 py-6 sm:px-6 sm:py-10">
      <div className="absolute left-1/2 top-8 h-48 w-48 -translate-x-1/2 rounded-full bg-primary-blue-50/40 blur-3xl sm:h-72 sm:w-72" />
      <div className="absolute bottom-10 right-[14%] h-32 w-32 rounded-full bg-secondary-orange-50/60 blur-3xl sm:h-44 sm:w-44" />

      <div className="relative mx-auto flex min-h-[calc(100vh-3rem)] max-w-[1080px] items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <Reveal className="w-full max-w-[512px]" amount={0.24}>
          <div className="w-full rounded-[28px] border border-neutral-200/80 bg-white px-6 py-12 shadow-panel sm:rounded-[34px] sm:px-12 sm:py-14">
            <div className="mx-auto max-w-[340px]">
              <ForgotPasswordForm
                description={content.authScreens.forgot.description}
                submitLabel={content.authScreens.forgot.submitLabel}
                title={content.authScreens.forgot.title}
              />
            </div>
          </div>
        </Reveal>
      </div>
    </main>
  );
}
