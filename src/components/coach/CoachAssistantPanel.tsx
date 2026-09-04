"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { TacticalInsightCard } from "@/src/components/coach/TacticalInsightCard";
import type { Shot } from "@/src/types/shot";
import type { Player, TeamTheme } from "@/src/types/team";
import {
  buildCoachContext,
  toCoachApiPayload,
  type CoachContext
} from "@/src/utils/coach/buildCoachContext";
import {
  runCoachAgent,
  type CoachChatMessage
} from "@/src/utils/coach/coachAgent";
import { generateCoachInsights } from "@/src/utils/coach/generateCoachInsights";
import type { CoachInsight } from "@/src/utils/coach/coachInsightRules";
import { getUniqueSorted } from "@/src/utils/data/getUniqueSorted";

type CoachAssistantPanelProps = {
  shots: Shot[];
  allPlayerShots: Shot[];
  selectedPlayer: Player;
  teamTheme: TeamTheme;
};

export function CoachAssistantPanel({
  shots,
  allPlayerShots,
  selectedPlayer,
  teamTheme
}: CoachAssistantPanelProps) {
  const coachContext = useMemo(
    () => buildCoachContext(shots, selectedPlayer, allPlayerShots),
    [shots, selectedPlayer, allPlayerShots]
  );
  const apiPayload = useMemo(
    () => toCoachApiPayload(coachContext),
    [coachContext]
  );

  const [insights, setInsights] = useState<CoachInsight[]>(() =>
    generateCoachInsights({ shots, selectedPlayer })
  );
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<CoachChatMessage[]>(() => [
    createAssistantMessage(
      generateCoachInsights({ shots, selectedPlayer })[0]?.body ??
        "Ask a coaching question to get a tactical read."
    )
  ]);
  const [isSending, setIsSending] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const opponentOptions = useMemo(
    () => getUniqueSorted(allPlayerShots.map((shot) => shot.opponent)),
    [allPlayerShots]
  );
  const [selectedOpponent, setSelectedOpponent] = useState("");
  const [opponentPrepLoading, setOpponentPrepLoading] = useState(false);
  const activeOpponent = selectedOpponent || opponentOptions[0] || "";

  useEffect(() => {
    let cancelled = false;
    setInsightsLoading(true);

    fetchInsights(apiPayload)
      .then((aiInsights) => {
        if (cancelled || aiInsights.length === 0) {
          return;
        }
        setInsights(aiInsights);
        setUsingFallback(false);
        setMessages([createAssistantMessage(aiInsights[0].body)]);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }
        // AI request failed (no API key configured, rate limited, offline) —
        // fall back to the local rule-based engine so the panel still works.
        const fallback = generateCoachInsights({ shots, selectedPlayer });
        setInsights(fallback);
        setUsingFallback(true);
        setMessages([
          createAssistantMessage(
            fallback[0]?.body ?? "Ask a coaching question to get a tactical read."
          )
        ]);
      })
      .finally(() => {
        if (!cancelled) {
          setInsightsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
    // apiPayload changes whenever shots/selectedPlayer change, so it alone is the right dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPayload]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) {
      return;
    }
    container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isSending) {
      return;
    }

    const userMessage = createUserMessage(trimmedQuestion);
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setQuestion("");
    setIsSending(true);

    try {
      const reply = await fetchChatReply(apiPayload, trimmedQuestion, nextHistory);
      setUsingFallback(false);
      setMessages([...nextHistory, createAssistantMessage(reply)]);
    } catch {
      const reply = runCoachAgent({
        question: trimmedQuestion,
        context: coachContext,
        history: nextHistory
      });
      setUsingFallback(true);
      setMessages([...nextHistory, createAssistantMessage(reply)]);
    } finally {
      setIsSending(false);
    }
  }

  async function handleOpponentPrep() {
    if (!activeOpponent || opponentPrepLoading || isSending) {
      return;
    }

    const opponentShots = allPlayerShots.filter(
      (shot) => shot.opponent === activeOpponent
    );
    const opponentContext = buildCoachContext(opponentShots, selectedPlayer);
    const opponentPayload = toCoachApiPayload(opponentContext);

    const requestMessage = createUserMessage(
      `Scouting report request: vs ${activeOpponent}`
    );
    setMessages((current) => [...current, requestMessage]);
    setOpponentPrepLoading(true);

    try {
      const reply = await fetchOpponentPrep(opponentPayload, activeOpponent);
      setUsingFallback(false);
      setMessages((current) => [...current, createAssistantMessage(reply)]);
    } catch {
      const reply = buildLocalOpponentSummary(opponentContext, activeOpponent);
      setUsingFallback(true);
      setMessages((current) => [...current, createAssistantMessage(reply)]);
    } finally {
      setOpponentPrepLoading(false);
    }
  }

  return (
    <section
      className="glass-panel rounded-lg p-4"
      style={{ borderColor: `${teamTheme.accent}45` }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p
            className="text-[0.66rem] font-black uppercase tracking-[0.24em]"
            style={{ color: teamTheme.accent }}
          >
            AI Coach Agent
          </p>
          <h2 className="mt-1 text-lg font-black text-white">
            Tactical Chat
          </h2>
        </div>
        <span
          className="mt-1 flex h-2.5 w-2.5 shrink-0 rounded-full"
          style={{
            backgroundColor: usingFallback ? "#F87171" : "#34D399",
            boxShadow: usingFallback ? "none" : "0 0 6px #34D399"
          }}
          title={usingFallback ? "Offline · rule engine" : "Live · Claude AI"}
        />
      </div>

      {opponentOptions.length > 0 && (
        <div
          className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border bg-black/25 p-3"
          style={{ borderColor: `${teamTheme.accent}30` }}
        >
          <p className="text-[0.62rem] font-black uppercase tracking-[0.18em] text-slate-400">
            Opponent Prep
          </p>
          <select
            value={activeOpponent}
            onChange={(event) => setSelectedOpponent(event.target.value)}
            disabled={opponentPrepLoading || isSending}
            className="rounded-lg border border-white/10 bg-slate-950 px-2 py-1.5 text-xs font-bold text-white outline-none transition focus:border-white/35 disabled:opacity-50"
          >
            {opponentOptions.map((opponent) => (
              <option key={opponent} value={opponent}>
                {opponent}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleOpponentPrep}
            disabled={opponentPrepLoading || isSending}
            className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-white transition hover:border-white/30 disabled:opacity-50"
          >
            {opponentPrepLoading ? "Building…" : "Scouting Report"}
          </button>
          <p className="w-full text-[0.6rem] font-semibold text-slate-500">
            Uses the player&apos;s full history vs this opponent, not the current filters
          </p>
        </div>
      )}

      <div
        className="mb-4 rounded-lg border bg-black/35 p-4"
        style={{ borderColor: `${teamTheme.accent}45` }}
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400">
            Agent Conversation
          </p>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-500">
            Uses current filters
          </p>
        </div>

        <div ref={messagesContainerRef} className="max-h-72 space-y-3 overflow-y-auto pr-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`rounded-lg border p-3 ${
                message.role === "user"
                  ? "ml-8 border-white/10 bg-white/[0.08] text-white"
                  : "mr-8 border-white/10 bg-slate-950/80 text-slate-200"
              }`}
            >
              <p
                className="mb-1 text-[0.58rem] font-black uppercase tracking-[0.18em]"
                style={{
                  color: message.role === "assistant" ? teamTheme.accent : "#CBD5E1"
                }}
              >
                {message.role === "assistant" ? "Coach Agent" : "You"}
              </p>
              <p className="text-sm leading-6">{message.content}</p>
            </div>
          ))}
          {(isSending || opponentPrepLoading) && (
            <div className="mr-8 rounded-lg border border-white/10 bg-slate-950/80 p-3 text-slate-500">
              <p className="text-sm leading-6">Thinking…</p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ask about zones, threes, weaknesses, assists, or game plan"
            disabled={isSending || opponentPrepLoading}
            className="min-w-0 flex-1 rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-white/35 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isSending || opponentPrepLoading}
            className="rounded-lg px-4 py-2 text-sm font-black text-black transition hover:brightness-110 disabled:opacity-50"
            style={{ backgroundColor: teamTheme.accent }}
          >
            {isSending ? "Asking…" : "Ask"}
          </button>
        </form>
      </div>

      <div className="grid gap-3">
        {insightsLoading && insights.length === 0 ? (
          <p className="text-sm text-slate-500">Generating tactical insights…</p>
        ) : (
          insights.map((insight) => (
            <TacticalInsightCard
              key={insight.id}
              insight={insight}
              teamTheme={teamTheme}
            />
          ))
        )}
      </div>
    </section>
  );
}

async function fetchInsights(context: unknown): Promise<CoachInsight[]> {
  const response = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "insights", context })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch insights");
  }

  const data = (await response.json()) as { insights?: CoachInsight[] };
  return Array.isArray(data.insights) ? data.insights : [];
}

async function fetchChatReply(
  context: unknown,
  question: string,
  history: CoachChatMessage[]
): Promise<string> {
  const response = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      mode: "chat",
      context,
      question,
      // history excludes the just-added user message — it's sent separately as `question`
      history: history
        .slice(0, -1)
        .map((message) => ({ role: message.role, content: message.content }))
    })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch chat reply");
  }

  const data = (await response.json()) as { message?: string };

  if (!data.message) {
    throw new Error("Empty response");
  }

  return data.message;
}

async function fetchOpponentPrep(
  context: unknown,
  opponent: string
): Promise<string> {
  const response = await fetch("/api/coach", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode: "opponent-prep", context, opponent })
  });

  if (!response.ok) {
    throw new Error("Failed to fetch opponent prep");
  }

  const data = (await response.json()) as { message?: string };

  if (!data.message) {
    throw new Error("Empty response");
  }

  return data.message;
}

function buildLocalOpponentSummary(
  context: CoachContext,
  opponent: string
): string {
  const { dataSummary, bestEfficiencyZone, weakestEfficiencyZone } = context;

  if (dataSummary.attempts === 0) {
    return `No shot history found against ${opponent} in the current dataset.`;
  }

  const strongZoneNote = bestEfficiencyZone
    ? `${bestEfficiencyZone.zone} has been the strongest zone (${bestEfficiencyZone.fieldGoalPct.toFixed(1)}% on ${bestEfficiencyZone.attempts} attempts).`
    : "No single zone stands out yet given the sample size.";
  const weakZoneNote = weakestEfficiencyZone
    ? ` Watch for forced looks from ${weakestEfficiencyZone.zone} (${weakestEfficiencyZone.fieldGoalPct.toFixed(1)}%).`
    : "";

  return `Against ${opponent}: ${dataSummary.attempts} shots, ${dataSummary.fieldGoalPct.toFixed(1)}% FG, ${dataSummary.threePointPct.toFixed(1)}% from three. ${strongZoneNote}${weakZoneNote}`;
}

function createUserMessage(content: string): CoachChatMessage {
  return {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role: "user",
    content
  };
}

function createAssistantMessage(content: string): CoachChatMessage {
  return {
    id: `assistant-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role: "assistant",
    content
  };
}
