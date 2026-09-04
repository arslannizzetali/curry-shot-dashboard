import { SummaryMetrics } from "@/src/components/metrics/SummaryMetrics";
import type { Shot } from "@/src/types/shot";
import type { Player, TeamTheme } from "@/src/types/team";
import { calculateSummaryMetrics } from "@/src/utils/metrics/calculateSummaryMetrics";

type SummaryMetricsPanelProps = {
  shots: Shot[];
  selectedPlayer: Player;
  teamTheme: TeamTheme;
};

export function SummaryMetricsPanel({
  shots,
  selectedPlayer,
  teamTheme
}: SummaryMetricsPanelProps) {
  const metrics = calculateSummaryMetrics(shots);

  return (
    <section className="glass-panel rounded-lg p-4">
      <div className="mb-4">
        <p
          className="text-[0.66rem] font-black uppercase tracking-[0.24em]"
          style={{ color: teamTheme.accent }}
        >
          Summary Metrics
        </p>
        <h2 className="mt-1 text-lg font-black text-white">
          {selectedPlayer.name}
        </h2>
      </div>

      <SummaryMetrics metrics={metrics} teamTheme={teamTheme} />
    </section>
  );
}
