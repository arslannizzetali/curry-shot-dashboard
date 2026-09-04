import { CourtSvg } from "@/src/components/chart/CourtSvg";
import type { LineupPlayer } from "@/src/types/lineup";
import type { Team, TeamTheme } from "@/src/types/team";
import { COURT_SLOT_POSITIONS } from "@/src/utils/data/courtSlotPositions";

const NAME_SUFFIXES = new Set(["jr", "jr.", "sr", "sr.", "ii", "iii", "iv", "v"]);

function getSurname(fullName: string): string {
  const parts = fullName.split(" ");
  while (parts.length > 1 && NAME_SUFFIXES.has(parts[parts.length - 1].toLowerCase())) {
    parts.pop();
  }
  return parts[parts.length - 1];
}

type CourtFormationProps = {
  team: Team;
  lineup: LineupPlayer[];
  teamTheme: TeamTheme;
  selectedPlayerId: number | null;
  onPlayerSelect: (player: LineupPlayer) => void;
};

export function CourtFormation({
  team,
  lineup,
  teamTheme,
  selectedPlayerId,
  onPlayerSelect
}: CourtFormationProps) {
  return (
    <div className="relative overflow-hidden rounded-lg border border-white/10 bg-black p-3">
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={`${team.name} starting five formation`}
        className="h-[380px] w-full rounded-lg bg-[#06101F] sm:h-[440px]"
      >
        <defs>
          <filter id={`markerGlow-${team.id}`} x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow
              dx="0"
              dy="0"
              floodColor={teamTheme.accent}
              floodOpacity="0.85"
              stdDeviation="1.4"
            />
          </filter>
        </defs>

        <CourtSvg teamTheme={teamTheme} />

        <g>
          {lineup.map((player) => {
            const position = COURT_SLOT_POSITIONS[player.slot];
            const selected = player.playerId === selectedPlayerId;
            const select = () => onPlayerSelect(player);

            return (
              <g
                key={player.playerId}
                role="button"
                tabIndex={0}
                aria-label={`Show stats for ${player.name}`}
                className="cursor-pointer outline-none"
                onClick={select}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    select();
                  }
                }}
              >
                <title>{`${player.name} — ${player.slot}`}</title>
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="9"
                  fill="transparent"
                  pointerEvents="all"
                />
                {selected ? (
                  <circle
                    cx={position.x}
                    cy={position.y}
                    r="6.4"
                    fill="none"
                    stroke={teamTheme.accent}
                    strokeWidth="0.6"
                    strokeDasharray="1.2 0.9"
                  />
                ) : null}
                <circle
                  cx={position.x}
                  cy={position.y}
                  r="5.2"
                  fill={teamTheme.primary}
                  stroke={teamTheme.accent}
                  strokeWidth="0.6"
                  filter={`url(#markerGlow-${team.id})`}
                />
                <text
                  x={position.x}
                  y={position.y + 1.6}
                  textAnchor="middle"
                  fontSize="4.4"
                  fontWeight={800}
                  fill={teamTheme.textOnPrimary}
                >
                  {player.jerseyNumber}
                </text>
                <text
                  x={position.x}
                  y={position.y + 9.5}
                  textAnchor="middle"
                  fontSize="3.1"
                  fontWeight={700}
                  fill="#E2E8F0"
                >
                  {getSurname(player.name)}
                </text>
                <text
                  x={position.x}
                  y={position.y - 7.2}
                  textAnchor="middle"
                  fontSize="2.7"
                  fontWeight={800}
                  fill={teamTheme.accent}
                  letterSpacing="0.05em"
                >
                  {player.slot}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
