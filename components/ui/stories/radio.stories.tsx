import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Radio } from "../choice";

/**
 * Radio stories — DESIGN-SYSTEM §10; native radio-group semantics:
 * shared `name` gives arrow-key navigation + mutually exclusive state
 * (ACCESSIBILITY §2/§3). Consumers own the fieldset/legend grouping.
 */

const meta = {
  title: "UI/Radio",
  component: Radio,
  args: {
    label: "Newest",
    name: "sort",
  },
  argTypes: {
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Radio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Checked: Story = {
  args: { defaultChecked: true },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/** A real group (S-03 sort): shared name — arrows navigate, selection is exclusive. */
export const Group: Story = {
  render: () => (
    <fieldset className="flex max-w-md flex-col gap-2 border-0 p-0">
      <legend className="mb-2 text-meta text-text-secondary">Sort</legend>
      <Radio name="sort" label="Relevance" defaultChecked />
      <Radio name="sort" label="Newest" />
      <Radio name="sort" label="Rising" />
      <Radio name="sort" label="Most viewed" disabled />
    </fieldset>
  ),
};

export const AllStates: Story = {
  name: "All states",
  render: (args) => (
    <div className="flex flex-col">
      <Radio {...args} label="Default" />
      <Radio {...args} label="Checked" defaultChecked />
      <Radio {...args} label="Disabled" disabled />
      <Radio {...args} label="Disabled + checked" disabled defaultChecked />
    </div>
  ),
};

export const KeyboardGroupNavigation: Story = {
  name: "Keyboard group navigation",
  render: () => (
    <fieldset className="flex max-w-md flex-col gap-2 border-0 p-0">
      <legend className="mb-2 text-meta text-text-secondary">Sort</legend>
      <Radio name="kb-sort" label="Relevance" defaultChecked data-testid="r-relevance" />
      <Radio name="kb-sort" label="Newest" data-testid="r-newest" />
    </fieldset>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const first = canvas.getByTestId("r-relevance");
    await userEvent.tab();
    await expect(document.activeElement).toBe(first);
    await expect(first).toBeChecked();
    // Arrow keys move within the native group.
    await userEvent.keyboard("{ArrowDown}");
    const second = canvas.getByTestId("r-newest");
    await expect(second).toBeChecked();
  },
};
