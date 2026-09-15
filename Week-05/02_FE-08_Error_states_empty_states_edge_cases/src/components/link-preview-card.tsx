import type { FetchMetaTagsOutput } from "@/lib/tools/fetch-meta-tags";

/**
 * The "real component" tool result the assignment asks for —
 * a link-preview card, not a JSON dump.
 */
export function LinkPreviewCard({ result }: { result: FetchMetaTagsOutput }) {
  if (result.status === "error") {
    return (
      <div
        className="max-w-md rounded-2xl border p-4"
        style={{ borderColor: "#F3C7B8", background: "#FDF1EC" }}
      >
        <div className="flex items-start gap-3">
          <div
            className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ background: "var(--accent)" }}
          >
            !
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
              Couldn&apos;t preview that link
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              {result.reason}
            </p>
            <p className="mt-2 truncate text-xs" style={{ color: "#C08A76" }}>
              {result.url}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <a
      href={result.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block max-w-md overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:shadow-md"
      style={{ borderColor: "var(--border)" }}
    >
      {result.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={result.image} alt="" className="h-40 w-full object-cover" />
      )}
      <div className="p-4">
        {result.siteName && (
          <p
            className="mb-1 text-xs font-semibold uppercase tracking-wide"
            style={{ color: "var(--main)" }}
          >
            {result.siteName}
          </p>
        )}
        <p
          className="line-clamp-2 text-sm font-semibold"
          style={{ color: "var(--text)", fontFamily: "var(--font-heading)" }}
        >
          {result.title || "Untitled page"}
        </p>
        {result.description && (
          <p className="mt-1 line-clamp-2 text-sm" style={{ color: "var(--muted)" }}>
            {result.description}
          </p>
        )}
        <p className="mt-2 truncate text-xs" style={{ color: "#B4B2A9" }}>
          {result.url}
        </p>
      </div>
    </a>
  );
}
