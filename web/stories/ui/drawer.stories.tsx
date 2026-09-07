import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, userEvent, within } from "storybook/test";
import { Eye, Eraser } from "lucide-react";

import { Drawer } from "../../../components/ui/drawer";
import { Button } from "../../../components/ui/button";

/**
 * Drawer stories — DESIGN-SYSTEM §10 "Drawer" (S-00: width 88vw max
 * 320px, glass + 12px blur, slides from the left 260ms
 * cubic-bezier(0.22,1,0.36,1); focus trap/ESC/scrim/X; §7 nav rows
 * 48px).
 */

const meta = {
  title: "UI/Drawer",
  component: Drawer,
  args: {
    label: "Menu",
    open: false,
    onDismiss: () => undefined,
    children: null,
  },
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

const NAV_SECTIONS = [
  {
    heading: "DISCOVER",
    links: ["Home", "Trending", "New", "Rising"],
  },
  {
    heading: "INFORMATION",
    links: ["About", "Contact"],
  },
];

function DrawerDemo({ side = "left" as const, title }: { side?: "left" | "right"; title?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button onClick={() => setOpen(true)}>{side === "left" ? "Open menu" : "Open filters"}</Button>
      <Drawer label="Menu" open={open} onDismiss={() => setOpen(false)} side={side} title={title}>
        <nav aria-label="Menu">
          {NAV_SECTIONS.map((section) => (
            <section key={section.heading} className="mb-6">
              <p className="mb-2 text-overline text-text-tertiary">{section.heading}</p>
              <ul>
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="flex items-center px-2 text-body text-text-secondary hover:text-accent"
                      style={{ minHeight: "var(--target-nav-row)" }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>
        <div className="flex flex-col gap-2 border-t border-border pt-4">
          <Button variant="secondary">
            <Eye size={20} strokeWidth={1.5} aria-hidden />
            Discreet thumbnails
          </Button>
          <Button variant="secondary">
            <Eraser size={20} strokeWidth={1.5} aria-hidden />
            Clear session traces
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

export const LeftNav: Story = {
  name: "Left nav drawer (S-00 pattern)",
  render: () => <DrawerDemo />,
};

export const RightFilters: Story = {
  name: "Right-edge filters drawer (mirrored §9 travel)",
  render: () => <DrawerDemo side="right" title="Filters" />,
};

export const KeyboardJourney: Story = {
  name: "Keyboard: ESC + focus return (S-00)",
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement);
    const user = userEvent.setup();
    await step("hamburger opens the drawer", async () => {
      const trigger = canvas.getByRole("button", { name: "Open menu" });
      await user.click(trigger);
      await expect(canvas.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
    });
    await step("ESC closes; focus returns to the hamburger", async () => {
      await user.keyboard("{Escape}");
      await expect(canvas.queryByRole("dialog")).not.toBeInTheDocument();
      await expect(canvas.getByRole("button", { name: "Open menu" })).toHaveFocus();
    });
  },
  render: () => <DrawerDemo />,
};
