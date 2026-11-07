import OpenAI from "openai";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_BODY_BYTES = 24_000;
const MAX_MESSAGES = 12;
const MAX_MESSAGE_CHARS = 4_000;

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return jsonError("AI service is not configured. Please contact the site owner.", 503);

  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  // Fail closed: don't expose a billable AI endpoint if production rate limiting is missing.
  if (!redisUrl || !redisToken) {
    return jsonError("API protection is not configured. Please contact the site owner.", 503);
  }

  const contentLength = Number(request.headers.get("content-length") || "0");
  if (contentLength > MAX_BODY_BYTES) return jsonError("Request body is too large.", 413);

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = (forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown").slice(0, 100);

  try {
    const redis = new Redis({ url: redisUrl, token: redisToken });
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, "1 m"),
      prefix: "fe11:chat",
      analytics: false
    });
    const result = await limiter.limit(ip);
    if (!result.success) {
      return Response.json(
        { error: "Too many requests. Please wait a minute and try again." },
        { status: 429, headers: { "Retry-After": "60", "X-RateLimit-Limit": String(result.limit), "X-RateLimit-Remaining": "0" } }
      );
    }

    const raw = await request.text();
    if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) return jsonError("Request body is too large.", 413);

    let payload: unknown;
    try { payload = JSON.parse(raw); } catch { return jsonError("Invalid JSON body.", 400); }
    if (!payload || typeof payload !== "object" || !Array.isArray((payload as { messages?: unknown }).messages)) {
      return jsonError("Expected a messages array.", 400);
    }

    const input = (payload as { messages: unknown[] }).messages;
    if (input.length < 1 || input.length > MAX_MESSAGES) return jsonError(`Send between 1 and ${MAX_MESSAGES} messages.`, 400);

    const messages: Array<{ role: "user" | "assistant"; content: string }> = [];
    for (const item of input) {
      if (!item || typeof item !== "object") return jsonError("Each message must be an object.", 400);
      const candidate = item as { role?: unknown; content?: unknown };
      if (candidate.role !== "user" && candidate.role !== "assistant") return jsonError("Invalid message role.", 400);
      if (typeof candidate.content !== "string" || !candidate.content.trim()) return jsonError("Message content is required.", 400);
      if (candidate.content.length > MAX_MESSAGE_CHARS) return jsonError(`Each message must be ${MAX_MESSAGE_CHARS} characters or fewer.`, 400);
      messages.push({ role: candidate.role, content: candidate.content.trim() });
    }
    if (messages[messages.length - 1]?.role !== "user") return jsonError("The final message must be from the user.", 400);

    const client = new OpenAI({ apiKey, timeout: 25_000, maxRetries: 1 });
    const stream = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant. Be clear, accurate, and concise. Do not claim certainty when unsure." },
        ...messages
      ],
      stream: true,
      max_tokens: 800
    });

    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) controller.enqueue(encoder.encode(content));
          }
          controller.close();
        } catch {
          controller.error(new Error("AI stream failed"));
        }
      },
      cancel() { void stream.controller.abort(); }
    });

    return new Response(body, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff"
      }
    });
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") return jsonError("Request timed out. Please try again.", 504);
    // Do not leak provider errors, credentials, or internal details to clients.
    return jsonError("The AI request could not be completed. Please try again shortly.", 502);
  }
}