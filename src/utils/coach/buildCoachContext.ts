import type { Shot } from "@/src/types/shot";
import type { Player } from "@/src/types/team";
import { calculateSummaryMetrics } from "@/src/utils/metrics/calculateSummaryMetrics";
import { calculateOpponentBreakdown } from "@/src/utils/metrics/calculateOpponentBreakdown";

export type CoachContext = ReturnType<typeof buildCoachContext>;

const MIN_MATCHUP_ATTEMPTS = 5;

export function buildCoachContext(
  shots: Shot[],
  selectedPlayer: Player,
  allPlayerShots: Shot[] = shots
) {
  const metrics = calculateSummaryMetrics(shots);
  const zoneBreakdown = metrics.zoneBreakdown;
  const bestEfficiencyZone = [...zoneBreakdown]
    .filter((zone) => zone.attempts >= 2)
    .sort((firstZone, secondZone) => secondZone.fieldGoalPct - firstZone.fieldGoalPct)[0];
  const weakestEfficiencyZone = [...zoneBreakdown]
    .filter((zone) => zone.attempts >= 2)
    .sort((firstZone, secondZone) => firstZone.fieldGoalPct - secondZone.fieldGoalPct)[0];
  const threePointZones = zoneBreakdown.filter((zone) => zone.threePointAttempts > 0);
  const bestThreePointZone = [...threePointZones].sort(
    (firstZone, secondZone) => secondZone.threePointPct - firstZone.threePointPct
  )[0];

  // Opponent matchup breakdown always comes from the player's full season history
  // (not the dashboard's current filters) so "best/worst matchup" questions stay
  // answerable regardless of what the coach has filtered the chart down to.
  const opponentBreakdown = calculateOpponentBreakdown(allPlayerShots);
  const qualifiedOpponents = opponentBreakdown.filter(
    (opponent) => opponent.attempts >= MIN_MATCHUP_ATTEMPTS
  );
  const bestMatchupOpponent = [...qualifiedOpponents].sort(
    (firstOpponent, secondOpponent) => secondOpponent.fieldGoalPct - firstOpponent.fieldGoalPct
  )[0];
  const worstMatchupOpponent = [...qualifiedOpponents].sort(
    (firstOpponent, secondOpponent) => firstOpponent.fieldGoalPct - secondOpponent.fieldGoalPct
  )[0];

  return {
    selectedPlayer,
    shots,
    metrics,
    zoneBreakdown,
    bestEfficiencyZone,
    weakestEfficiencyZone,
    bestThreePointZone,
    opponentBreakdown,
    bestMatchupOpponent,
    worstMatchupOpponent,
    dataSummary: {
      attempts: metrics.attempts,
      makes: metrics.makes,
      fieldGoalPct: metrics.fieldGoalPct,
      threePointAttempts: metrics.threePointAttempts,
      threePointMakes: metrics.threePointMakes,
      threePointPct: metrics.threePointPct,
      averageShotDistance: metrics.averageShotDistance,
      topShotZone: metrics.topShotZone
    }
  };
}

/**
 * Trims a CoachContext down to what the LLM actually needs — the raw shot
 * list is excluded since the aggregated metrics already summarize it and
 * sending every shot would burn tokens for no benefit.
 */
export function toCoachApiPayload(context: CoachContext) {
  const {
    selectedPlayer,
    dataSummary,
    zoneBreakdown,
    bestEfficiencyZone,
    weakestEfficiencyZone,
    bestThreePointZone,
    opponentBreakdown,
    bestMatchupOpponent,
    worstMatchupOpponent
  } = context;

  return {
    player: { id: selectedPlayer.id, name: selectedPlayer.name },
    dataSummary,
    zoneBreakdown,
    bestEfficiencyZone: bestEfficiencyZone ?? null,
    weakestEfficiencyZone: weakestEfficiencyZone ?? null,
    bestThreePointZone: bestThreePointZone ?? null,
    opponentMatchups: {
      note: "Reflects this player's own shooting sample against each opponent this season — not the opponent's defensive scheme or rating, since that data isn't available here.",
      minAttemptsForRanking: MIN_MATCHUP_ATTEMPTS,
      breakdown: opponentBreakdown,
      bestMatchup: bestMatchupOpponent ?? null,
      worstMatchup: worstMatchupOpponent ?? null
    }
  };
}
