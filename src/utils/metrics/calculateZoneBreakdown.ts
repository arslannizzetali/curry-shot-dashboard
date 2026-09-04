import type { Shot, ShotZone } from "@/src/types/shot";

export type ZoneBreakdownItem = {
  zone: ShotZone;
  attempts: number;
  makes: number;
  fieldGoalPct: number;
  threePointAttempts: number;
  threePointMakes: number;
  threePointPct: number;
};

export function calculateZoneBreakdown(shots: Shot[]): ZoneBreakdownItem[] {
  const zoneMap = new Map<ShotZone, ZoneBreakdownItem>();

  shots.forEach((shot) => {
    const current = zoneMap.get(shot.shotZone) ?? {
      zone: shot.shotZone,
      attempts: 0,
      makes: 0,
      fieldGoalPct: 0,
      threePointAttempts: 0,
      threePointMakes: 0,
      threePointPct: 0
    };

    const made = shot.shotResult === "made";
    const isThree = shot.shotType === "3PT Field Goal";

    current.attempts += 1;
    current.makes += made ? 1 : 0;
    current.threePointAttempts += isThree ? 1 : 0;
    current.threePointMakes += isThree && made ? 1 : 0;

    zoneMap.set(shot.shotZone, current);
  });

  return Array.from(zoneMap.values())
    .map((zone) => ({
      ...zone,
      fieldGoalPct: zone.attempts > 0 ? (zone.makes / zone.attempts) * 100 : 0,
      threePointPct:
        zone.threePointAttempts > 0
          ? (zone.threePointMakes / zone.threePointAttempts) * 100
          : 0
    }))
    .sort((firstZone, secondZone) => {
      if (secondZone.attempts !== firstZone.attempts) {
        return secondZone.attempts - firstZone.attempts;
      }

      return secondZone.fieldGoalPct - firstZone.fieldGoalPct;
    });
}
