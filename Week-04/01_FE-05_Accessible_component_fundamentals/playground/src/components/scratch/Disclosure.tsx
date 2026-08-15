import { useId, useState, type ReactNode } from "react";

interface DisclosureProps {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Accessible disclosure widget, built from scratch.
 * Follows the ARIA APG "Disclosure (Show/Hide)" pattern:
 * https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
 *
 * - A single <button> toggles aria-expanded and controls a content region
 * - The content region is referenced via aria-controls
 * - Fully keyboard operable: it's a native button, so Enter/Space work for free
 */
export function Disclosure({ summary, children, defaultOpen = false, onOpenChange }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  function toggle() {
    setOpen((prev) => {
      const next = !prev;
      onOpenChange?.(next);
      return next;
    });
  }

  return (
    <div className="disclosure">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={contentId}
        className="disclosure-trigger"
        onClick={toggle}
      >
        <span aria-hidden="true" className={`disclosure-icon ${open ? "open" : ""}`}>
          ▶
        </span>
        {summary}
      </button>
      <div id={contentId} role="region" hidden={!open} className="disclosure-content">
        {children}
      </div>
    </div>
  );
}
