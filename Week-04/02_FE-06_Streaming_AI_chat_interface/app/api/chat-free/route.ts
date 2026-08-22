import { google } from "@ai-sdk/google";
import {
  convertToModelMessages,
  streamText,
  type UIMessage,
} from "ai";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM_PROMPT = `
You are StreamMate, a helpful AI assistant for the FE-06 Streaming AI Chat assignment.

Be friendly, accurate, and concise.
Use short paragraphs and bullets when useful.
If the user asks for code, provide clean examples and explain important parts briefly.

You are running in the free Gemini mode of this project.
`.trim();

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return Response.json(
        {
          error:
            "Gemini API key is missing. Add GOOGLE_GENERATIVE_AI_API_KEY to .env.local and restart the dev server.",
        },
        { status: 500 }
      );
    }

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
      model: google("gemini-3.6-flash"),
      system: SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages),
      temperature: 0.4,
      maxOutputTokens: 2048,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("FE-06 Gemini chat route error:", error);

    return Response.json(
      {
        error:
          "Unable to start the Gemini stream. Check your API key and free-tier quota.",
      },
      { status: 500 }
    );
  }
}