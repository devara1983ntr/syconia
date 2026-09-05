import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "../field";

/**
 * Input stories — DESIGN-SYSTEM §10 "Input (with hint/error slots)";
 * states default/hover/focus/disabled/error; ACCESSIBILITY §3 label +
 * aria-describedby wiring.
 */

const meta = {
  title: "UI/Input",
  component: Input,
  args: {
    label: "Search",
    size: "md",
    placeholder: "Titles, tags, sources…",
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    error: { control: "text" },
    hint: { control: "text" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Suggests as you type — arrow keys navigate." },
};

export const WithError: Story = {
  args: { error: "Filters never auto-relax — check your terms.", defaultValue: "z" },
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "Suspended source" },
};

export const Required: Story = {
  args: { required: true, label: "Contact email" },
};

export const AllStates: Story = {
  name: "All states",
  render: (args) => (
    <div className="flex max-w-md flex-col gap-6">
      <Input {...args} label="Search" placeholder="Default" />
      <Input {...args} label="Search" placeholder="With hint" hint="Suggests as you type." />
      <Input {...args} label="Search" placeholder="Error" error="Check your terms." defaultValue="z" />
      <Input {...args} label="Search" placeholder="Disabled" disabled defaultValue="Suspended source" />
      <div className="flex gap-4">
        <Input {...args} size="sm" label="sm" placeholder="13px" />
        <Input {...args} size="md" label="md" placeholder="16px" />
      </div>
    </div>
  ),
};
