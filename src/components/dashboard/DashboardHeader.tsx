import type { Player, Team, TeamTheme } from "@/src/types/team";

type DashboardHeaderProps = {
  selectedTeam: Team;
  selectedPlayer: Player;
  teamTheme: TeamTheme;
  visibleShotCount: number;
  totalShotCount: number;
};

export function DashboardHeader({
  selectedTeam,
  selectedPlayer,
  teamTheme,
  visibleShotCount,
  totalShotCount
}: DashboardHeaderProps) {
  return (
    <header className="glass-panel rounded-lg p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            <span
              className="rounded-full border px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.22em]"
              style={{
                borderColor: `${teamTheme.accent}70`,
                backgroundColor: `${teamTheme.accent}18`,
                color: teamTheme.accent
              }}
            >
              Player-Configurable NBA Dashboard
            </span>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[0.66rem] font-black uppercase tracking-[0.22em] text-slate-300">
              {selectedTeam.abbreviation}
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
            CurryShot Dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm font-medium text-slate-300 sm:text-base">
            Shot chart, filters, summary metrics, and tactical coaching context for{" "}
            {selectedPlayer.name}.
          </p>
        </div>

        <div
          className="grid min-w-[220px] gap-1 rounded-lg border bg-black/30 p-4"
          style={{ borderColor: `${teamTheme.accent}55` }}
        >
          <p className="text-[0.65rem] font-black uppercase tracking-[0.22em] text-slate-400">
            Active Player
          </p>
          <p className="text-2xl font-black text-white">{selectedPlayer.name}</p>
          <p className="text-sm font-semibold text-slate-300">
            {visibleShotCount} of {totalShotCount} shots visible
          </p>
        </div>
      </div>
    </header>
  );
}
