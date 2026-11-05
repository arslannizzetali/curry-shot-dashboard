import { TeamPlayerSelector } from "@/src/components/player/TeamPlayerSelector";
import type { Player, PlayerId, Team, TeamId, TeamTheme } from "@/src/types/team";

type PlayerControlPanelProps = {
  selectedTeam: Team;
  selectedPlayer: Player;
  selectedTeamId: TeamId;
  selectedPlayerId: PlayerId;
  onTeamChange: (teamId: TeamId) => void;
  onPlayerChange: (playerId: PlayerId) => void;
  teamTheme: TeamTheme;
};

export function PlayerControlPanel({
  selectedTeam,
  selectedPlayer,
  selectedTeamId,
  selectedPlayerId,
  onTeamChange,
  onPlayerChange,
  teamTheme
}: PlayerControlPanelProps) {
  return (
    <div className="glass-panel rounded-lg p-4">
      <TeamPlayerSelector
        selectedTeamId={selectedTeamId}
        selectedPlayerId={selectedPlayerId}
        onTeamChange={onTeamChange}
        onPlayerChange={onPlayerChange}
        teamTheme={teamTheme}
      />

      <div className="mt-4 grid gap-3">
        <PlayerMeta label="Team" value={selectedTeam.name} />
        <PlayerMeta label="Position" value={selectedPlayer.position} />
        <PlayerMeta label="Archetype" value={selectedPlayer.archetype} />
        <div
          className="rounded-lg border bg-black/30 p-4"
          style={{ borderColor: `${teamTheme.accent}40` }}
        >
          <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400">
            Jersey
          </p>
          <div className="mt-2 flex items-end justify-between gap-3">
            <p className="text-5xl font-black" style={{ color: teamTheme.accent }}>
              {selectedPlayer.jerseyNumber}
            </p>
            <p className="text-right text-xl font-black leading-none text-white">
              {selectedPlayer.firstName}
              <br />
              {selectedPlayer.lastName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayerMeta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] px-4 py-3">
      <p className="text-[0.62rem] font-black uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}
