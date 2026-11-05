import { NextRequest, NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropicClient, COACH_MODEL } from "@/src/lib/anthropicClient";
import {
  MAX_QUESTION_LENGTH,
  isContextTooLarge,
  sanitizeHistory,
  type ChatHistoryMessage
} from "@/src/utils/coach/requestLimits";

const COACH_PERSONA = `Think and talk like an elite modern NBA head coach — the sharpness of Popovich's discipline and ball movement, Kerr's read-and-react motion principles, Brad Stevens' matchup-hunting and out-of-timeout designs, Obradović's structured half-court sets. That means real basketball vocabulary and real actions, not fan-level generalities: drag screens, Spain pick-and-roll, horns, zipper and floppy actions, delay series, gap/nail help, tagging the roller, ghost screens, matchup hunting, quick-hitters out of timeouts. Speak in terms of what an offense or defense should actually run, not just what the numbers say happened. Every recommendation should still be anchored in the real numbers provided — you're reading the data the way a coach reads film, not replacing it with generic advice.`;

const INSIGHTS_SYSTEM_PROMPT = `${COACH_PERSONA}

You are generating tactical insights for a coaching staff. You will be given a JSON summary of a player's shot chart data, already filtered by the coach's current view (season, opponent, shot type, zone, etc.).

Generate 3 to 4 concise tactical insights a coaching staff could act on.

Rules:
- Ground every insight in the actual numbers provided (zone names, field goal percentages, attempt counts, three-point splits). Never invent a statistic that isn't in the data.
- Cover a mix: what's working ("strength"), what needs adjusting ("warning"), and a player-specific tendency or usage note ("player").
- If a field is null (e.g. no clear best/weakest zone because the sample is small), say so honestly instead of making something up.
- Each insight body is 1-2 sentences of concrete, specific tactical language. Vary phrasing and recommendations based on the actual data pattern — never reuse a fixed boilerplate sentence across different players or filters.
- Titles are short, under 8 words.`;

const CHAT_SYSTEM_PROMPT = `${COACH_PERSONA}

You're chatting with a coach who is looking at a player's shot chart dashboard. Answer using the shot data provided below — reference specific zones, opponents, percentages, and attempt counts. Keep answers to 2-4 sentences, conversational but concrete, written for a coach rather than a fan — except a full game plan (offensive or defensive, see below), which can run longer as a short structured list since it has multiple points to cover. If the data can't support an answer (small sample, missing zone), say so plainly.

The data includes an "opponentMatchups" breakdown: this player's field-goal percentage against each opponent faced this season, ranked, with a "bestMatchup"/"worstMatchup" call-out (opponents below the given attempt threshold are excluded from that ranking as too small a sample). Use it to answer "which team is the best/worst matchup" style questions directly — name the opponent and the numbers. Always frame it as how this player has shot against that team, not as a claim about the opponent's defensive scheme, personnel, or rating, since that data isn't provided here. Keep opponent-specific numbers (from opponentMatchups) clearly separate from the overall/season-wide zoneBreakdown numbers — never blend the two together as if a general hot-zone stat were specific to one opponent.

When the coach asks how to defend this player, give an actual defensive game plan, not a vague platitude — name real coverage concepts (deny the catch on his strong side, chase over or fight through screens, ICE/weak the ball screen, hard closeout with a contest, wall up and stunt in the paint, blitz or trap the ball-handler, load the strong-side help) and tie each one to the zone or tendency the data shows.

When the coach asks for a broader game plan, strategy, or "what should we do" — not narrowly about one zone or one defensive coverage — think like a head coach building a script: what actions get this player his shots (which sets, screens, and reads), where to hunt matchups, and what adjustment to make if the first plan doesn't work. Still ground it in the real tendencies from the data, but don't limit yourself to reciting stats back — synthesize them into an actual plan the way a coaching staff would draw one up. Keep it to 3-4 tight sections (not a quarter-by-quarter breakdown of the whole game) — a coaching memo a staff would actually read before tip-off, not a playbook chapter.`;

const OPPONENT_PREP_SYSTEM_PROMPT = `${COACH_PERSONA}

You're an NBA advance-scouting assistant. You will be given a player's full historical shot profile against ONE specific opponent — not the dashboard's current filters, this is the player's complete history against this team. Write a short scouting brief (3-5 sentences): how the player has performed against this specific opponent (volume, efficiency), which zones to lean into or watch for, and one concrete tactical recommendation tailored to this matchup — a real action or coverage, not a platitude. Ground every claim in the numbers given. If the sample is small (well under 20 attempts), say so plainly instead of overstating confidence.`;

