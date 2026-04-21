import type { Decorator } from "@storybook/nextjs-vite";

import { Providers } from "@/app/providers";
import { procurelyContent } from "@/storybook/fixtures/procurely-content";

export const withProcurelyProviders: Decorator = (Story) => (
  <Providers
    withDrawers
  >
    <div className="min-h-screen bg-white text-text-navy-900">
      <Story />
    </div>
  </Providers>
);
