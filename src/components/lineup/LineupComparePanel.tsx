"use client";

import { useState } from "react";
import { CourtFormation } from "@/src/components/lineup/CourtFormation";
import { PlayerStatCard } from "@/src/components/lineup/PlayerStatCard";
import { TeamSelect } from "@/src/components/lineup/TeamSelect";
import { startingFiveData } from "@/src/data/startingFiveData";
import type { LineupPlayer } from "@/src/types/lineup";
import type { TeamId } from "@/src/types/team";
import { getTeamById } from "@/src/utils/data/getTeamById";
import { getTeamTheme } from "@/src/utils/data/getTeamTheme";

type TeamSideProps = {
  label: string;
  teamId: TeamId;
  onTeamChange: (teamId: TeamId) => void;
};

function TeamSide({ label, teamId, onTeamChange }: TeamSideProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<LineupPlayer | null>(null);
  const team = getTeamById(teamId);
  const teamTheme = getTeamTheme(teamId);
  const lineup = startingFiveData[teamId] ?? [];

  function handleTeamChange(nextTeamId: TeamId) {
    setSelectedPlayer(null);
    onTeamChange(nextTeamId);
  }

  return (
    <div className="grid gap-3">
      <TeamSelect
        label={label}
        selectedTeamId={teamId}
        onTeamChange={handleTeamChange}
        teamTheme={teamTheme}
      />
      <CourtFormation
        team={team}
        lineup={lineup}
        teamTheme={teamTheme}
        selectedPlayerId={selectedPlayer?.playerId ?? null}
        onPlayerSelect={setSelectedPlayer}
      />
      <PlayerStatCard player={selectedPlayer} teamTheme={teamTheme} />
    </div>
  );
}

export function LineupComparePanel() {
  const [teamAId, setTeamAId] = useState<TeamId>("warriors");
  const [teamBId, setTeamBId] = useState<TeamId>("lakers");

  return (
    <section className="glass-panel rounded-lg p-4 sm:p-5">
      <div className="mb-4">
        <p className="text-[0.66rem] font-black uppercase tracking-[0.24em] text-slate-400">
          Head-to-Head
        </p>
        <h2 className="mt-1 text-xl font-black text-white">Starting Five Comparison</h2>
        <p className="mt-1 max-w-2xl text-sm text-slate-400">
          Current-roster starting fives, positioned by formation. Click any player to see height and
          per-game stats.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TeamSide label="Team A" teamId={teamAId} onTeamChange={setTeamAId} />
        <TeamSide label="Team B" teamId={teamBId} onTeamChange={setTeamBId} />
      </div>
    </section>
  );
}
