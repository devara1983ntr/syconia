import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { ToastProvider, useToast } from "../toast";
import { Button } from "../button";

/**
 * Toast stories — DESIGN-SYSTEM §10 "Toast" (§9 slide-up + fade 200ms,
 * auto-dismiss 4s pause on hover/focus; S-00 bottom-center ≤767px /
 * bottom-right desktop, role=status, dismissible). The preview
 * decorator mounts the real ToastProvider — this control panel drives
 * it the way app code does (useToast()).
 */

const meta = {
  title: "UI/Toast",
  component: ToastProvider,
  args: {
    children: null,
  },
} satisfies Meta<typeof ToastProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

function ToastControls() {
  const { toast } = useToast();
  return (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="secondary"
        onClick={() => toast({ message: "Link copied", variant: "success" })}
      >
        Success toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ message: "You are offline. Previously visited pages remain available.", variant: "warning" })}
      >
        Warning toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ message: "The gallery is unreachable. Retry.", variant: "error" })}
      >
        Error toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ message: "Back online. Visible data refreshed." })}
      >
        Info toast
      </Button>
      <Button
        variant="secondary"
        onClick={() => toast({ message: "Reference TKN-4821 recorded", duration: 8000 })}
      >
        Long copy (8s)
      </Button>
    </div>
  );
}

export const Playground: Story = {
  name: "Playground (real provider + region)",
  render: () => <ToastControls />,
};

export const PauseOnHoverFocus: Story = {
  name: "4s auto-dismiss pauses on hover/focus",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step("fire a toast and hover it immediately", async () => {
      await user.click(canvas.getByRole("button", { name: "Success toast" }));
      const toast = canvas.getByText("Link copied").closest("div");
      await user.hover(toast!);
    });
    await step("hovering holds it past the 4s §9 window", async () => {
      await new Promise((resolve) => setTimeout(resolve, 4300));
      await expect(canvas.getByText("Link copied")).toBeInTheDocument();
    });
    await step("unhovering resumes — the remaining window drains", async () => {
      const toast = canvas.getByText("Link copied").closest("div");
      await user.unhover(toast!);
      await new Promise((resolve) => setTimeout(resolve, 4300));
      await expect(canvas.queryByText("Link copied")).not.toBeInTheDocument();
    });
  },
  render: () => <ToastControls />,
};
