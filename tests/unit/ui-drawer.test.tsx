import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MotionProvider } from "@/lib/motion/provider";
import { Drawer } from "@/components/ui/drawer";

/**
 * M1-T009 — Drawer contracts (DESIGN-SYSTEM §10 "Drawer"; §9 drawer
 * motion row; S-00 hamburger drawer: width 88vw max 320px, glass
 * surface, close via X/scrim/ESC, focus returns to trigger).
 */

afterEach(() => {
  cleanup();
  document.documentElement.style.overflow = "";
});

function ui(jsx: React.JSX.Element) {
  return render(<MotionProvider>{jsx}</MotionProvider>);
}

function DrawerHost({ onDismiss }: { onDismiss: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open menu
      </button>
      <Drawer
        label="Menu"
        open={open}
        onDismiss={() => {
          setOpen(false);
          onDismiss();
        }}
        title="Sections"
      >
        <nav>
          <a href="#home">Home</a>
        </nav>
      </Drawer>
    </div>
  );
}

describe("M1-T009 Drawer", () => {
  it("drawer dialog semantics: role=dialog, aria-modal, labelled (§3)", async () => {
    const user = userEvent.setup();
    ui(<DrawerHost onDismiss={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    // Visible title present → the dialog's accessible name is the h2
    // (aria-labelledby); the required label prop covers the bare case.
    const dialog = screen.getByRole("dialog", { name: "Sections" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
    expect(screen.getByRole("heading", { level: 2, name: "Sections" })).toBeInTheDocument();
  });

  it("no-title drawer is named by the required label prop", () => {
    ui(
      <div>
        <Drawer label="Menu" open onDismiss={vi.fn()}>
          <nav>
            <a href="#home">Home</a>
          </nav>
        </Drawer>
      </div>,
    );
    expect(screen.getByRole("dialog", { name: "Menu" })).toBeInTheDocument();
  });

  it("S-00 geometry: width 88vw max 320px; glass surface with the §6 12px blur", async () => {
    const user = userEvent.setup();
    const { rerender } = ui(<DrawerHost onDismiss={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog.style.width).toBe("min(88vw, 320px)");
    expect(dialog.className).toContain("bg-glass");
    expect(dialog.className).toContain("backdrop-blur-glass");
    // §6: elevation-2 (drawer/modal); z rung --z-drawer (D-006 ladder).
    expect(dialog.className).toContain("shadow-elevation-2");
    expect(dialog.style.zIndex).toBe("var(--z-drawer)");
    rerender(
      <MotionProvider>
        <div>
          <Drawer label="Menu" open onDismiss={vi.fn()}>
            <span>Body</span>
          </Drawer>
        </div>
      </MotionProvider>,
    );
    expect(screen.getByRole("dialog").style.width).toBe("min(88vw, 320px)");
  });

  it("ESC closes; focus returns to the trigger (S-00 'focus returns to hamburger')", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    ui(<DrawerHost onDismiss={onDismiss} />);
    const trigger = screen.getByRole("button", { name: "Open menu" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(trigger);
  });

  it("built-in X closes (S-00 close law)", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    ui(<DrawerHost onDismiss={onDismiss} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("side=right mirrors the §9 travel (+100% origin at the right edge)", () => {
    ui(
      <Drawer label="Filters" open onDismiss={vi.fn()} side="right">
        <span>Filters body</span>
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog", { name: "Filters" });
    expect(dialog.className).toContain("right-0");
    expect(dialog.className).toContain("border-l");
  });

  it("axe: zero critical violations", async () => {
    const user = userEvent.setup();
    ui(<DrawerHost onDismiss={vi.fn()} />);
    await user.click(screen.getByRole("button", { name: "Open menu" }));
    const results = await axe.run(document.body);
    const critical = results.violations.filter((v) => v.impact === "critical");
    expect(critical.map((v) => v.id)).toEqual([]);
  });
});
