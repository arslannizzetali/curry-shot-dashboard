import type { TeamId } from "@/src/types/team";

export type CourtSlot = "PG" | "SG" | "SF" | "PF" | "C";

export type LineupPlayer = {
  playerId: number;
  slot: CourtSlot;
  name: string;
  jerseyNumber: string;
  position: string;
  heightLabel: string;
  pointsPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  fieldGoalPct: number;
};

export type TeamLineup = {
  teamId: TeamId;
  players: LineupPlayer[];
};
