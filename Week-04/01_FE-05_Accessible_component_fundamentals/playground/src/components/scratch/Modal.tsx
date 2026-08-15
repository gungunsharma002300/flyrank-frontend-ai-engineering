import { useEffect, useRef, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  titleId: string;
  title: string;
  children: ReactNode;
}

/**
 * Accessible modal dialog, built from scratch.
 * Follows the ARIA APG "Dialog (Modal)" pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/
 *
 * - role="dialog" + aria-modal="true"
 * - Labelled via aria-labelledby
 * - Focus moves into the dialog on open, is trapped inside it,
 *   and returns to the triggering element on close
 * - Escape closes the dialog
 * - Clicking the backdrop closes the dialog
 */
export function Modal({ open, onClose, titleId, title, children }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedEl = useRef<HTMLElement | null>(null);

  // Open/close side effects: remember trigger, move focus, restore focus, lock scroll
  useEffect(() => {
    if (!open) return;

    previouslyFocusedEl.current = document.activeElement as HTMLElement | null;

    const dialogEl = dialogRef.current;
    const focusable = getFocusableElements(dialogEl);
    const firstFocusable = focusable.length > 0 ? focusable[0] : dialogEl;
    firstFocusable?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
      previouslyFocusedEl.current?.focus();
    };
  }, [open]);

  // Escape to close + focus trap (Tab / Shift+Tab wrap inside dialog)
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(dialogRef.current);
      if (focusable.length === 0) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown, true);
    return () => document.removeEventListener("keydown", handleKeyDown, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="modal-panel"
        tabIndex={-1}
      >
        <h2 id={titleId} className="modal-title">
          {title}
        </h2>
        {children}
        <button type="button" className="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusableElements(container: HTMLElement | null): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null,
  );
}
