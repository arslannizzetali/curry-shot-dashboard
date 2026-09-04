import { teamPlayersData } from "@/src/data/teamPlayersData";
import type { Team, TeamId } from "@/src/types/team";

export function getTeamById(teamId: TeamId): Team {
  return (
    teamPlayersData.find((team) => team.id === teamId) ?? teamPlayersData[0]
  );
}
