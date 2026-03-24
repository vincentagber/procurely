import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { SiteHeader } from "@/components/site-header";
import { procurelyContent } from "@/storybook/fixtures/procurely-content";

const meta = {
  title: "Components/Navigation/Site Header",
  component: SiteHeader,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Global header reference for desktop and mobile navigation. ARIA labels expected in production: `Search product`, `Wishlist`, `Account`, `Open cart`, and `Toggle navigation`. Keyboard behavior should preserve native link and button semantics across all controls.",
      },
    },
  },
  args: {
    navigation: procurelyContent.navigation,
    site: procurelyContent.site,
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
