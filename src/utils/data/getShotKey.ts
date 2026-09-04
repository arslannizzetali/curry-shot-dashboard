import type { Shot } from "@/src/types/shot";

export function getShotKey(shot: Shot, shotIndex: number): string {
  return [
    shot.playerId,
    shot.season,
    shot.opponent,
    shot.shotType,
    shot.shotZone,
    shot.x,
    shot.y,
    shotIndex
  ].join("-");
}
