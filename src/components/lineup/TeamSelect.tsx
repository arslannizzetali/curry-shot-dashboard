"use client";

import type { ChangeEvent } from "react";
import { teamPlayersData } from "@/src/data/teamPlayersData";
import type { TeamId, TeamTheme } from "@/src/types/team";

type TeamSelectProps = {
  label: string;
  selectedTeamId: TeamId;
  onTeamChange: (teamId: TeamId) => void;
  teamTheme: TeamTheme;
};

export function TeamSelect({ label, selectedTeamId, onTeamChange, teamTheme }: TeamSelectProps) {
  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onTeamChange(event.target.value as TeamId);
  }

  return (
    <label className="grid gap-2">
      <span
        className="text-xs font-black uppercase tracking-[0.2em]"
        style={{ color: teamTheme.accent }}
      >
        {label}
      </span>
      <select
        value={selectedTeamId}
        onChange={handleChange}
        className="h-11 rounded-xl border border-white/10 bg-slate-950 px-3 text-sm font-bold text-white outline-none transition focus:border-white/35"
      >
        {teamPlayersData.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
    </label>
  );
}
