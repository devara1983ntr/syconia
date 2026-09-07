import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Check, RotateCw } from "lucide-react";

import { Dropdown } from "../../../components/ui/dropdown";

/**
 * Dropdown stories — DESIGN-SYSTEM §10 "Dropdown" (S-02 row-overflow
 * pattern: "Copy link" / "Report"). APG menu-button keyboard model.
 */

const meta = {
  title: "UI/Dropdown",
  component: Dropdown,
  args: {
    label: "Actions",
    items: [
      { id: "copy", label: "Copy link", icon: <Check size={20} strokeWidth={1.5} aria-hidden /> },
      { id: "retry", label: "Retry", icon: <RotateCw size={20} strokeWidth={1.5} aria-hidden /> },
      { id: "report", label: "Report" },
      { id: "hide", label: "Hide this video", destructive: true },
    ],
    onSelect: (id: string) => {
      // Selection recorded by the story (the action panel shows it).
      void id;
    },
  },
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  name: "Closed (trigger)",
};

export const KeyboardJourney: Story = {
  name: "Keyboard: open, arrows, ESC",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step("opens with focus on the first item", async () => {
      const trigger = canvas.getByRole("button", { name: /Actions/ });
      await user.click(trigger);
      await expect(canvas.getByRole("menu")).toBeInTheDocument();
      await expect(canvas.getAllByRole("menuitem")[0]).toHaveFocus();
    });
    await step("arrows cycle with wrap", async () => {
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await expect(canvas.getAllByRole("menuitem")[2]).toHaveFocus();
      await user.keyboard("{End}");
      await expect(canvas.getAllByRole("menuitem")[3]).toHaveFocus();
      await user.keyboard("{Home}");
      await expect(canvas.getAllByRole("menuitem")[0]).toHaveFocus();
    });
    await step("ESC closes and returns focus to the trigger", async () => {
      await user.keyboard("{Escape}");
      await expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: /Actions/ })).toHaveFocus();
    });
  },
};

export const AlignedEnd: Story = {
  name: "Aligned end (overflow menus)",
  args: { align: "end" },
};

export const DestructiveItem: Story = {
  name: "Destructive item (error tone)",
  args: {
    items: [
      { id: "copy", label: "Copy link" },
      { id: "hide", label: "Hide this video", destructive: true },
    ],
  },
};
