import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { getProcurelyContent } from "@/lib/content";

export default async function ForgotPasswordPage() {
  const content = await getProcurelyContent();

  return (
    <main className="min-h-screen bg-[#f6f7fd] px-4 py-12">
      <div className="mx-auto flex min-h-[80vh] max-w-[760px] items-center justify-center">
        <div className="w-full rounded-[34px] border border-slate-100 bg-white px-6 py-14 shadow-[0_36px_90px_rgba(19,24,79,0.08)] md:px-12">
          <div className="mx-auto max-w-[360px]">
            <ForgotPasswordForm
              description={content.authScreens.forgot.description}
              submitLabel={content.authScreens.forgot.submitLabel}
              title={content.authScreens.forgot.title}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
