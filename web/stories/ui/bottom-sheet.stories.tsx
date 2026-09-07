import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { BottomSheet } from "../../../components/ui/bottom-sheet";
import { Button } from "../../../components/ui/button";

/**
 * BottomSheet stories — DESIGN-SYSTEM §10 "BottomSheet (≤767px)".
 *
 * The sheet is the ≤767px presentation ONLY (SCREENS §213 "centered
 * (d) / bottom-sheet (m ≤767px)"): at canvas widths ≥768px the layer
 * never renders — narrow the Storybook viewport (browser devtools
 * mobile view, e.g. 390×844) and the story becomes fully live. The
 * status line below states the requirement honestly instead of faking
 * a desktop rendering (AGENT §2.1 content law).
 */

const meta = {
  title: "UI/BottomSheet",
  component: BottomSheet,
  args: {
    label: "Actions",
    open: false,
    onDismiss: () => undefined,
    children: null,
  },
} satisfies Meta<typeof BottomSheet>;

export default meta;
type Story = StoryObj<typeof meta>;

function SheetDemo({ title }: { title?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col items-start gap-3">
      <Button onClick={() => setOpen(true)}>Open sheet</Button>
      <p className="text-meta text-text-secondary">
        BottomSheet renders only at viewport widths ≤767px — narrow the
        canvas (devtools mobile view) to use this story.
      </p>
      <BottomSheet label="Actions" open={open} onDismiss={() => setOpen(false)} title={title}>
        <div className="flex flex-col gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Copy link
          </Button>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Report
          </Button>
          <Button variant="destructive" onClick={() => setOpen(false)}>
            Hide this video
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
}

export const Actions: Story = {
  name: "Actions sheet (S-02 mobile overflow pattern)",
  render: () => <SheetDemo title="Choose an action" />,
};

export const NoTitle: Story = {
  name: "Without visible title (aria-label only)",
  render: () => <SheetDemo />,
};

export const KeyboardJourney: Story = {
  name: "Keyboard (narrow viewport): ESC + focus return",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    await step("guard: this journey needs the ≤767px canvas", async () => {
      await expect(isMobile).toBe(true);
    });
    await step("open + ESC closes with focus back on the trigger", async () => {
      const trigger = canvas.getByRole("button", { name: "Open sheet" });
      await user.click(trigger);
      await expect(canvas.getByRole("dialog")).toBeInTheDocument();
      await user.keyboard("{Escape}");
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      await expect(trigger).toHaveFocus();
    });
  },
  render: () => <SheetDemo title="Choose an action" />,
};
