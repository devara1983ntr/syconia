import type { Meta, StoryObj } from "@storybook/react-vite";

import { Breadcrumb } from "../breadcrumb";

/**
 * Breadcrumb stories — DESIGN-SYSTEM §10 "Breadcrumb" (nav > ol > li,
 * aria-current on the last item, §7 chevron separators, wraps at
 * narrow widths per §8).
 */

const meta = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Categories", href: "#" },
      { label: "Emerald Bloom" },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "Basic (two links + current)",
};

export const DeepTrail: Story = {
  name: "Deep trail (wraps at §8 narrow widths)",
  args: {
    items: [
      { label: "Home", href: "#" },
      { label: "Categories", href: "#" },
      { label: "Curated sets", href: "#" },
      { label: "Emerald season", href: "#" },
      { label: "Bloom #42" },
    ],
  },
};

export const SingleCurrent: Story = {
  name: "Single item (current page only)",
  args: { items: [{ label: "Search" }] },
};
