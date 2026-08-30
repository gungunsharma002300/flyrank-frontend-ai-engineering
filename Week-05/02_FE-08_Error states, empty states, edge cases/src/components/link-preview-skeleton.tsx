/**
 * Skeleton for the link-preview card, sized to match the real
 * LinkPreviewCard's layout so nothing shifts when content arrives
 * (mentor tip: a skeleton that causes layout shift is worse than a
 * spinner).
 */
export function LinkPreviewSkeleton() {
  return (
    <div
      className="max-w-md animate-pulse overflow-hidden rounded-2xl border"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="h-40 w-full" style={{ background: "#EDEBE3" }} />
      <div className="space-y-2 p-4">
        <div className="h-3 w-20 rounded" style={{ background: "#EDEBE3" }} />
        <div className="h-4 w-3/4 rounded" style={{ background: "#EDEBE3" }} />
        <div className="h-3 w-full rounded" style={{ background: "#EDEBE3" }} />
        <div className="h-3 w-1/2 rounded" style={{ background: "#EDEBE3" }} />
      </div>
    </div>
  );
}
