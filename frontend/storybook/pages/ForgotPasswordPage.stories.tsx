import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ForgotPasswordForm } from "@/components/forms/forgot-password-form";
import { procurelyContent } from "@/storybook/fixtures/procurely-content";

const meta = {
  title: "Pages/Forgot Password",
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Standalone password recovery page reference. Accessibility requirements: explicit email label, submit button with native button semantics, and a back-to-login link that stays in the keyboard tab order.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <main className="relative isolate min-h-screen overflow-hidden bg-[#f6f7fd] px-4 py-6 sm:px-6 sm:py-10">
      <div className="absolute left-1/2 top-8 h-48 w-48 -translate-x-1/2 rounded-full bg-primary-blue-50/40 blur-3xl sm:h-72 sm:w-72" />
      <div className="absolute bottom-10 right-[14%] h-32 w-32 rounded-full bg-secondary-orange-50/60 blur-3xl sm:h-44 sm:w-44" />
      <div className="relative mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1080px] items-center justify-center">
        <div className="w-full max-w-[512px] rounded-[34px] border border-border-subtle bg-white px-6 py-12 shadow-panel sm:px-12 sm:py-14">
          <div className="mx-auto max-w-[340px]">
            <ForgotPasswordForm
              description={procurelyContent.authScreens.forgot.description}
              submitLabel={procurelyContent.authScreens.forgot.submitLabel}
              title={procurelyContent.authScreens.forgot.title}
            />
          </div>
        </div>
      </div>
    </main>
  ),
};
