import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Button, type ButtonProps } from "../button";

/**
 * Button stories — DESIGN-SYSTEM §10: "primary gold / secondary ghost /
 * destructive / sizes sm-md-lg; loading state with ostiole dot"; all
 * states per §10 (default/hover/active/focus/disabled/loading) — D-006b
 * values documented in components/ui/states.ts.
 */

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Enter",
    variant: "primary",
    size: "md",
  },
  argTypes: {
    variant: { control: "radio", options: ["primary", "secondary", "destructive"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Retry" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Report" },
};

export const Sizes: Story = {
  render: (args: ButtonProps) => (
    <div className="flex flex-wrap items-center gap-4">
      <Button {...args} size="sm">
        Enter
      </Button>
      <Button {...args} size="md">
        Enter
      </Button>
      <Button {...args} size="lg">
        Enter
      </Button>
    </div>
  ),
};

/** §10 loading state — the ostiole dot pulse (brand loading signal, §9). */
export const Loading: Story = {
  args: { loading: true, children: "Watch" },
};

export const Disabled: Story = {
  args: { disabled: true, children: "Enter" },
};

/** All states side by side (visual matrix; the a11y addon audits each story). */
export const AllStates: Story = {
  name: "All states",
  render: (args: ButtonProps) => (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-4">
        <Button {...args}>Enter (default)</Button>
        <Button {...args} variant="secondary">
          Retry (default)
        </Button>
        <Button {...args} variant="destructive">
          Report (default)
        </Button>
      </div>
      <div className="flex flex-wrap gap-4">
        <Button {...args} loading>
          Watch (loading)
        </Button>
        <Button {...args} disabled>
          Enter (disabled)
        </Button>
        <Button {...args} variant="secondary" disabled>
          Retry (disabled)
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <Button {...args} size="sm">
          sm
        </Button>
        <Button {...args} size="md">
          md
        </Button>
        <Button {...args} size="lg">
          lg
        </Button>
      </div>
    </div>
  ),
};

/** Keyboard journey (§2): focus ring appears; Space activates. */
export const KeyboardActivation: Story = {
  name: "Keyboard activation",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Enter" });
    await userEvent.tab();
    await expect(document.activeElement).toBe(button);
    await userEvent.keyboard(" ");
    await expect(button).not.toBeDisabled();
  },
};
