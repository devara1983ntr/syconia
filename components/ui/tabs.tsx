"use client";

/**
 * SYCONIA Tabs — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * "Tabs").
 *
 * - WAI-ARIA tabs pattern: role=tablist on the list; role=tab buttons
 *   with aria-selected + aria-controls → panel ids; role=tabpanel with
 *   aria-labelledby → trigger ids; only the active tab is in the tab
 *   order (roving tabIndex −1).
 * - Keyboard (ACCESSIBILITY §2): ArrowLeft/ArrowRight move focus and
 *   activate (APG automatic activation — panels are cheap here);
 *   Home/End jump to first/last. Wrapping at both ends.
 * - Controlled (`value`) + uncontrolled (`defaultValue`) modes; the
 *   change is surfaced via onValueChange.
 * - §6 styling: hairline bottom border on the list; the active tab
 *   carries a 2px gold underline (§4 "gold hairline reserved for
 *   active nav rail + focus ring" — the tab strip IS active-nav UI);
 *   triggers keep the §7 44px floor; text sizes from §5.
 */

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useMemo,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
  registered: string[];
  register: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export interface TabsProps {
  children: ReactNode;
  /** Active tab value (controlled mode). */
  value?: string;
  /** Initial tab value (uncontrolled mode). */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export function Tabs({ children, value, defaultValue, onValueChange }: TabsProps): React.JSX.Element {
  const [internal, setInternal] = useState<string | undefined>(defaultValue);
  const [registered, setRegistered] = useState<string[]>([]);
  const baseId = useId();

  const current = value ?? internal ?? registered[0];

  const setValue = useCallback(
    (next: string) => {
      if (value === undefined) {
        setInternal(next);
      }
      onValueChange?.(next);
    },
    [value, onValueChange],
  );

  const register = useCallback((tabValue: string) => {
    setRegistered((existing) => (existing.includes(tabValue) ? existing : [...existing, tabValue]));
  }, []);

  const context = useMemo<TabsContextValue>(
    () => ({ value: current ?? "", setValue, baseId, registered, register }),
    [current, setValue, baseId, registered, register],
  );

  return <TabsContext.Provider value={context}>{children}</TabsContext.Provider>;
}

export function TabsList({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <div role="tablist" aria-orientation="horizontal" className="flex gap-1 border-b border-border">
      {children}
    </div>
  );
}

export interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  disabled?: boolean;
}

export function TabsTrigger({ value, children, disabled }: TabsTriggerProps): React.JSX.Element {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsTrigger requires a Tabs parent");
  }
  const { value: active, setValue, baseId, registered, register } = context;

  const index = registered.indexOf(value);
  const count = registered.length;

  const onKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    const move = (delta: number) => {
      event.preventDefault();
      const next = registered[(((index + delta) % count) + count) % count];
      if (next !== undefined) {
        setValue(next);
        document.getElementById(`${baseId}-tab-${next}`)?.focus();
      }
    };
    if (event.key === "ArrowRight") {
      move(1);
    } else if (event.key === "ArrowLeft") {
      move(-1);
    } else if (event.key === "Home" && registered.length > 0) {
      event.preventDefault();
      const first = registered[0]!;
      setValue(first);
      document.getElementById(`${baseId}-tab-${first}`)?.focus();
    } else if (event.key === "End" && registered.length > 0) {
      event.preventDefault();
      const last = registered[registered.length - 1]!;
      setValue(last);
      document.getElementById(`${baseId}-tab-${last}`)?.focus();
    }
  };

  const selected = active === value;

  return (
    <button
      type="button"
      id={`${baseId}-tab-${value}`}
      role="tab"
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={() => setValue(value)}
      onKeyDown={onKeyDown}
      ref={(node) => {
        if (node) {
          register(value);
        }
      }}
      className={`sy-press relative -mb-px border-b-2 bg-transparent px-4 pb-3 pt-3 font-medium ${
        selected
          ? "border-accent text-text-primary"
          : "border-transparent text-text-secondary hover:text-text-primary"
      } ${disabled ? "cursor-not-allowed text-text-tertiary" : ""}`}
      style={{ minHeight: "var(--target-min)" }}
    >
      {children}
    </button>
  );
}

export interface TabsPanelProps {
  value: string;
  children: ReactNode;
}

export function TabsPanel({ value, children }: TabsPanelProps): React.JSX.Element | null {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("TabsPanel requires a Tabs parent");
  }
  const { value: active, baseId } = context;
  if (active !== value) {
    return null;
  }
  return (
    <div
      id={`${baseId}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className="pt-4"
    >
      {children}
    </div>
  );
}
