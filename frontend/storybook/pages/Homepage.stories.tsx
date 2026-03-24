import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { HomePage } from "@/components/home/home-page";
import { procurelyContent } from "@/storybook/fixtures/procurely-content";

const meta = {
  title: "Pages/Homepage",
  component: HomePage,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full Procurely homepage reference with the current design system, motion patterns, and merchandising content. Use this story to visually verify responsive layout, section spacing, and overall brand rhythm.",
      },
    },
  },
  args: {
    content: procurelyContent,
  },
} satisfies Meta<typeof HomePage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSearchResults: Story = {
  args: {
    content: procurelyContent,
    searchQuery: "sand",
  },
};
