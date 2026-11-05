import type { CoachContext } from "@/src/utils/coach/buildCoachContext";

export type CoachChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type CoachAgentInput = {
  question: string;
  context: CoachContext;
  history: CoachChatMessage[];
};

export function runCoachAgent({ question, context, history }: CoachAgentInput) {
  const normalizedQuestion = question.trim().toLowerCase();
  const intent = detectIntent(normalizedQuestion);
  const opening = buildOpening(context);
  const evidence = buildEvidence(context, intent);
  const recommendation = buildRecommendation(context, intent);
  const followUp = buildFollowUp(intent, history.length);

  return [opening, evidence, recommendation, followUp].filter(Boolean).join(" ");
}

function detectIntent(question: string) {
  if (includesAny(question, ["three", "3", "3pt", "triple", "perimeter", "shoot", "shot"])) {
    return "three-point";
  }

  if (includesAny(question, ["zone", "where", "area", "spot", "map", "nerede", "bölge"])) {
    return "zone";
  }

  if (
    includesAny(question, [
      "matchup",
      "opponent",
      "team",
      "defend",
      "worst team",
      "best team",
      "rakip"
    ])
  ) {
    return "matchup";
  }

  if (
    includesAny(question, ["assist", "pass", "playmaking", "kick", "create", "dribble", "drive"])
  ) {
    return "creation";
  }

  if (includesAny(question, ["weak", "bad", "avoid", "problem", "miss", "low", "risk"])) {
    return "weakness";
  }

  if (includesAny(question, ["plan", "strategy", "adjust", "game", "how", "attack", "defense"])) {
    return "game-plan";
  }

  return "general";
}

function buildOpening(context: CoachContext) {
  const { selectedPlayer, metrics } = context;

  if (metrics.attempts === 0) {
    return `I do not have enough shot data for ${selectedPlayer.name} in the current filters yet.`;
  }

  return `For ${selectedPlayer.name}, I am reading ${metrics.attempts} filtered shots with ${metrics.fieldGoalPct.toFixed(
    1
  )}% overall FG and ${metrics.threePointPct.toFixed(1)}% from three.`;
}

function buildEvidence(context: CoachContext, intent: ReturnType<typeof detectIntent>) {
  const {
    metrics,
    bestEfficiencyZone,
    weakestEfficiencyZone,
    bestThreePointZone,
    bestMatchupOpponent,
    worstMatchupOpponent
  } = context;

  if (metrics.attempts === 0) {
    return "Clear filters or select another player before asking for a tactical recommendation.";
  }

  if (intent === "matchup") {
    if (!bestMatchupOpponent && !worstMatchupOpponent) {
      return "No opponent has a big enough sample yet to call out a best or worst matchup with confidence.";
    }

    const bestNote = bestMatchupOpponent
      ? `The best matchup by shooting performance is ${bestMatchupOpponent.opponent}: ${bestMatchupOpponent.fieldGoalPct.toFixed(1)}% on ${bestMatchupOpponent.attempts} attempts.`
      : "";
    const worstNote = worstMatchupOpponent
      ? ` The toughest is ${worstMatchupOpponent.opponent}: ${worstMatchupOpponent.fieldGoalPct.toFixed(1)}% on ${worstMatchupOpponent.attempts} attempts.`
      : "";

    return `${bestNote}${worstNote} That reflects this player's own shooting sample against each team, not their opponent's defensive scheme.`;
  }

  if (intent === "three-point") {
    return bestThreePointZone
      ? `The strongest three-point signal is ${bestThreePointZone.zone}: ${bestThreePointZone.threePointMakes}/${bestThreePointZone.threePointAttempts} threes, ${bestThreePointZone.threePointPct.toFixed(1)}%.`
      : "There is no meaningful three-point sample in this filtered view.";
  }

  if (intent === "zone") {
    return bestEfficiencyZone
      ? `${bestEfficiencyZone.zone} is the best efficiency zone at ${bestEfficiencyZone.fieldGoalPct.toFixed(1)}% on ${bestEfficiencyZone.attempts} attempts.`
      : `${metrics.topShotZone} is currently the highest-volume zone, but the sample is still small.`;
  }

  if (intent === "weakness") {
    return weakestEfficiencyZone
      ? `${weakestEfficiencyZone.zone} is the main warning area: ${weakestEfficiencyZone.fieldGoalPct.toFixed(1)}% on ${weakestEfficiencyZone.attempts} attempts.`
      : "I do not see a clear weak zone yet because the filtered sample is small.";
  }

  if (intent === "creation") {
    return `The average shot distance is ${metrics.averageShotDistance.toFixed(1)} feet, so shot creation should be judged by whether it creates rhythm looks rather than late-clock forced attempts.`;
  }

  return bestEfficiencyZone
    ? `The best current signal is ${bestEfficiencyZone.zone}, while ${weakestEfficiencyZone?.zone ?? "no single zone"} is the area to watch.`
    : `The top volume zone is ${metrics.topShotZone}.`;
}

function buildRecommendation(context: CoachContext, intent: ReturnType<typeof detectIntent>) {
  const { selectedPlayer, metrics, bestEfficiencyZone, weakestEfficiencyZone } = context;

  if (metrics.attempts === 0) {
    return "Once data is available, I can compare zones, efficiency, and shot profile.";
  }

  if (selectedPlayer.id === "lebron-james") {
    if (intent === "three-point") {
      return "Do not make him a static volume shooter first; use paint pressure, then kick-out or trail threes when the defense collapses.";
    }

    return "The game plan should start with rim pressure, mismatch hunting, and drive-and-kick reads. His jumper becomes more valuable after the defense has already protected the paint.";
  }

  if (selectedPlayer.id === "stephen-curry") {
    if (intent === "creation") {
      return "Use relocation actions, drag screens, and quick handoffs so the defense has to choose between switching high or giving up a clean pull-up.";
    }

    if (intent === "weakness" && weakestEfficiencyZone) {
      return `Reduce forced attempts from ${weakestEfficiencyZone.zone}; use it as a decoy zone before flowing into the stronger side.`;
    }

    return bestEfficiencyZone
      ? `Run more off-ball and early-clock actions toward ${bestEfficiencyZone.zone}; if the defense overplays it, flow into a second-side attack.`
      : "Keep the offense moving through spacing, transition threes, and off-ball gravity.";
  }

  return "Prioritize the most efficient zone, reduce low-efficiency volume, and ask the player to create advantages before settling.";
}

function buildFollowUp(intent: ReturnType<typeof detectIntent>, historyLength: number) {
  if (historyLength > 4) {
    return "I can also turn this into a short scouting report if you want the next answer to be more structured.";
  }

  if (intent === "zone") {
    return "Next, ask me which action package fits this zone.";
  }

  if (intent === "three-point") {
    return "Next, ask whether the threes should come from pull-ups, catch-and-shoots, or transition.";
  }

  return "Ask a follow-up and I will keep the same tactical context.";
}

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword));
}
