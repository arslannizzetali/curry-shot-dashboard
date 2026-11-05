"use client";

import { useEffect, useMemo, useState } from "react";
import { ShotChart } from "@/src/components/chart/ShotChart";
import type { Shot } from "@/src/types/shot";
import type { Player, TeamTheme } from "@/src/types/team";
import { calculateZoneBreakdown } from "@/src/utils/metrics/calculateZoneBreakdown";
import { getShotKey } from "@/src/utils/data/getShotKey";

type ShotChartPanelProps = {
  shots: Shot[];
  selectedPlayer: Player;
  teamTheme: TeamTheme;
};

export function ShotChartPanel({ shots, selectedPlayer, teamTheme }: ShotChartPanelProps) {
  const [selectedShotKey, setSelectedShotKey] = useState<string | null>(null);

  const selectedShot = useMemo(() => {
    if (!selectedShotKey) {
      return null;
    }

    return shots.find((shot, shotIndex) => getShotKey(shot, shotIndex) === selectedShotKey) ?? null;
  }, [selectedShotKey, shots]);

  const selectedZoneStats = useMemo(() => {
    if (!selectedShot) {
      return null;
    }

    return (
      calculateZoneBreakdown(shots).find((zone) => zone.zone === selectedShot.shotZone) ?? null
    );
  }, [selectedShot, shots]);

  useEffect(() => {
    if (!selectedShotKey) {
      return;
    }

    const selectedShotStillVisible = shots.some(
      (shot, shotIndex) => getShotKey(shot, shotIndex) === selectedShotKey
    );

    if (!selectedShotStillVisible) {
      setSelectedShotKey(null);
    }
  }, [selectedShotKey, shots]);

  return (
    <section className="glass-panel rounded-lg p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p
            className="text-[0.66rem] font-black uppercase tracking-[0.24em]"
            style={{ color: teamTheme.accent }}
          >
            Shot Chart
          </p>
          <h2 className="mt-1 text-2xl font-black text-white">{selectedPlayer.name}</h2>
        </div>
        <p className="text-xs font-semibold text-slate-400">
          Click any shot marker to inspect its stats.
        </p>
      </div>

      <ShotChart
        shots={shots}
        selectedPlayer={selectedPlayer}
        teamTheme={teamTheme}
        selectedShotKey={selectedShotKey}
        onShotSelect={(_shot, shotKey) => setSelectedShotKey(shotKey)}
      />

      <ShotSelectionDetails
        selectedShot={selectedShot}
        selectedZoneStats={selectedZoneStats}
        teamTheme={teamTheme}
      />
    </section>
  );
}

function ShotSelectionDetails({
  selectedShot,
  selectedZoneStats,
  teamTheme
}: {
  selectedShot: Shot | null;
  selectedZoneStats: ReturnType<typeof calculateZoneBreakdown>[number] | null;
  teamTheme: TeamTheme;
}) {
  if (!selectedShot) {
    return (
      <div
        className="mt-4 rounded-lg border border-dashed bg-black/25 p-4"
        style={{ borderColor: `${teamTheme.accent}45` }}
      >
        <p className="text-sm font-black text-white">Selected Shot</p>
        <p className="mt-1 text-sm leading-6 text-slate-400">
          Click a make or miss on the court to view the shot details and zone statistics.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid gap-3 rounded-lg border border-white/10 bg-black/25 p-4 md:grid-cols-[1fr_1fr]">
      <div>
        <p
          className="text-[0.65rem] font-black uppercase tracking-[0.2em]"
          style={{ color: teamTheme.accent }}
        >
          Selected Shot
        </p>
        <h3 className="mt-1 text-lg font-black text-white">
          {selectedShot.shotResult === "made" ? "Made" : "Missed"} {selectedShot.shotType}
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <ShotDetail label="Opponent" value={selectedShot.opponent} />
          <ShotDetail label="Season" value={selectedShot.season} />
          <ShotDetail label="Zone" value={selectedShot.shotZone} />
          <ShotDetail label="Distance" value={`${selectedShot.shotDistance} ft`} />
        </div>
      </div>

      <div>
        <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400">
          Zone Snapshot
        </p>
        {selectedZoneStats ? (
          <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
            <ShotDetail label="Attempts" value={selectedZoneStats.attempts} />
            <ShotDetail label="Makes" value={selectedZoneStats.makes} />
            <ShotDetail label="FG%" value={`${selectedZoneStats.fieldGoalPct.toFixed(1)}%`} />
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-400">No zone summary is available.</p>
        )}
      </div>
    </div>
  );
}

function ShotDetail({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
      <p className="text-[0.6rem] font-black uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
