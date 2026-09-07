import type { Meta, StoryObj } from "@storybook/react-vite";

import { Textarea } from "../field";

/**
 * Textarea stories — DESIGN-SYSTEM §10; hint/error slots; measure rule
 * (§5: 70–80ch) applies to long-form contexts, not control inputs.
 */

const meta = {
  title: "UI/Textarea",
  component: Textarea,
  args: {
    label: "Report details",
    size: "md",
    rows: 4,
    placeholder: "What happened? (optional context)",
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    error: { control: "text" },
    hint: { control: "text" },
    rows: { control: "number", min: 2, max: 12 },
  },
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Only what you’re comfortable sharing — nothing is required." },
};

export const WithError: Story = {
  args: { error: "Report could not be submitted — try again.", defaultValue: "x" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Report intake is closed for this item." },
};

export const AllStates: Story = {
  name: "All states",
  render: (args) => (
    <div className="flex max-w-md flex-col gap-6">
      <Textarea {...args} label="Report details" />
      <Textarea {...args} label="Report details" hint="Only what you’re comfortable sharing." />
      <Textarea {...args} label="Report details" error="Could not submit — try again." />
      <Textarea {...args} label="Report details" disabled />
    </div>
  ),
};
