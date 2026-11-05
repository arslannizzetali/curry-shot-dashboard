import type { Shot, ShotType, ShotZone } from "@/src/types/shot";

export function shot(zone: ShotZone, made: boolean, overrides: Partial<Shot> = {}): Shot {
  const shotType: ShotType =
    zone.includes("3") || zone.includes("Wing") || zone === "Top of Key"
      ? "3PT Field Goal"
      : "2PT Field Goal";
  return {
    playerId: "stephen-curry",
    playerName: "Stephen Curry",
    teamId: "warriors",
    season: "2025-26",
    opponent: "Lakers",
    shotResult: made ? "made" : "missed",
    shotZone: zone,
    shotDistance: shotType === "3PT Field Goal" ? 25 : 5,
    x: 0,
    y: 0,
    shotType,
    ...overrides
  } as Shot;
}
