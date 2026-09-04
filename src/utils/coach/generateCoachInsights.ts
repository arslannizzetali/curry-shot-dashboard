import type { Shot } from "@/src/types/shot";
import type { Player } from "@/src/types/team";
import {
  coachInsightRules,
  type CoachInsight
} from "@/src/utils/coach/coachInsightRules";
import { calculateSummaryMetrics } from "@/src/utils/metrics/calculateSummaryMetrics";

type GenerateCoachInsightsArgs = {
  shots: Shot[];
  selectedPlayer: Player;
};

export function generateCoachInsights({
  shots,
  selectedPlayer
}: GenerateCoachInsightsArgs): CoachInsight[] {
  const metrics = calculateSummaryMetrics(shots);

  if (metrics.attempts === 0) {
    return [
      {
        id: "empty-data",
        title: "No Tactical Read Yet",
        body: "No shot data is available for the current filters. Clear filters or select another player to generate coaching recommendations.",
        tone: "warning"
      }
    ];
  }

  const insights: CoachInsight[] = [];

  if (
    metrics.threePointAttempts > 0 &&
    metrics.threePointPct < coachInsightRules.lowThreePointPct
  ) {
    insights.push({
      id: "low-three-point-efficiency",
      title: "Three-Point Efficiency Is Low",
      body: "Use more rim pressure and paint touches before creating perimeter shots. Cleaner inside-out possessions should improve shot quality.",
      tone: "warning"
    });
  }

  const highEfficiencyZone = metrics.zoneBreakdown.find(
    (zone) =>
      zone.attempts >= coachInsightRules.minimumZoneAttempts &&
      zone.fieldGoalPct >= coachInsightRules.highZoneEfficiency
  );

  if (highEfficiencyZone) {
    insights.push({
      id: "high-efficiency-zone",
      title: `${highEfficiencyZone.zone} Is Working`,
      body: `This player is more efficient from ${highEfficiencyZone.zone}. Consider running more actions toward that area.`,
      tone: "strength"
    });
  }

  const lowEfficiencyZone = metrics.zoneBreakdown.find(
    (zone) =>
      zone.attempts >= coachInsightRules.minimumZoneAttempts &&
      zone.fieldGoalPct <= coachInsightRules.lowZoneEfficiency
  );

  if (lowEfficiencyZone) {
    insights.push({
      id: "low-efficiency-zone",
      title: `Avoid Forced Looks From ${lowEfficiencyZone.zone}`,
      body: `Efficiency is currently low from ${lowEfficiencyZone.zone}. Use counters before settling for repeated attempts there.`,
      tone: "warning"
    });
  }

  insights.push({
    id: "player-specific-guidance",
    title: `${selectedPlayer.name} Usage Note`,
    body: coachInsightRules.playerGuidance[selectedPlayer.id],
    tone: "player"
  });

  return insights.slice(0, 4);
}
