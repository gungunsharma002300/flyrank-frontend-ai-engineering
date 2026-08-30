import { google } from "@ai-sdk/google";
import { convertToModelMessages, streamText, UIMessage } from "ai";
import { fetchMetaTagsTool } from "@/lib/tools/fetch-meta-tags";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-3.6-flash"),
    system:
      "You are a helpful assistant embedded in a portfolio site. " +
      "When the user shares a URL or asks you to preview/check a link, " +
      "use the fetchMetaTags tool to look it up for real instead of " +
      "guessing what the page contains. After the tool returns, briefly " +
      "describe what you found in one sentence — the UI will render the " +
      "actual preview card, so you don't need to repeat every field.",
    messages: await convertToModelMessages(messages),
    tools: {
      fetchMetaTags: fetchMetaTagsTool,
    },
  });

  return result.toUIMessageStreamResponse();
}
