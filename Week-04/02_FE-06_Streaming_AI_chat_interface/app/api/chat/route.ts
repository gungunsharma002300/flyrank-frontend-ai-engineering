import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";
import { CHAT_MODEL, SYSTEM_PROMPT } from "@/lib/ai-config";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      messages?: UIMessage[];
    };

    const messages = body.messages ?? [];

    if (!Array.isArray(messages)) {
      return Response.json(
        { error: "Invalid messages payload." },
        { status: 400 }
      );
    }

    const result = streamText({
      model: CHAT_MODEL,
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      temperature: 0.4,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("FE-06 chat route error:", error);

    return Response.json(
      {
        error:
          "Unable to start the AI stream. Check your server configuration.",
      },
      { status: 500 }
    );
  }
}