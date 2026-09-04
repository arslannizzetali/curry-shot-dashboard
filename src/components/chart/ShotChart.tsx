import { CourtSvg } from "@/src/components/chart/CourtSvg";
import type { Shot } from "@/src/types/shot";
import type { Player, TeamTheme } from "@/src/types/team";
import { getShotKey } from "@/src/utils/data/getShotKey";

type ShotChartProps = {
  shots: Shot[];
  selectedPlayer: Player;
  teamTheme: TeamTheme;
  selectedShotKey: string | null;
  onShotSelect: (shot: Shot, shotKey: string) => void;
};

export function ShotChart({
  shots,
  selectedPlayer,
  teamTheme,
  selectedShotKey,
  onShotSelect
}: ShotChartProps) {
  if (shots.length === 0) {
    return (
      <div className="grid min-h-[420px] place-items-center rounded-lg border border-dashed border-white/20 bg-black/25 p-8 text-center">
        <div>
          <p className="text-lg font-black text-white">No shot data available.</p>
          <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
            Change filters or select another player to restore the shot chart.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black p-3">
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${selectedPlayer.name} half-court shot chart`}
        className="h-[460px] w-full rounded-lg bg-[#06101F] sm:h-[560px] lg:h-[650px]"
      >
        <defs>
          <filter id="shotGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow
              dx="0"
              dy="0"
              floodColor={teamTheme.accent}
              floodOpacity="0.75"
              stdDeviation="1.3"
            />
          </filter>
        </defs>

        <CourtSvg teamTheme={teamTheme} />

        <g>
          {shots.map((shot, shotIndex) => {
            const made = shot.shotResult === "made";
            const key = getShotKey(shot, shotIndex);
            const selected = key === selectedShotKey;
            const selectShot = () => onShotSelect(shot, key);

            return (
              <g
                key={key}
                role="button"
                tabIndex={0}
                aria-label={`Show stats for ${shot.playerName} ${shot.shotResult} ${shot.shotType} against ${shot.opponent}`}
                className="cursor-pointer outline-none"
                onClick={selectShot}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    selectShot();
                  }
                }}
              >
                <title>
                  {`${shot.playerName} vs ${shot.opponent}: ${shot.shotResult} ${shot.shotType} from ${shot.shotZone}`}
                </title>
                <circle
                  cx={shot.x}
                  cy={shot.y}
                  r="4.4"
                  fill="transparent"
                  pointerEvents="all"
                  onClick={selectShot}
                />
                {selected ? (
                  <circle
                    cx={shot.x}
                    cy={shot.y}
                    r="3.4"
                    fill="none"
                    stroke={teamTheme.accent}
                    strokeWidth="0.75"
                    strokeDasharray="1.2 0.9"
                    pointerEvents="none"
                  />
                ) : null}
                {made ? (
                  <circle
                    cx={shot.x}
                    cy={shot.y}
                    r={selected ? "2.15" : "1.75"}
                    fill={teamTheme.accent}
                    stroke="#FFFFFF"
                    strokeOpacity="0.9"
                    strokeWidth="0.35"
                    filter="url(#shotGlow)"
                    onClick={selectShot}
                  />
                ) : (
                  <g
                    stroke="#F87171"
                    strokeWidth={selected ? "0.95" : "0.75"}
                    strokeLinecap="round"
                    opacity="0.95"
                    onClick={selectShot}
                  >
                    <circle
                      cx={shot.x}
                      cy={shot.y}
                      r={selected ? "2.15" : "1.85"}
                      fill="#111827"
                      stroke="#F87171"
                      strokeWidth="0.45"
                    />
                    <path d={`M ${shot.x - 1.1} ${shot.y - 1.1} L ${shot.x + 1.1} ${shot.y + 1.1}`} />
                    <path d={`M ${shot.x + 1.1} ${shot.y - 1.1} L ${shot.x - 1.1} ${shot.y + 1.1}`} />
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      <div className="absolute left-5 top-5 flex flex-wrap gap-2 text-[0.65rem] font-black uppercase tracking-[0.18em]">
        <span
          className="rounded-full border bg-black/65 px-3 py-1"
          style={{ borderColor: `${teamTheme.accent}70`, color: teamTheme.accent }}
        >
          Made
        </span>
        <span className="rounded-full border border-red-400/60 bg-black/65 px-3 py-1 text-red-300">
          Missed
        </span>
        <span className="rounded-full border border-white/15 bg-black/65 px-3 py-1 text-slate-300">
          Click a shot
        </span>
      </div>
    </div>
  );
}
