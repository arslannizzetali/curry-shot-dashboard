import { teamPlayersData } from "@/src/data/teamPlayersData";
import type { Player, TeamId } from "@/src/types/team";

export function getPlayersByTeam(teamId: TeamId): Player[] {
  return teamPlayersData.find((team) => team.id === teamId)?.players ?? [];
}
