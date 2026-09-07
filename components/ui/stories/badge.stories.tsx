import type { Meta, StoryObj } from "@storybook/react-vite";
import { Check } from "lucide-react";

import { Badge, type BadgeProps } from "../badge";

/**
 * Badge stories — DESIGN-SYSTEM §10 "Badge (status/count/source)":
 * outline pills for status/source (hairline + §4 tone), solid pills
 * for counts (variant fill + Obsidian text). Non-interactive (no
 * 44px floor). Icon slot per §7.
 */

const meta = {
  title: "UI/Badge",
  component: Badge,
  args: {
    children: "Verified",
    variant: "success",
  },
  argTypes: {
    variant: {
      control: "radio",
      options: ["neutral", "accent", "success", "warning", "error"],
    },
    solid: { control: "boolean" },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const StatusOutline: Story = {
  name: "Status (outline)",
  args: { variant: "success", children: "Verified" },
};

export const SourceNeutral: Story = {
  name: "Source (neutral outline)",
  args: { variant: "neutral", children: "Provided by VX" },
};

export const CountSolid: Story = {
  name: "Count (solid accent)",
  args: { variant: "accent", solid: true, children: "3" },
};

export const WithIcon: Story = {
  name: "With leading icon (§7)",
  args: {
    variant: "success",
    children: "Synced",
    icon: <Check size={16} strokeWidth={1.5} aria-hidden />,
  },
};

export const AllVariants: Story = {
  name: "All variants (visual matrix)",
  render: (args: BadgeProps) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args}>Provided by VX</Badge>
      <Badge {...args} variant="accent">
        12 videos
      </Badge>
      <Badge {...args} variant="success">
        Verified
      </Badge>
      <Badge {...args} variant="warning">
        SLA 24h
      </Badge>
      <Badge {...args} variant="error">
        Blocked
      </Badge>
      <Badge {...args} variant="accent" solid>
        3
      </Badge>
      <Badge {...args} variant="error" solid>
        Blocked
      </Badge>
    </div>
  ),
};
