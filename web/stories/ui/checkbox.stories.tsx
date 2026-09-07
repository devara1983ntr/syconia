import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Checkbox } from "../../../components/ui/choice";

/**
 * Checkbox stories — DESIGN-SYSTEM §10; 44px row targets
 * (ACCESSIBILITY §7); Ostiole Gold checked state (§4).
 */

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  args: {
    label: "Discreet thumbnails",
  },
  argTypes: {
    disabled: { control: "boolean" },
    checked: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const DisabledUnchecked: Story = {
  name: "Disabled (unchecked)",
  args: { disabled: true },
};

export const DisabledChecked: Story = {
  name: "Disabled (checked)",
  args: { disabled: true, defaultChecked: true },
};

/** S-00 drawer session controls (real specced usage context). */
export const SessionControls: Story = {
  name: "Session controls (S-00 drawer)",
  render: () => (
    <div className="flex flex-col">
      <Checkbox label="Discreet thumbnails" defaultChecked />
      <Checkbox label="Clear session traces on exit" />
    </div>
  ),
};

export const AllStates: Story = {
  name: "All states",
  render: (args) => (
    <div className="flex flex-col">
      <Checkbox {...args} label="Default" />
      <Checkbox {...args} label="Checked" defaultChecked />
      <Checkbox {...args} label="Disabled" disabled />
      <Checkbox {...args} label="Disabled + checked" disabled defaultChecked />
    </div>
  ),
};

export const KeyboardOperable: Story = {
  name: "Keyboard operable",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const box = canvas.getByRole("checkbox", { name: "Discreet thumbnails" });
    await userEvent.tab();
    await expect(document.activeElement).toBe(box);
    await userEvent.keyboard(" ");
    await expect(box).toBeChecked();
  },
};
