import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Select, type SelectOption } from "../field";

/**
 * Select stories — DESIGN-SYSTEM §10; native <select> semantics
 * (ACCESSIBILITY §3) with the lucide ChevronDown affordance (§7).
 */

const SORT_OPTIONS: ReadonlyArray<SelectOption> = [
  { value: "relevance", label: "Relevance" },
  { value: "newest", label: "Newest" },
  { value: "rising", label: "Rising" },
  { value: "views", label: "Most viewed" },
];

const meta = {
  title: "UI/Select",
  component: Select,
  args: {
    label: "Sort",
    size: "md",
    options: SORT_OPTIONS,
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    error: { control: "text" },
    hint: { control: "text" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithHint: Story = {
  args: { hint: "Sort applies to the current filter set." },
};

export const WithError: Story = {
  args: { error: "Sort is unavailable offline — showing cached order." },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AllStates: Story = {
  name: "All states",
  render: (args) => (
    <div className="flex max-w-md flex-col gap-6">
      <Select {...args} label="Sort" />
      <Select {...args} label="Sort" hint="Sort applies to the current filter set." />
      <Select {...args} label="Sort" error="Unavailable offline." />
      <Select {...args} label="Sort" disabled />
    </div>
  ),
};

export const KeyboardOperable: Story = {
  name: "Keyboard operable",
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const control = canvas.getByRole("combobox", { name: "Sort" });
    await userEvent.tab();
    await expect(document.activeElement).toBe(control);
    // Native select: arrow keys move options; the value updates.
    await userEvent.keyboard("{ArrowDown}");
    await expect((control as HTMLSelectElement).value).toBe("relevance");
  },
};
