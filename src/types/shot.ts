import type { PlayerId, TeamId } from "@/src/types/team";

export type ShotResult = "made" | "missed";

export type ShotType = "2PT Field Goal" | "3PT Field Goal";

export type ShotZone =
  | "Restricted Area"
  | "Paint"
  | "Mid-Range"
  | "Left Corner 3"
  | "Right Corner 3"
  | "Left Wing"
  | "Right Wing"
  | "Top of Key";

export type Shot = {
  playerId: PlayerId;
  playerName: string;
  teamId: TeamId;
  season: string;
  opponent: string;
  shotResult: ShotResult;
  shotZone: ShotZone;
  shotDistance: number;
  x: number;
  y: number;
  shotType: ShotType;
};
