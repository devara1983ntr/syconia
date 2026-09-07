import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { RotateCw, Search, X } from "lucide-react";

import { IconButton, type IconButtonProps } from "../button";

/**
 * IconButton stories — DESIGN-SYSTEM §10; ACCESSIBILITY §3: icon-only
 * buttons carry aria-label (type-enforced in IconButtonProps). Icons
 * from the mapped inventory only (ICON-SYSTEM.md: search = header
 * search S-00; x = close; rotate-cw = retry E-01/E-07), lucide 1.5px
 * stroke, 20px dense / 24px standalone.
 */

const meta = {
  title: "UI/IconButton",
  component: IconButton,
  args: {
    "aria-label": "Search",
    variant: "ghost",
    size: "md",
    children: <Search strokeWidth={1.5} size={20} />,
  },
  argTypes: {
    variant: { control: "radio", options: ["ghost", "solid"] },
    size: { control: "radio", options: ["sm", "md", "lg"] },
    loading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const GhostSearch: Story = {
  name: "Ghost (search — S-00 header)",
};

export const SolidClose: Story = {
  name: "Solid (close)",
  args: {
    "aria-label": "Close",
    variant: "solid",
    children: <X strokeWidth={1.5} size={20} />,
  },
};

export const DenseloadRetry: Story = {
  name: "Loading (retry — E-01 ladder)",
  args: {
    "aria-label": "Retry",
    loading: true,
    children: <RotateCw strokeWidth={1.5} size={20} />,
  },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllStates: Story = {
  name: "All states",
  render: (args: IconButtonProps) => (
    <div className="flex flex-wrap items-center gap-4">
      <IconButton {...args} aria-label="Search">
        <Search strokeWidth={1.5} size={20} />
      </IconButton>
      <IconButton {...args} aria-label="Search" variant="solid">
        <Search strokeWidth={1.5} size={24} />
      </IconButton>
      <IconButton {...args} aria-label="Retry" loading>
        <RotateCw strokeWidth={1.5} size={20} />
      </IconButton>
      <IconButton {...args} aria-label="Close" disabled>
        <X strokeWidth={1.5} size={20} />
      </IconButton>
      <IconButton {...args} aria-label="Search" size="sm">
        <Search strokeWidth={1.5} size={20} />
      </IconButton>
      <IconButton {...args} aria-label="Search" size="lg">
        <Search strokeWidth={1.5} size={24} />
      </IconButton>
    </div>
  ),
};

export const KeyboardActivation: Story = {
  name: "Keyboard activation",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Search" });
    await userEvent.tab();
    await expect(document.activeElement).toBe(button);
    await userEvent.keyboard("Enter");
    await expect(button).toBeEnabled();
  },
};
