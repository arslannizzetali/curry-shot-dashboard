import type { CoachInsight } from "@/src/utils/coach/coachInsightRules";
import type { TeamTheme } from "@/src/types/team";

type TacticalInsightCardProps = {
  insight: CoachInsight;
  teamTheme: TeamTheme;
};

const toneLabels: Record<CoachInsight["tone"], string> = {
  strength: "Strength",
  warning: "Adjustment",
  player: "Player Fit"
};

export function TacticalInsightCard({ insight, teamTheme }: TacticalInsightCardProps) {
  const accent =
    insight.tone === "warning"
      ? "#F87171"
      : insight.tone === "strength"
        ? teamTheme.accent
        : "#93C5FD";

  return (
    <article
      className="rounded-lg border bg-white/[0.045] p-4"
      style={{ borderColor: `${accent}55` }}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <p
          className="text-[0.62rem] font-black uppercase tracking-[0.18em]"
          style={{ color: accent }}
        >
          {toneLabels[insight.tone]}
        </p>
      </div>
      <h3 className="text-sm font-black text-white">{insight.title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-300">{insight.body}</p>
    </article>
  );
}
