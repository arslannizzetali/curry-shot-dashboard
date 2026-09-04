import { teamPlayersData } from "@/src/data/teamPlayersData";
import type { Player, PlayerId } from "@/src/types/team";

export function getPlayerById(playerId: PlayerId): Player {
  const player = teamPlayersData
    .flatMap((team) => team.players)
    .find((teamPlayer) => teamPlayer.id === playerId);

  return player ?? teamPlayersData[0].players[0];
}
