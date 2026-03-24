import path from 'node:path';
import { fileURLToPath } from 'node:url';

import type { StorybookConfig } from '@storybook/nextjs-vite';

const storybookDir = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  "stories": [
    "../storybook/**/*.mdx",
    "../storybook/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-a11y",
    "@storybook/addon-docs"
  ],
  "framework": "@storybook/nextjs-vite",
  "staticDirs": [
    "../public"
  ],
  async viteFinal(baseConfig) {
    return {
      ...baseConfig,
      resolve: {
        ...(baseConfig.resolve ?? {}),
        alias: {
          ...(baseConfig.resolve?.alias ?? {}),
          "@": path.resolve(storybookDir, ".."),
        },
      },
      server: {
        ...(baseConfig.server ?? {}),
        fs: {
          ...(baseConfig.server?.fs ?? {}),
          allow: [
            ...(baseConfig.server?.fs?.allow ?? []),
            path.resolve(storybookDir, "../.."),
          ],
        },
      },
    };
  },
};
export default config;
