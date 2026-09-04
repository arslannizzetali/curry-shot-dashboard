import type { LineupPlayer } from "@/src/types/lineup";
import type { TeamTheme } from "@/src/types/team";

type PlayerStatCardProps = {
  player: LineupPlayer | null;
  teamTheme: TeamTheme;
};

export function PlayerStatCard({ player, teamTheme }: PlayerStatCardProps) {
  if (!player) {
    return (
      <div className="grid min-h-[132px] place-items-center rounded-lg border border-dashed border-white/15 bg-black/25 p-4 text-center">
        <p className="text-xs font-semibold leading-6 text-slate-400">
          Click a player on the court to see height and stats.
        </p>
      </div>
    );
  }

  const stats = [
    { label: "Height", value: player.heightLabel },
    { label: "PPG", value: player.pointsPerGame.toFixed(1) },
    { label: "RPG", value: player.reboundsPerGame.toFixed(1) },
    { label: "APG", value: player.assistsPerGame.toFixed(1) },
    { label: "FG%", value: `${player.fieldGoalPct.toFixed(1)}%` }
  ];

  return (
    <div
      className="rounded-lg border bg-black/30 p-4"
      style={{ borderColor: `${teamTheme.accent}55` }}
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <p
            className="text-[0.62rem] font-black uppercase tracking-[0.2em]"
            style={{ color: teamTheme.accent }}
          >
            {player.slot} · #{player.jerseyNumber}
          </p>
          <p className="text-lg font-black text-white">{player.name}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-5 gap-2">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-2 text-center"
          >
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.14em] text-slate-400">
              {stat.label}
            </p>
            <p className="mt-0.5 text-sm font-black text-white">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
