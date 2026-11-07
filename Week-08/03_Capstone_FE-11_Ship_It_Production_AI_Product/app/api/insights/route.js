import { isRateLimited } from "../../../lib/rateLimit";

export const maxDuration = 30;

const MODEL = process.env.ANTHROPIC_MODEL || "claude-haiku-4-5-20251001";
const MAX_CATEGORIES = 15;

function buildPrompt(summary) {
  return `You are a careful personal-finance assistant. You will be given an aggregated summary of one person's monthly spending (no transaction notes, no merchant names, no personal identifiers — just category totals). Based ONLY on this data, respond with a short, friendly, genuinely useful spending insight.

Spending summary (JSON):
${JSON.stringify(summary)}

Respond with RAW JSON ONLY — no markdown fences, no commentary before or after — matching exactly this shape:
{
  "headline": "one short sentence (max ~12 words) summarizing the month",
  "insights": ["2 to 3 short, specific observations grounded in the numbers given"],
  "suggestion": "one short, practical, non-judgmental suggestion"
}`;
}

function parseInsightResponse(text) {
  let cleaned = text.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(json)?/i, "").replace(/```$/, "").trim();
  }

  let parsed;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    return null;
  }

  if (
    !parsed ||
    typeof parsed.headline !== "string" ||
    !Array.isArray(parsed.insights) ||
    typeof parsed.suggestion !== "string"
  ) {
    return null;
  }

  return {
    headline: parsed.headline,
    insights: parsed.insights.filter((i) => typeof i === "string").slice(0, 5),
    suggestion: parsed.suggestion,
  };
}

export async function POST(request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const clientKey = forwardedFor.split(",")[0].trim() || "anonymous";

  if (isRateLimited(clientKey)) {
    return Response.json(
      { error: "Too many requests. Please wait a minute before trying again." },
      { status: 429 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      {
        error:
          "AI insights aren't configured yet. Set ANTHROPIC_API_KEY in your environment to enable this feature.",
      },
      { status: 500 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const summary = body?.summary;
  if (!summary || !summary.currentMonth) {
    return Response.json(
      { error: "Not enough spending data yet to generate insights." },
      { status: 400 }
    );
  }

  if ((summary.currentMonth.categories || []).length > MAX_CATEGORIES) {
    return Response.json({ error: "Too many categories in this request." }, { status: 400 });
  }

  let upstreamResponse;
  try {
    upstreamResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 400,
        messages: [{ role: "user", content: buildPrompt(summary) }],
      }),
    });
  } catch {
    return Response.json(
      { error: "Couldn't reach the AI service. Check your connection and try again." },
      { status: 502 }
    );
  }

  if (upstreamResponse.status === 429) {
    return Response.json(
      { error: "The AI service is rate-limited right now. Please try again shortly." },
      { status: 429 }
    );
  }

    if (!upstreamResponse.ok) {
    const errorBody = await upstreamResponse.text();
    console.error("Anthropic API error:", upstreamResponse.status, errorBody);
    return Response.json(
      { error: "The AI service returned an error. Please try again." },
      { status: 502 }
    );
  }

  let upstreamData;
  try {
    upstreamData = await upstreamResponse.json();
  } catch {
    return Response.json(
      { error: "The AI service returned an unreadable response." },
      { status: 502 }
    );
  }

  const text = upstreamData?.content?.[0]?.text || "";
  const parsed = parseInsightResponse(text);

  if (!parsed) {
    return Response.json(
      { error: "The AI response couldn't be understood. Please try again." },
      { status: 502 }
    );
  }

  return Response.json(parsed, { status: 200 });
}
