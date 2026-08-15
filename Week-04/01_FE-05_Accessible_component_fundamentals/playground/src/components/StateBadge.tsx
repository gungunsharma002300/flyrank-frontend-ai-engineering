interface StateBadgeProps {
  attr: string;
  value: string | boolean;
}

/**
 * Renders a live ARIA attribute as a monospace badge, e.g. `aria-expanded="true"`.
 * The point: make the (usually invisible) accessibility state visible in the UI itself,
 * so you can see what a screen reader would announce as you interact.
 */
export function StateBadge({ attr, value }: StateBadgeProps) {
  return (
    <span className="state-badge">
      <span className="state-badge-attr">{attr}</span>
      <span className="state-badge-eq">=</span>
      <span className="state-badge-value">"{String(value)}"</span>
    </span>
  );
}
