import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Switch } from "../../../components/ui/switch";

/**
 * Switch stories — DESIGN-SYSTEM §10; role="switch" on a native button
 * (ACCESSIBILITY §3); 44×44 target with the 40×24 track inside (§7).
 */

const meta = {
  title: "UI/Switch",
  component: Switch,
  args: {
    label: "Discreet thumbnails",
  },
  argTypes: {
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const WithHint: Story = {
  args: { hint: "Session-only — never persisted to an account." },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  name: "Disabled (checked)",
  args: { disabled: true, defaultChecked: true },
};

export const AllStates: Story = {
  name: "All states",
  render: (args) => (
    <div className="flex max-w-md flex-col gap-6">
      <Switch {...args} label="Default" />
      <Switch {...args} label="Checked" defaultChecked />
      <Switch {...args} label="With hint" hint="Session-only setting." />
      <Switch {...args} label="Disabled" disabled />
      <Switch {...args} label="Disabled + checked" disabled defaultChecked />
    </div>
  ),
};

export const KeyboardActivation: Story = {
  name: "Keyboard activation",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole("switch", { name: "Discreet thumbnails" });
    await userEvent.tab();
    await expect(document.activeElement).toBe(control);
    await expect(control).toHaveAttribute("aria-checked", "false");
    await userEvent.keyboard(" ");
    await expect(control).toHaveAttribute("aria-checked", "true");
  },
};

export const Controlled: Story = {
  render: () => (
    <Switch
      label="Discreet thumbnails"
      checked
      onCheckedChange={() => {
        // Controlled usage: the parent owns state (form contexts, M2+).
      }}
    />
  ),
};
