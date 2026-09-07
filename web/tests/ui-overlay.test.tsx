import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axe from "axe-core";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MotionProvider } from "@/lib/motion/provider";
import { Modal } from "@/components/ui/modal";
import { DRAWER_WIDTH, MENU_MAX_HEIGHT, MODAL_WIDTH, SHEET_MAX_HEIGHT, TOOLTIP_DELAY_MS } from "@/components/ui/states";

/**
 * M1-T009 — overlay-core contracts (task acceptance rows 1–2:
 * "Focus trap + return verified", "ESC closes topmost"; scroll lock;
 * D-011 register pins). Rendered through the real MotionProvider and
 * a Modal consumer wrapper, the way the app mounts overlays.
 */

afterEach(() => {
  cleanup();
  document.documentElement.style.overflow = "";
});

function ui(jsx: React.JSX.Element) {
  return render(<MotionProvider>{jsx}</MotionProvider>);
}

async function expectNoCriticalViolations(scope: HTMLElement): Promise<void> {
  const results = await axe.run(scope);
  const critical = results.violations.filter((v) => v.impact === "critical");
  expect(
    critical.map((v) => `${v.id}: ${v.description}`),
  ).toEqual([]);
}

/** Minimal modal host mirroring the documented consumer pattern. */
function ModalHost({
  onDismiss,
  label = "Dialog",
}: {
  onDismiss: () => void;
  label?: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div>
      <button type="button" onClick={() => setOpen(true)}>
        Open dialog
      </button>
      <Modal
        label={label}
        open={open}
        onDismiss={() => {
          setOpen(false);
          onDismiss();
        }}
      >
        <button type="button">First action</button>
        <button type="button">Last action</button>
      </Modal>
    </div>
  );
}

describe("M1-T009 overlay core — focus trap + return", () => {
  it("dialog semantics: role=dialog + aria-modal + required label (task row)", () => {
    ui(<ModalHost onDismiss={vi.fn()} />);
    const dialog = screen.getByRole("dialog", { name: "Dialog" });
    expect(dialog.getAttribute("aria-modal")).toBe("true");
  });

  it("focus moves into the dialog on open (APG initial focus)", () => {
    ui(<ModalHost onDismiss={vi.fn()} />);
    const dialog = screen.getByRole("dialog");
    expect(document.activeElement).toBe(dialog);
  });

  it("Tab cycles within the dialog and wraps first↔last (no trap escape)", async () => {
    const user = userEvent.setup();
    ui(<ModalHost onDismiss={vi.fn()} />);
    const outsideButton = screen.getByRole("button", { name: "Open dialog" });
    // Focus is on the panel; Tab → first focusable (the X close).
    await user.tab();
    expect(document.activeElement).toHaveAccessibleName("Close");
    await user.tab();
    expect(document.activeElement).toHaveAccessibleName("First action");
    await user.tab();
    expect(document.activeElement).toHaveAccessibleName("Last action");
    // Wrap: last → first (skip the outside trigger entirely).
    await user.tab();
    expect(document.activeElement).toHaveAccessibleName("Close");
    expect(document.activeElement).not.toBe(outsideButton);
  });

  it("Shift+Tab wraps backwards from the first focusable", async () => {
    const user = userEvent.setup();
    ui(<ModalHost onDismiss={vi.fn()} />);
    // Panel → Shift+Tab → last focusable.
    await user.tab({ shift: true });
    expect(document.activeElement).toHaveAccessibleName("Last action");
  });

  it("focus returns to the trigger element after ESC close (task row)", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    ui(<ModalHost onDismiss={onDismiss} />);
    // Re-open scenario: close first, then focus + reopen via trigger.
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    const trigger = screen.getByRole("button", { name: "Open dialog" });
    trigger.focus();
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.activeElement).toBe(trigger);
    expect(onDismiss).toHaveBeenCalledTimes(2);
  });

  it("body scroll is locked while a modal layer is open and released on close", async () => {
    const user = userEvent.setup();
    ui(<ModalHost onDismiss={vi.fn()} />);
    expect(document.documentElement.style.overflow).toBe("hidden");
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(document.documentElement.style.overflow).toBe("");
  });
});

describe("M1-T009 overlay core — ESC closes topmost (task row 2)", () => {
  it("two stacked dialogs: first ESC closes only the topmost, second closes the base", async () => {
    const user = userEvent.setup();
    const baseDismiss = vi.fn();
    const topDismiss = vi.fn();
    function StackedHost() {
      const [baseOpen, setBaseOpen] = useState(true);
      const [topOpen, setTopOpen] = useState(true);
      return (
        <div>
          <Modal
            label="Base"
            open={baseOpen}
            onDismiss={() => {
              setBaseOpen(false);
              baseDismiss();
            }}
          >
            <span>Base body</span>
          </Modal>
          <Modal
            label="Top"
            open={topOpen}
            onDismiss={() => {
              setTopOpen(false);
              topDismiss();
            }}
          >
            <span>Top body</span>
          </Modal>
        </div>
      );
    }
    ui(<StackedHost />);
    await user.keyboard("{Escape}");
    expect(topDismiss).toHaveBeenCalledTimes(1);
    expect(baseDismiss).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Top" })).not.toBeInTheDocument());
    expect(screen.getByRole("dialog", { name: "Base" })).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(baseDismiss).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(screen.queryByRole("dialog", { name: "Base" })).not.toBeInTheDocument(),
    );
  });

  it("scrim tap dismisses (S-00: X button, scrim tap, ESC)", async () => {
    const onDismiss = vi.fn();
    ui(
      <Modal label="Dialog" open onDismiss={onDismiss}>
        <span>Body</span>
      </Modal>,
    );
    const scrim = document.querySelector("div[aria-hidden='true']") as HTMLElement;
    expect(scrim).not.toBeNull();
    fireEvent.click(scrim);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("built-in X close dismisses (S-00 close law)", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    ui(
      <Modal label="Dialog" open onDismiss={onDismiss}>
        <span>Body</span>
      </Modal>,
    );
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

describe("M1-T009 — axe zero-critical on overlay state matrices (task row 3)", () => {
  it("modal state matrix (open/close button, labelled, with actions)", async () => {
    const { rerender } = ui(<ModalHost onDismiss={vi.fn()} />);
    await expectNoCriticalViolations(document.body);
    rerender(
      <MotionProvider>
        <Modal label="Bare" open onDismiss={vi.fn()}>
          <p>Content-only dialog</p>
        </Modal>
      </MotionProvider>,
    );
    await expectNoCriticalViolations(document.body);
  });
});

describe("M1-T009 — D-011 register pins (states.ts batch 2)", () => {
  it("batch-2 register values are the fixed spec figures", () => {
    expect(DRAWER_WIDTH).toBe("min(88vw, 320px)"); // S-00 drawer row
    expect(MODAL_WIDTH).toBe("min(92vw, 480px)"); // D-011 dialog column
    expect(SHEET_MAX_HEIGHT).toBe("90dvh"); // D-011 sheet ceiling
    expect(TOOLTIP_DELAY_MS).toBe(300); // §10 tooltip row
    expect(MENU_MAX_HEIGHT).toBe(352); // 8 rows × 44px §7 floor
  });
});
