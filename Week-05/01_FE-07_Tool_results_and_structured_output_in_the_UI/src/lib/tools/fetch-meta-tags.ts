import { tool } from "ai";
import { z } from "zod";
import * as cheerio from "cheerio";

/**
 * TOOL: fetchMetaTags
 *
 * Purpose: given a public URL, fetch that page and extract its key
 * meta tags (title, description, og:image, site name) so the model
 * can show the user a real preview card instead of just a raw link.
 *
 * Contract:
 *   name:   fetchMetaTags
 *   input:  { url: string }        — a valid, public http(s) URL
 *   output: { title, description, image, siteName, url }
 *           on success, or a typed error object on failure
 *
 * Kept intentionally small: every field here is a field the model
 * could otherwise hallucinate, so we only ask for what we can
 * actually verify by fetching the page ourselves.
 */

export const fetchMetaTagsInputSchema = z.object({
  url: z
    .string()
    .url()
    .describe(
      "A public, fully-qualified URL (including https://) to fetch and read meta tags from."
    ),
});

export type FetchMetaTagsInput = z.infer<typeof fetchMetaTagsInputSchema>;

export type FetchMetaTagsOutput =
  | {
      status: "success";
      url: string;
      title: string;
      description: string;
      image: string | null;
      siteName: string | null;
    }
  | {
      status: "error";
      url: string;
      reason: string;
    };

async function fetchMetaTags(
  input: FetchMetaTagsInput
): Promise<FetchMetaTagsOutput> {
  const { url } = input;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Some sites block requests with no user-agent.
        "User-Agent":
          "Mozilla/5.0 (compatible; PortfolioToolBot/1.0; +https://example.com)",
      },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return {
        status: "error",
        url,
        reason: `The page responded with status ${res.status}. It may not exist or may be blocking automated requests.`,
      };
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) {
      return {
        status: "error",
        url,
        reason: `That URL didn't return an HTML page (got "${contentType}"), so there are no meta tags to read.`,
      };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const title =
      $('meta[property="og:title"]').attr("content") ||
      $("title").first().text() ||
      "";

    const description =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      "";

    const image = $('meta[property="og:image"]').attr("content") || null;

    const siteName =
      $('meta[property="og:site_name"]').attr("content") || null;

    if (!title && !description) {
      return {
        status: "error",
        url,
        reason:
          "The page loaded, but it has no title or description meta tags to show.",
      };
    }

    return {
      status: "success",
      url,
      title: title.trim(),
      description: description.trim(),
      image,
      siteName,
    };
  } catch (err) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "The request timed out after 8 seconds."
        : err instanceof Error
        ? err.message
        : "Unknown network error.";

    return {
      status: "error",
      url,
      reason: message,
    };
  }
}

export const fetchMetaTagsTool = tool({
  description:
    "Fetch a public URL and extract its title, description, image, and site name from its meta tags, so the result can be shown as a real link-preview card. Use this whenever the user shares a link and wants to know what it is or preview it.",
  inputSchema: fetchMetaTagsInputSchema,
  execute: fetchMetaTags,
});
