"use client";

/**
 * SYCONIA Dropdown — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * "Dropdown"; S-02 "dropdown on desktop" row-overflow pattern).
 *
 * - Trigger: a batch-1 Button (secondary) with aria-haspopup="menu" +
 *   aria-expanded + chevron-down (§7 icon, rotates when open).
 * - Menu: role="menu" with role="menuitem" buttons — APG keyboard
 *   model: Enter/Space/ArrowDown opens + focuses the first item,
 *   ArrowUp opens + focuses the last, arrows cycle (wrap), Home/End
 *   jump, ESC closes + focus returns to the trigger (overlay-core
 *   topmost stack), Tab closes and continues naturally, pointerdown
 *   outside closes without stealing focus.
 * - Selecting an item fires onSelect(id) + closes + focus returns to
 *   the trigger.
 * - No §9 family exists for menus → the panel opens instantly (motion
 *   law: only §9 durations are legal).
 * - Panel: surface-elevated + hairline + radius-md + elevation-2
 *   (D-011 popover register), MENU_MAX_HEIGHT scroll ceiling (states.ts
 *   register — 8 rows × the 44px target floor), item rows keep the
 *   §7 44px floor; z rung --z-header-sticky (D-011 anchored-transient
 *   mapping). Destructive items render in the error tone (§4).
 */

import { useId, useRef, useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";

import { MENU_MAX_HEIGHT } from "./states";
import { Button } from "./button";
import { PANEL_SURFACE, useDismissableLayer } from "./overlay";

export interface DropdownItem {
  id: string;
  label: string;
  /** §7 icon slot (lucide, currentColor). */
  icon?: ReactNode;
  /** Destructive action → error tone (§4; icon+label law applies). */
  destructive?: boolean;
}

export interface DropdownProps {
  /** Trigger label (visible text). */
  label: ReactNode;
  items: DropdownItem[];
  onSelect: (id: string) => void;
  /** Panel alignment relative to the trigger. */
  align?: "start" | "end";
}

/** Tab-order query for the Tab-continuation target (APG menu pattern). */
const MENU_TABBABLE_SELECTOR = [
  "button:not([disabled])",
  "a[href]",
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function Dropdown({ label, items, onSelect, align = "start" }: DropdownProps): React.JSX.Element {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const triggerId = useId();

  const close = (restoreTrigger: boolean) => {
    setOpen(false);
    if (restoreTrigger) {
      const triggerButton = triggerRef.current?.querySelector<HTMLButtonElement>("button");
      triggerButton?.focus();
    }
  };

  useDismissableLayer({
    open,
    // ESC arrives through the topmost stack; outside-pointer through
    // the core's pointerdown listener (focus follows the click).
    onDismiss: () => close(true),
    panelRef: menuRef,
    modal: false,
    restoreFocus: false,
    dismissOnOutsidePointer: true,
    anchorRef: triggerRef,
  });

  const focusItemAt = (index: number) => {
    const menuItems = menuRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']");
    if (!menuItems || menuItems.length === 0) {
      return;
    }
    const count = menuItems.length;
    menuItems[((index % count) + count) % count]!.focus();
  };

  const openWithFocus = (last: boolean) => {
    setOpen(true);
    // Focus lands after the menu renders — next microtask/frame.
    requestAnimationFrame(() => focusItemAt(last ? -1 : 0));
  };

  const onTriggerKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openWithFocus(event.key === "ArrowUp");
      }
    }
  };

  const onMenuKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Tab") {
      // APG menu: Tab closes and continues past the menu. The focused
      // menuitem unmounts on close, so the browser cannot compute the
      // next target after the keydown — compute it BEFORE closing
      // (first tabbable after the trigger, outside the menu) and focus
      // it; focus is never dropped to body.
      event.preventDefault();
      const tabbables = Array.from(
        document.body.querySelectorAll<HTMLElement>(MENU_TABBABLE_SELECTOR),
      ).filter(
        (el) => !el.closest('[role="menu"]') && !el.hasAttribute("hidden"),
      );
      const triggerButton = triggerRef.current?.querySelector<HTMLButtonElement>("button");
      const index = triggerButton ? tabbables.indexOf(triggerButton) : -1;
      const next = event.shiftKey
        ? index > 0
          ? tabbables[index - 1]!
          : undefined
        : index >= 0 && index + 1 < tabbables.length
          ? tabbables[index + 1]!
          : undefined;
      close(false);
      next?.focus();
      return;
    }
    const menuItems = Array.from(
      menuRef.current?.querySelectorAll<HTMLButtonElement>("[role='menuitem']") ?? [],
    );
    const activeIndex = menuItems.findIndex((item) => item === document.activeElement);
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItemAt(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItemAt(activeIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItemAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItemAt(-1);
    }
  };

  return (
    <div ref={triggerRef} className="relative inline-block">
      <Button
        id={triggerId}
        variant="secondary"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => (open ? close(true) : openWithFocus(false))}
        onKeyDown={onTriggerKeyDown}
      >
        {label}
        <ChevronDown
          size={20}
          strokeWidth={1.5}
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </Button>
      {open ? (
        <div
          ref={menuRef}
          role="menu"
          aria-labelledby={triggerId}
          onKeyDown={onMenuKeyDown}
          className={`${PANEL_SURFACE} absolute top-full mt-2 overflow-y-auto rounded-md`}
          style={{
            zIndex: "var(--z-header-sticky)",
            maxHeight: MENU_MAX_HEIGHT,
            [align === "end" ? "right" : "left"]: 0,
            minWidth: "12rem",
          }}
        >
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect(item.id);
                close(true);
              }}
              className={`sy-press flex w-full items-center gap-3 px-4 text-left text-body hover:bg-surface ${
                item.destructive ? "text-error" : "text-text-primary"
              }`}
              style={{ minHeight: "var(--target-min)" }}
            >
              {item.icon ? (
                <span aria-hidden className="inline-flex">
                  {item.icon}
                </span>
              ) : null}
              {item.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
