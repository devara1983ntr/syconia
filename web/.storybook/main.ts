import type { StorybookConfig } from "@storybook/react-vite";

/**
 * SYCONIA Storybook — the primitive gallery harness (DESIGN-SYSTEM §10
 * "Storybook entry [REQUIRED]" per primitive; TESTING §8).
 *
 * Installed at M1-T008 (first stories: primitives batch 1) — M1-T009/T010
 * add their batches' stories; M1-T018 wires the visual-regression
 * harness (Playwright screenshots of this gallery, 0.1% threshold).
 * Tailwind v4 runs through the Vite PostCSS pipeline
 * (postcss.config.mjs → @tailwindcss/postcss).
 */

const config: StorybookConfig = {
  stories: ["../stories/ui/**/*.stories.@(ts|tsx)"],
  addons: ["@storybook/addon-a11y"],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  staticDirs: ["../../public"],
};

export default config;
