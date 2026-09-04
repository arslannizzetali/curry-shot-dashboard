import type { ReactNode } from "react";
import type { TeamTheme } from "@/src/types/team";

type MetricCardProps = {
  label: string;
  value: string | number;
  helper?: ReactNode;
  teamTheme: TeamTheme;
};

export function MetricCard({
  label,
  value,
  helper,
  teamTheme
}: MetricCardProps) {
  return (
    <div
      className="rounded-lg border bg-white/[0.045] p-4"
      style={{ borderColor: `${teamTheme.accent}35` }}
    >
      <div
        className="mb-3 h-1 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${teamTheme.accent}, transparent)`
        }}
      />
      <p className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-white">{value}</p>
      {helper ? <p className="mt-2 text-xs text-slate-400">{helper}</p> : null}
    </div>
  );
}
