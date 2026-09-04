import type { Shot, ShotZone } from "@/src/types/shot";
import {
  calculateZoneBreakdown,
  type ZoneBreakdownItem
} from "@/src/utils/metrics/calculateZoneBreakdown";

export type SummaryMetrics = {
  attempts: number;
  makes: number;
  fieldGoalPct: number;
  threePointAttempts: number;
  threePointMakes: number;
  threePointPct: number;
  averageShotDistance: number;
  topShotZone: ShotZone | "None";
  zoneBreakdown: ZoneBreakdownItem[];
};

export function calculateSummaryMetrics(shots: Shot[]): SummaryMetrics {
  const attempts = shots.length;
  const makes = shots.filter((shot) => shot.shotResult === "made").length;
  const threePointShots = shots.filter(
    (shot) => shot.shotType === "3PT Field Goal"
  );
  const threePointAttempts = threePointShots.length;
  const threePointMakes = threePointShots.filter(
    (shot) => shot.shotResult === "made"
  ).length;
  const totalShotDistance = shots.reduce(
    (sum, shot) => sum + shot.shotDistance,
    0
  );
  const zoneBreakdown = calculateZoneBreakdown(shots);

  return {
    attempts,
    makes,
    fieldGoalPct: attempts > 0 ? (makes / attempts) * 100 : 0,
    threePointAttempts,
    threePointMakes,
    threePointPct:
      threePointAttempts > 0
        ? (threePointMakes / threePointAttempts) * 100
        : 0,
    averageShotDistance: attempts > 0 ? totalShotDistance / attempts : 0,
    topShotZone: zoneBreakdown[0]?.zone ?? "None",
    zoneBreakdown
  };
}
