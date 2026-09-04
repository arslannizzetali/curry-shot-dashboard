import { MetricCard } from "@/src/components/metrics/MetricCard";
import type { TeamTheme } from "@/src/types/team";
import type { SummaryMetrics as SummaryMetricsValue } from "@/src/utils/metrics/calculateSummaryMetrics";

type SummaryMetricsProps = {
  metrics: SummaryMetricsValue;
  teamTheme: TeamTheme;
};

export function SummaryMetrics({ metrics, teamTheme }: SummaryMetricsProps) {
  if (metrics.attempts === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/20 bg-black/25 p-5">
        <p className="font-black text-white">No shot data available.</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          Summary metrics will update after matching shots are available.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
        <MetricCard
          label="Attempts"
          value={metrics.attempts}
          teamTheme={teamTheme}
        />
        <MetricCard
          label="Makes"
          value={metrics.makes}
          teamTheme={teamTheme}
        />
        <MetricCard
          label="Field Goal %"
          value={`${metrics.fieldGoalPct.toFixed(1)}%`}
          teamTheme={teamTheme}
        />
        <MetricCard
          label="Three Point %"
          value={`${metrics.threePointPct.toFixed(1)}%`}
          helper={`${metrics.threePointMakes}/${metrics.threePointAttempts} from three`}
          teamTheme={teamTheme}
        />
        <MetricCard
          label="Average Shot Distance"
          value={`${metrics.averageShotDistance.toFixed(1)} ft`}
          teamTheme={teamTheme}
        />
        <MetricCard
          label="Top Shot Zone"
          value={metrics.topShotZone}
          teamTheme={teamTheme}
        />
      </div>

      <div className="rounded-lg border border-white/10 bg-black/25 p-4">
        <p
          className="text-[0.65rem] font-black uppercase tracking-[0.2em]"
          style={{ color: teamTheme.accent }}
        >
          Zone Breakdown
        </p>
        <div className="mt-3 grid gap-2">
          {metrics.zoneBreakdown.map((zone) => (
            <div
              key={zone.zone}
              className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-white">
                  {zone.zone}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  {zone.makes}/{zone.attempts} FG
                </p>
              </div>
              <p className="text-right text-sm font-black text-white">
                {zone.fieldGoalPct.toFixed(1)}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
