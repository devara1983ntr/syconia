import type { Meta, StoryObj } from "@storybook/react-vite";

import { Alert, type AlertProps } from "../alert";

/**
 * Alert stories — DESIGN-SYSTEM §10 "Alert" (ACCESSIBILITY §3:
 * role=alert for warning/error assertive, role=status for
 * info/success polite; §7 variant icons; §12 voice samples).
 */

const meta = {
  title: "UI/Alert",
  component: Alert,
  args: {
    variant: "info",
    children: "Scheduled maintenance tonight.",
  },
  argTypes: {
    variant: { control: "radio", options: ["info", "success", "warning", "error"] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {
  args: { variant: "info", title: "Maintenance", children: "Scheduled maintenance tonight." },
};

export const Success: Story = {
  args: {
    variant: "success",
    title: "Recorded",
    children: "Reference TKN-4821 recorded.",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
    title: "Under review",
    children: "This source is under review. Content may change.",
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    title: "Unreachable",
    children: "The gallery is unreachable. Retry.",
  },
};

export const AllVariants: Story = {
  name: "All variants (visual matrix)",
  render: (args: AlertProps) => (
    <div className="flex flex-col gap-4">
      <Alert {...args} variant="info" title="Maintenance">
        Scheduled maintenance tonight.
      </Alert>
      <Alert {...args} variant="success" title="Recorded">
        Reference TKN-4821 recorded.
      </Alert>
      <Alert {...args} variant="warning" title="Under review">
        This source is under review. Content may change.
      </Alert>
      <Alert {...args} variant="error" title="Unreachable">
        The gallery is unreachable. Retry.
      </Alert>
    </div>
  ),
};
