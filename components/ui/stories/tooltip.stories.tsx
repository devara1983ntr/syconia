import type { Meta, StoryObj } from "@storybook/react-vite";
import { userEvent, within } from "storybook/test";

import { Tooltip } from "../tooltip";
import { Button, IconButton } from "../button";
import { X } from "lucide-react";

/**
 * Tooltip stories — DESIGN-SYSTEM §10 "Tooltip (focus+hover, 300ms
 * delay, ESC-dismiss)". Hover or focus the triggers for ~300ms; ESC
 * dismisses. Keyboard play focuses the trigger via Tab.
 */

const meta = {
  title: "UI/Tooltip",
  component: Tooltip,
  args: {
    label: "Copy link",
    children: <Button variant="secondary">Copy link</Button>,
  },
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OnButton: Story = {
  name: "On a button",
  render: (args) => (
    <Tooltip label={args.label}>
      <Button variant="secondary">Copy link</Button>
    </Tooltip>
  ),
};

export const OnIconButton: Story = {
  name: "On an icon button (§3 aria-label + tooltip)",
  render: (args) => (
    <Tooltip label={args.label}>
      <IconButton aria-label="Clear search" variant="ghost">
        <X size={20} strokeWidth={1.5} aria-hidden />
      </IconButton>
    </Tooltip>
  ),
};

export const AllTriggers: Story = {
  name: "Trigger matrix (hover/focus each)",
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Tooltip label="Copy link">
        <Button variant="secondary">Copy link</Button>
      </Tooltip>
      <Tooltip label="Retry the last action">
        <Button variant="primary">Retry</Button>
      </Tooltip>
      <Tooltip label="Dismiss the notification">
        <IconButton aria-label="Dismiss" variant="ghost">
          <X size={20} strokeWidth={1.5} aria-hidden />
        </IconButton>
      </Tooltip>
    </div>
  ),
};

export const KeyboardJourney: Story = {
  name: "Keyboard: Tab → tooltip, ESC → dismiss",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const trigger = canvas.getByRole("button", { name: "Copy link" });
    await user.tab();
    // 300ms §10 delay elapses in real time during the pause below.
    await new Promise((resolve) => setTimeout(resolve, 400));
    await user.tab(); // blur hides
    await trigger.focus();
    await new Promise((resolve) => setTimeout(resolve, 400));
    await user.keyboard("{Escape}");
  },
  render: () => (
    <Tooltip label="Copy link">
      <Button variant="secondary">Copy link</Button>
    </Tooltip>
  ),
};
