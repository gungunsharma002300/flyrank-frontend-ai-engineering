import { LinkPreviewCard } from "./link-preview-card";
import type { FetchMetaTagsOutput } from "@/lib/tools/fetch-meta-tags";

type ToolPart = {
  type: string;
  state: "input-streaming" | "input-available" | "output-available" | "output-error";
  input?: unknown;
  output?: unknown;
  errorText?: string;
};

function getUrl(input: unknown): string | undefined {
  if (input && typeof input === "object" && "url" in input) {
    const url = (input as { url?: unknown }).url;
    return typeof url === "string" ? url : undefined;
  }
  return undefined;
}

export function ToolPartRenderer({ part }: { part: ToolPart }) {
  const inputUrl = getUrl(part.input);
  const output = part.output as FetchMetaTagsOutput | undefined;

  switch (part.state) {
    case "input-streaming":
      return (
        <div
          className="flex max-w-md items-center gap-3 rounded-2xl border border-dashed p-4"
          style={{ borderColor: "var(--border)", background: "#F1EFE8" }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
              style={{ background: "var(--main)" }}
            />
            <span
              className="relative inline-flex h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--main)" }}
            />
          </span>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Working out which link to look up{inputUrl ? `: ${inputUrl}` : "…"}
          </p>
        </div>
      );

    case "input-available":
      return (
        <div
          className="flex max-w-md items-center gap-3 rounded-2xl border p-4"
          style={{ borderColor: "#BFD4E6", background: "#EAF2F9" }}
        >
          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" style={{ color: "var(--main)" }}>
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <p className="text-sm" style={{ color: "var(--main)" }}>
            Fetching <span className="font-medium">{inputUrl}</span>…
          </p>
        </div>
      );

    case "output-available":
      return output ? <LinkPreviewCard result={output} /> : null;

    case "output-error":
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
                The tool call failed
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                {part.errorText || "Something went wrong running this tool."}
              </p>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
