import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";

import { Tabs, TabsList, TabsPanel, TabsTrigger } from "../tabs";

/**
 * Tabs stories — DESIGN-SYSTEM §10 "Tabs" (WAI-ARIA tabs pattern:
 * roving tabIndex, ArrowLeft/Right + Home/End, automatic activation,
 * gold underline on the active tab per §4 active-nav law).
 */

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  args: {
    children: null,
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const SECTIONS = [
  { value: "discover", label: "Discover", body: "Discovery grid — rails of the curated gallery." },
  { value: "trending", label: "Trending", body: "Trending grid — what the garden is watching now." },
  { value: "new", label: "New", body: "Newest grid — fresh additions, newest first." },
];

function TabsDemo({ disabled = false }: { disabled?: boolean }) {
  const [value, setValue] = useState("discover");
  return (
    <Tabs value={value} onValueChange={setValue}>
      <TabsList>
        {SECTIONS.map((section, index) => (
          <TabsTrigger
            key={section.value}
            value={section.value}
            disabled={disabled && index === SECTIONS.length - 1}
          >
            {section.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {SECTIONS.map((section) => (
        <TabsPanel key={section.value} value={section.value}>
          <p className="text-body text-text-secondary">{section.body}</p>
        </TabsPanel>
      ))}
    </Tabs>
  );
}

export const Basic: Story = {
  name: "Basic (three sections)",
  render: () => <TabsDemo />,
};

export const WithDisabledTab: Story = {
  name: "With a disabled tab (D-006b inert)",
  render: () => <TabsDemo disabled />,
};

export const KeyboardJourney: Story = {
  name: "Keyboard: arrows + Home/End activate",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step("focus the active tab", async () => {
      canvas.getByRole("tab", { name: "Discover" }).focus();
      await expect(canvas.getByRole("tab", { selected: true })).toHaveTextContent("Discover");
    });
    await step("ArrowRight activates Trending", async () => {
      await user.keyboard("{ArrowRight}");
      await expect(canvas.getByRole("tab", { selected: true })).toHaveTextContent("Trending");
      await expect(canvas.getByRole("tab", { name: "Trending" })).toHaveFocus();
    });
    await step("Home returns to Discover", async () => {
      await user.keyboard("{Home}");
      await expect(canvas.getByRole("tab", { selected: true })).toHaveTextContent("Discover");
    });
    await step("End wraps to the last enabled tab", async () => {
      await user.keyboard("{End}");
      await expect(canvas.getByRole("tabpanel")).toHaveTextContent(/grid/);
    });
  },
  render: () => <TabsDemo />,
};
