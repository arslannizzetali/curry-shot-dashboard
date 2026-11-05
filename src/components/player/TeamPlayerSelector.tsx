"use client";

import type { ChangeEvent } from "react";
import { teamPlayersData } from "@/src/data/teamPlayersData";
import { getPlayersByTeam } from "@/src/utils/data/getPlayersByTeam";
import type { PlayerId, TeamId, TeamTheme } from "@/src/types/team";

type TeamPlayerSelectorProps = {
  selectedTeamId: TeamId;
  selectedPlayerId: PlayerId;
  onTeamChange: (teamId: TeamId) => void;
  onPlayerChange: (playerId: PlayerId) => void;
  teamTheme: TeamTheme;
};

export function TeamPlayerSelector({
  selectedTeamId,
  selectedPlayerId,
  onTeamChange,
  onPlayerChange,
  teamTheme
}: TeamPlayerSelectorProps) {
  const players = getPlayersByTeam(selectedTeamId);

  function handleTeamChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextTeamId = event.target.value as TeamId;
    const nextPlayers = getPlayersByTeam(nextTeamId);
    const currentPlayerAvailable = nextPlayers.some((player) => player.id === selectedPlayerId);

    onTeamChange(nextTeamId);

    if (!currentPlayerAvailable && nextPlayers[0]) {
      onPlayerChange(nextPlayers[0].id);
    }
  }

  return (
    <section
      className="rounded-2xl border bg-white/[0.045] p-4 shadow-panel"
      style={{ borderColor: `${teamTheme.accent}55` }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p
            className="text-[0.66rem] font-black uppercase tracking-[0.24em]"
            style={{ color: teamTheme.accent }}
          >
            Change Player
          </p>
          <h2 className="mt-1 text-lg font-black text-white">Team and Player</h2>
        </div>
        <div
          className="grid h-10 w-10 place-items-center rounded-full border text-xs font-black"
          style={{
            borderColor: `${teamTheme.accent}70`,
            color: teamTheme.accent
          }}
        >
          NBA
        </div>
      </div>

      <div className="grid gap-3">
        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Select Team
          </span>
          <select
            value={selectedTeamId}
            onChange={handleTeamChange}
            className="h-11 rounded-xl border border-white/10 bg-slate-950 px-3 text-sm font-bold text-white outline-none transition focus:border-white/35"
          >
            {teamPlayersData.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
            Select Player
          </span>
          <select
            value={selectedPlayerId}
            onChange={(event) => onPlayerChange(event.target.value as PlayerId)}
            className="h-11 rounded-xl border border-white/10 bg-slate-950 px-3 text-sm font-bold text-white outline-none transition focus:border-white/35"
          >
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
