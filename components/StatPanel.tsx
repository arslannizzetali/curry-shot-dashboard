import type { CurryZone } from "@/lib/types";

type StatPanelProps = {
  zone: CurryZone;
  assistMode: boolean;
};

export function StatPanel({ zone, assistMode }: StatPanelProps) {
  const efficiency = getEfficiency(zone.fgPct);
  const stats = [
    { label: "Attempts", value: zone.attempts.toLocaleString(), assist: false },
    { label: "Made threes", value: zone.made.toLocaleString(), assist: false },
    { label: "3PT percentage", value: `${zone.fgPct.toFixed(1)}%`, assist: false },
    {
      label: "Assisted made threes",
      value: zone.assistedMade.toLocaleString(),
      assist: true
    },
    { label: "Assist rate", value: `${zone.assistRate.toFixed(1)}%`, assist: true }
  ];

  return (
    <aside className="glass-panel rounded-[2rem] p-5 lg:min-h-[640px]">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-warriors-gold/30 bg-gradient-to-br from-slate-950 via-warriors-navy to-black p-5">
        <div className="absolute right-[-4rem] top-[-4rem] h-36 w-36 rounded-full bg-[#00A3FF]/25 blur-3xl" />
        <div className="absolute bottom-[-4rem] left-[-3rem] h-32 w-32 rounded-full bg-warriors-gold/20 blur-3xl" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.68rem] font-black uppercase tracking-[0.28em] text-warriors-gold">
              Selected Zone
            </p>
            <h2 className="mt-3 text-3xl font-black uppercase leading-none text-white">
              {zone.name}
            </h2>
          </div>
          <span
            className={`rounded-full border px-3 py-1 text-[0.62rem] font-black uppercase tracking-[0.18em] ${efficiency.classes}`}
          >
            {efficiency.label}
          </span>
        </div>

        <p className="relative mt-4 text-sm leading-6 text-slate-300">
          {assistMode
            ? "Assist creation view is active. Assisted makes and assist rate are emphasized in orange."
            : "Shot volume view is active. Green markers show all three-point attempt pressure."}
        </p>
      </div>

      <div className="mt-5 grid gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`group flex items-center justify-between rounded-2xl border px-4 py-4 transition duration-200 hover:-translate-y-0.5 ${
              assistMode && stat.assist
                ? "border-warriors-orange/35 bg-warriors-orange/10 hover:border-warriors-orange/65"
                : "border-white/10 bg-white/[0.055] hover:border-warriors-gold/40 hover:bg-white/[0.085]"
            }`}
          >
            <span className="text-sm font-semibold text-slate-300 transition group-hover:text-white">
              {stat.label}
            </span>
            <span
              className={`text-xl font-black ${
                assistMode && stat.assist
                  ? "text-warriors-orange"
                  : "text-warriors-gold"
              }`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-[0.18em] text-slate-400">
          <span>3PT Efficiency</span>
          <span className={efficiency.textClass}>{zone.fgPct.toFixed(1)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-warriors-gold via-[#00A3FF] to-warriors-green shadow-[0_0_24px_rgba(57,255,136,0.4)]"
            style={{ width: `${Math.min(zone.fgPct, 100)}%` }}
          />
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
          <span>Assist profile</span>
          <span
            className={assistMode ? "text-warriors-orange" : "text-slate-300"}
          >
            {zone.assistRate.toFixed(1)}%
          </span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-slate-900 ring-1 ring-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-warriors-gold to-warriors-orange shadow-[0_0_24px_rgba(249,115,22,0.42)]"
            style={{ width: `${Math.min(zone.assistRate, 100)}%` }}
          />
        </div>
      </div>
    </aside>
  );
}

function getEfficiency(fgPct: number) {
  if (fgPct >= 45) {
    return {
      label: "Legendary",
      classes:
        "border-warriors-gold/45 bg-warriors-gold/15 text-warriors-gold",
      textClass: "text-warriors-gold"
    };
  }

  if (fgPct >= 40) {
    return {
      label: "Elite",
      classes: "border-[#00A3FF]/45 bg-[#00A3FF]/15 text-[#8FD7FF]",
      textClass: "text-[#8FD7FF]"
    };
  }

  if (fgPct >= 35) {
    return {
      label: "Strong",
      classes:
        "border-warriors-green/45 bg-warriors-green/15 text-warriors-green",
      textClass: "text-warriors-green"
    };
  }

  return {
    label: "Average",
    classes: "border-slate-500/45 bg-slate-500/15 text-slate-300",
    textClass: "text-slate-300"
  };
}
