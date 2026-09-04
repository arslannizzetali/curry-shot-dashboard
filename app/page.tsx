"use client";

import { useMemo, useState } from "react";
import { CoachAssistantPanel } from "@/src/components/coach/CoachAssistantPanel";
import { DashboardGrid } from "@/src/components/dashboard/DashboardGrid";
import { DashboardHeader } from "@/src/components/dashboard/DashboardHeader";
import { DashboardShell } from "@/src/components/dashboard/DashboardShell";
import {
  FiltersPanel,
  type ShotFilters
} from "@/src/components/dashboard/FiltersPanel";
import { PlayerControlPanel } from "@/src/components/dashboard/PlayerControlPanel";
import { ShotChartPanel } from "@/src/components/dashboard/ShotChartPanel";
import { SummaryMetricsPanel } from "@/src/components/dashboard/SummaryMetricsPanel";
import { LineupComparePanel } from "@/src/components/lineup/LineupComparePanel";
import {
  DEFAULT_PLAYER_ID,
  DEFAULT_TEAM_ID
} from "@/src/data/teamPlayersData";
import { shotData } from "@/src/data/shotData";
import type { Shot } from "@/src/types/shot";
import type { PlayerId, TeamId } from "@/src/types/team";
import { getPlayerById } from "@/src/utils/data/getPlayerById";
import { getPlayersByTeam } from "@/src/utils/data/getPlayersByTeam";
import { getTeamById } from "@/src/utils/data/getTeamById";
import { getTeamTheme } from "@/src/utils/data/getTeamTheme";
import { getUniqueSorted } from "@/src/utils/data/getUniqueSorted";

const initialFilters: ShotFilters = {
  season: "all",
  opponent: "all",
  shotResult: "all",
  shotType: "all",
  shotZone: "all",
  shotDistance: "all"
};

type DashboardMode = "shotChart" | "compare";

export default function Home() {
  const [mode, setMode] = useState<DashboardMode>("shotChart");
  const [selectedTeamId, setSelectedTeamId] =
    useState<TeamId>(DEFAULT_TEAM_ID);
  const [selectedPlayerId, setSelectedPlayerId] =
    useState<PlayerId>(DEFAULT_PLAYER_ID);
  const [filters, setFilters] = useState<ShotFilters>(initialFilters);

  const selectedTeam = getTeamById(selectedTeamId);
  const selectedPlayer = getPlayerById(selectedPlayerId);
  const teamTheme = getTeamTheme(selectedTeamId);

  const playerShots = useMemo(
    () =>
      shotData.filter(
        (shot) =>
          shot.teamId === selectedTeamId && shot.playerId === selectedPlayerId
      ),
    [selectedTeamId, selectedPlayerId]
  );

  const filteredShots = useMemo(
    () => filterShots(playerShots, filters),
    [playerShots, filters]
  );

  const filterOptions = useMemo(
    () => ({
      seasons: getUniqueSorted(playerShots.map((shot) => shot.season)),
      opponents: getUniqueSorted(playerShots.map((shot) => shot.opponent)),
      shotZones: getUniqueSorted(playerShots.map((shot) => shot.shotZone))
    }),
    [playerShots]
  );

  function handleTeamChange(teamId: TeamId) {
    const nextPlayers = getPlayersByTeam(teamId);

    setSelectedTeamId(teamId);
    setSelectedPlayerId(nextPlayers[0]?.id ?? DEFAULT_PLAYER_ID);
    setFilters(initialFilters);
  }

  function handlePlayerChange(playerId: PlayerId) {
    setSelectedPlayerId(playerId);
    setFilters(initialFilters);
  }

  function handleFilterChange<Key extends keyof ShotFilters>(
    key: Key,
    value: ShotFilters[Key]
  ) {
    setFilters((currentFilters) => ({
      ...currentFilters,
      [key]: value
    }));
  }

  return (
    <DashboardShell selectedTeam={selectedTeam} teamTheme={teamTheme}>
      <DashboardHeader
        selectedTeam={selectedTeam}
        selectedPlayer={selectedPlayer}
        teamTheme={teamTheme}
        visibleShotCount={filteredShots.length}
        totalShotCount={playerShots.length}
      />

      <div className="flex gap-2">
        {(
          [
            { id: "shotChart", label: "Shot Chart" },
            { id: "compare", label: "Compare Lineups" }
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className="rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.16em] transition"
            style={
              mode === tab.id
                ? {
                    borderColor: teamTheme.accent,
                    backgroundColor: `${teamTheme.accent}22`,
                    color: teamTheme.accent
                  }
                : {
                    borderColor: "rgba(255,255,255,0.14)",
                    color: "rgb(203 213 225)"
                  }
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === "shotChart" ? (
        <DashboardGrid
          controls={
            <PlayerControlPanel
              selectedTeam={selectedTeam}
              selectedPlayer={selectedPlayer}
              selectedTeamId={selectedTeamId}
              selectedPlayerId={selectedPlayerId}
              onTeamChange={handleTeamChange}
              onPlayerChange={handlePlayerChange}
              teamTheme={teamTheme}
            />
          }
          filters={
            <FiltersPanel
              filters={filters}
              options={filterOptions}
              onFilterChange={handleFilterChange}
              onReset={() => setFilters(initialFilters)}
              teamTheme={teamTheme}
            />
          }
          chart={
            <ShotChartPanel
              shots={filteredShots}
              selectedPlayer={selectedPlayer}
              teamTheme={teamTheme}
            />
          }
          metrics={
            <SummaryMetricsPanel
              shots={filteredShots}
              selectedPlayer={selectedPlayer}
              teamTheme={teamTheme}
            />
          }
          coach={
            <CoachAssistantPanel
              shots={filteredShots}
              allPlayerShots={playerShots}
              selectedPlayer={selectedPlayer}
              teamTheme={teamTheme}
            />
          }
        />
      ) : (
        <LineupComparePanel />
      )}
    </DashboardShell>
  );
}

function filterShots(shots: Shot[], filters: ShotFilters): Shot[] {
  return shots.filter((shot) => {
    if (filters.season !== "all" && shot.season !== filters.season) {
      return false;
    }

    if (filters.opponent !== "all" && shot.opponent !== filters.opponent) {
      return false;
    }

    if (
      filters.shotResult !== "all" &&
      shot.shotResult !== filters.shotResult
    ) {
      return false;
    }

    if (filters.shotType !== "all" && shot.shotType !== filters.shotType) {
      return false;
    }

    if (filters.shotZone !== "all" && shot.shotZone !== filters.shotZone) {
      return false;
    }

    if (filters.shotDistance === "0-10" && shot.shotDistance > 10) {
      return false;
    }

    if (
      filters.shotDistance === "10-20" &&
      (shot.shotDistance < 10 || shot.shotDistance > 20)
    ) {
      return false;
    }

    if (filters.shotDistance === "20-plus" && shot.shotDistance < 20) {
      return false;
    }

    return true;
  });
}
