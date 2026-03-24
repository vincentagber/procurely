import type { Preview } from '@storybook/nextjs-vite';

import "../app/globals.css";

import { withProcurelyProviders } from "../storybook/support/with-procurely-providers";

const preview: Preview = {
  decorators: [withProcurelyProviders],
  parameters: {
    a11y: {
      test: "todo",
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      canvas: {
        sourceState: "shown",
      },
    },
    layout: "padded",
    nextjs: {
      appDirectory: true,
    },
    options: {
      storySort: {
        order: [
          "Design System",
          ["Spacing Scale", "Color Palette", "Typography", "Responsive Breakpoints"],
          "Motion",
          ["Animation Catalog", "State Transition Patterns"],
          "Components",
          ["Navigation", "Forms", "Cards"],
          "Pages",
        ],
      },
    },
  },
};

export default preview;