export async function POST(request: NextRequest) {
  let body: {
    mode?: string;
    context?: unknown;
    question?: string;
    history?: unknown;
    opponent?: string;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.context) {
    return NextResponse.json({ error: "Missing context" }, { status: 400 });
  }

  if (isContextTooLarge(body.context)) {
    return NextResponse.json({ error: "Context too large" }, { status: 413 });
  }

  try {
    if (body.mode === "insights") {
      const insights = await generateInsights(body.context);
      return NextResponse.json({ insights });
    }

    if (body.mode === "chat") {
      if (!body.question || typeof body.question !== "string") {
        return NextResponse.json({ error: "Missing question" }, { status: 400 });
      }
      if (body.question.length > MAX_QUESTION_LENGTH) {
        return NextResponse.json({ error: "Question too long" }, { status: 400 });
      }
      const message = await generateChatReply(
        body.context,
        body.question,
        sanitizeHistory(body.history)
      );
      return NextResponse.json({ message });
    }

    if (body.mode === "opponent-prep") {
      if (!body.opponent || typeof body.opponent !== "string") {
        return NextResponse.json({ error: "Missing opponent" }, { status: 400 });
      }
      const message = await generateOpponentPrep(body.context, body.opponent);
      return NextResponse.json({ message });
    }

    return NextResponse.json(
      { error: "mode must be 'insights', 'chat', or 'opponent-prep'" },
      { status: 400 }
    );
  } catch (error) {
    // Full details stay in the server log; clients get a generic message so
    // upstream API errors (which may include account details) are not exposed.
    console.error("Coach API error:", error);
    return NextResponse.json({ error: "Coach service unavailable" }, { status: 500 });
  }
}

async function generateInsights(context: unknown) {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: COACH_MODEL,
    max_tokens: 1200,
    system: INSIGHTS_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Filtered shot data:\n\n${JSON.stringify(context, null, 2)}\n\nGenerate the tactical insights.`
      }
    ],
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            insights: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  body: { type: "string" },
                  tone: { type: "string", enum: ["strength", "warning", "player"] }
                },
                required: ["title", "body", "tone"],
                additionalProperties: false
              }
            }
          },
          required: ["insights"],
          additionalProperties: false
        }
      }
    }
  });

  const parsed = extractJson(response) as { insights?: unknown } | null;
  const rawInsights = Array.isArray(parsed?.insights) ? parsed!.insights : [];

  return rawInsights.map((insight, index) => {
    const entry = insight as { title?: unknown; body?: unknown; tone?: unknown };
    const tone =
      entry.tone === "strength" || entry.tone === "warning" || entry.tone === "player"
        ? entry.tone
        : "player";

    return {
      id: `ai-insight-${index}`,
      title: typeof entry.title === "string" ? entry.title : "Tactical Note",
      body: typeof entry.body === "string" ? entry.body : "",
      tone
    };
  });
}

async function generateChatReply(
  context: unknown,
  question: string,
  history: ChatHistoryMessage[]
) {
  const client = getAnthropicClient();

  const conversation: Anthropic.MessageParam[] = [
    ...history.map((entry) => ({ role: entry.role, content: entry.content })),
    { role: "user", content: question }
  ];

  const response = await client.messages.create({
    model: COACH_MODEL,
    max_tokens: 900,
    system: `${CHAT_SYSTEM_PROMPT}\n\nCurrent filtered shot data:\n${JSON.stringify(context, null, 2)}`,
    messages: conversation
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && "text" in textBlock ? textBlock.text : "";
}

async function generateOpponentPrep(context: unknown, opponent: string) {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: COACH_MODEL,
    max_tokens: 500,
    system: OPPONENT_PREP_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Opponent: ${opponent}\n\nPlayer's full historical shot profile against this opponent:\n\n${JSON.stringify(context, null, 2)}\n\nWrite the scouting brief.`
      }
    ]
  });

  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && "text" in textBlock ? textBlock.text : "";
}

function extractJson(response: Anthropic.Message) {
  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || !("text" in textBlock)) {
    return null;
  }

  try {
    return JSON.parse(textBlock.text);
  } catch {
    return null;
  }
}
