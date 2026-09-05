import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Modal } from "../modal";
import { Button } from "../button";
import { Input, Textarea } from "../field";

/**
 * Modal stories — DESIGN-SYSTEM §10 "Modal" (§9 scale .96→1 + fade
 * 200ms; SCREENS §213 centered; focus trap + ESC + scrim tap + X).
 */

const meta = {
  title: "UI/Modal",
  component: Modal,
  args: {
    label: "Dialog",
    open: false,
    onDismiss: () => undefined,
    children: null,
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

function ModalDemo({
  title,
  closeButton = true,
}: {
  title?: string;
  closeButton?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Modal
        label="Report video"
        open={open}
        onDismiss={() => setOpen(false)}
        title={title}
        closeButton={closeButton}
      >
        <form className="flex flex-col gap-4">
          <Input id="report-email" label="Email (optional)" type="email" hint="Used only for this report." />
          <Textarea id="report-details" label="Details" rows={3} required />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setOpen(false)}>Report</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export const Basic: Story = {
  name: "Basic (title + form)",
  render: () => <ModalDemo title="Report this video" />,
};

export const WithoutTitle: Story = {
  name: "Without visible title (aria-label only)",
  render: () => <ModalDemo />,
};

export const WithoutCloseButton: Story = {
  name: "Without X (choice-driven dialogs)",
  render: () => <ModalDemo closeButton={false} title="Choose" />,
};

export const KeyboardJourney: Story = {
  name: "Keyboard: trap + ESC + focus return",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step("trigger opens; focus lands in the dialog", async () => {
      const trigger = canvas.getByRole("button", { name: "Open dialog" });
      await user.click(trigger);
      await expect(canvas.getByRole("dialog")).toHaveFocus();
    });
    await step("Tab cycles inside the dialog (trap)", async () => {
      await user.tab();
      await expect(canvas.getByRole("button", { name: "Close" })).toHaveFocus();
      await user.tab();
      await user.tab();
      await user.tab();
      // Wrap: back to the first focusable.
      await expect(canvas.getByRole("button", { name: "Close" })).toHaveFocus();
    });
    await step("ESC closes and focus returns to the trigger", async () => {
      await user.keyboard("{Escape}");
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: "Open dialog" })).toHaveFocus();
    });
  },
  render: () => <ModalDemo title="Report this video" />,
};
