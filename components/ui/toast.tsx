"use client";

/**
 * SYCONIA Toast — primitives batch 2 (M1-T009; DESIGN-SYSTEM §10
 * "Toast"; §9 "Toast: slide-up + fade in 200ms; auto-dismiss 4s (pause
 * on hover/focus)"; S-00 "toasts bottom-center (mobile) /
 * bottom-right (desktop), 4s, dismissible, role=status").
 *
 * - ToastProvider (context): mounts the global region `role="status"`
 *   (ACCESSIBILITY §3 live-region law — task's required
 *   implementation row) and owns the toast list; useToast() exposes
 *   toast()/dismiss(). The provider must sit inside MotionProvider
 *   (m + AnimatePresence require the LazyMotion context).
 * - Each toast: §9 slide-up fade (reduced-motion ≤100ms opacity-only),
 *   4s auto-dismiss with hover/focus pause (the timer freezes on
 *   pointerenter/focusin and resumes on leave/blur — §9 + ACCESS-
 *   IBILITY §2 "toasts pause on focus").
 * - Icons per variant from the §7 inventory (info/check/triangle-alert/
 *   circle-alert); X dismiss (IconButton) per "dismissible".
 * - Region: fixed bottom-4 — centered ≤767px, right-aligned ≥768px
 *   (S-00); z rung --z-toast (500, the D-006 ladder); surface-elevated
 *   + hairline + radius-md + elevation-2 (D-011 popover register).
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, m, useReducedMotion } from "motion/react";
import { Check, CircleAlert, Info, TriangleAlert, X } from "lucide-react";

import { MOTION, selectVariants } from "@/lib/motion/variants";
import { IconButton } from "./button";
import { PANEL_SURFACE, Portal } from "./overlay";

export type ToastVariant = "info" | "success" | "warning" | "error";

export interface ToastOptions {
  message: string;
  variant?: ToastVariant;
  /** Override the 4s default (§9) — e.g. longer error copy. */
  duration?: number;
}

interface ToastItem extends Required<Omit<ToastOptions, "duration">> {
  id: string;
  duration: number;
}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastSeq = 0;

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast requires a ToastProvider ancestor");
  }
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((existing) => existing.filter((toast) => toast.id !== id));
  }, []);

  const toast = useCallback((options: ToastOptions) => {
    const id = `toast-${++toastSeq}`;
    setToasts((existing) => [
      ...existing,
      {
        id,
        message: options.message,
        variant: options.variant ?? "info",
        duration: options.duration ?? MOTION.toast.autoDismissMs,
      },
    ]);
    return id;
  }, []);

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}
      <ToastRegion toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

/** The live region (role=status) + positioned stack (S-00). */
function ToastRegion({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}): React.JSX.Element {
  return (
    <Portal>
      <div
        role="status"
        className="pointer-events-none fixed bottom-4 left-4 right-4 flex flex-col items-center gap-2 sm:left-auto sm:items-end"
        style={{ zIndex: "var(--z-toast)" }}
      >
        <AnimatePresence>
          {toasts.map((item) => (
            <ToastView key={item.id} item={item} onDismiss={() => onDismiss(item.id)} />
          ))}
        </AnimatePresence>
      </div>
    </Portal>
  );
}

const VARIANT_ICON: Record<ToastVariant, React.JSX.Element> = {
  info: <Info size={20} strokeWidth={1.5} aria-hidden />,
  success: <Check size={20} strokeWidth={1.5} aria-hidden />,
  warning: <TriangleAlert size={20} strokeWidth={1.5} aria-hidden />,
  error: <CircleAlert size={20} strokeWidth={1.5} aria-hidden />,
};

const VARIANT_TEXT: Record<ToastVariant, string> = {
  info: "text-accent",
  success: "text-success",
  warning: "text-warning",
  error: "text-error",
};

interface ToastViewProps {
  item: ToastItem;
  onDismiss: () => void;
}

function ToastView({ item, onDismiss }: ToastViewProps): React.JSX.Element {
  const reduced = useReducedMotion();
  const v = selectVariants(reduced);
  const remainingRef = useRef(item.duration);
  const expiryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    clearTimer();
    expiryRef.current = Date.now() + remainingRef.current;
    timerRef.current = setTimeout(() => onDismissRef.current(), remainingRef.current);
  }, [clearTimer]);

  const pause = useCallback(() => {
    if (timerRef.current === null) {
      return;
    }
    remainingRef.current = Math.max(0, expiryRef.current - Date.now());
    clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    remainingRef.current = item.duration;
    resume();
    return clearTimer;
  }, [item.duration, resume, clearTimer]);

  return (
    <m.div
      variants={v.toast}
      initial="initial"
      animate="animate"
      exit="exit"
      onPointerEnter={pause}
      onPointerLeave={resume}
      onFocus={pause}
      onBlur={resume}
      className={`${PANEL_SURFACE} pointer-events-auto flex w-full items-center gap-3 rounded-md px-4 py-3 sm:w-auto sm:max-w-md`}
    >
      <span aria-hidden className={`inline-flex shrink-0 ${VARIANT_TEXT[item.variant]}`}>
        {VARIANT_ICON[item.variant]}
      </span>
      <p className="text-body text-text-primary">{item.message}</p>
      <IconButton aria-label="Dismiss" variant="ghost" size="sm" onClick={onDismiss} className="ml-1 shrink-0">
        <X size={20} strokeWidth={1.5} aria-hidden />
      </IconButton>
    </m.div>
  );
}
