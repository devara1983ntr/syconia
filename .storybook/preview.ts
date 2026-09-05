import type { Preview } from "@storybook/react-vite";

import "../app/styles/tokens.css";
import "../app/styles/globals.css";

/**
 * Preview: the app's token layer + base layer load exactly as in the
 * product (colors/radii/spacing/focus ring/press scale all flow from
 * tokens.css; globals.css adds the base body/selection/reduced-motion
 * rules + the .sy-press component class). Fonts resolve through the
 * designed fallback chain (next/font is a Next-only pipeline — outside
 * a Next build the literal family fallbacks apply, per the M1-T004
 * token wiring note).
 *
 * Backgrounds use token values only (no raw hex — G-8).
 */

const preview: Preview = {
  parameters: {
    backgrounds: {
      options: {
        obsidian: { name: "Obsidian (§4 background)", value: "var(--color-background)" },
        surface: { name: "Surface (§4)", value: "var(--color-surface)" },
        emerald: { name: "Night Emerald (§4)", value: "var(--color-brand-emerald)" },
      },
    },
    a11y: {
      // T008 acceptance: axe zero critical per primitive (config
      // narrowed to critical violations; contrast is covered by the
      // token-level unit tests, and jsdom-independent layout rules are
      // incomplete in the Storybook DOM environment only when elements
      // are off-canvas).
      config: {
        rules: [
          // jsdom-free browser rules that need real layout are enabled by
          // default; nothing disabled — zero critical is the bar.
        ],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
