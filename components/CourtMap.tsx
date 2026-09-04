import { ZoneArrow } from "@/components/ZoneArrow";
import type { CurryZone } from "@/lib/types";

type CourtMapProps = {
  zones: CurryZone[];
  selectedZoneId: string;
  assistMode: boolean;
  onSelectZone: (zone: CurryZone) => void;
};

export function CourtMap({
  zones,
  selectedZoneId,
  assistMode,
  onSelectZone
}: CourtMapProps) {
  const maxAttempts = Math.max(...zones.map((zone) => zone.attempts), 1);

  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-warriors-gold/20 bg-black p-3 shadow-glow">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_15%,rgba(0,163,255,0.22),transparent_32%),radial-gradient(circle_at_50%_88%,rgba(253,185,39,0.16),transparent_34%)]" />
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label="Stephen Curry three-point half-court zone map"
        className="relative h-[480px] w-full max-w-full rounded-[1.35rem] bg-[#06101f] shadow-inner sm:h-[560px] lg:h-[640px]"
      >
        <defs>
          <linearGradient id="courtSurface" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="#0B1728" />
            <stop offset="52%" stopColor="#07101E" />
            <stop offset="100%" stopColor="#030712" />
          </linearGradient>
          <radialGradient id="paintGlow" cx="50%" cy="78%" r="48%">
            <stop offset="0%" stopColor="#FDB927" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#FDB927" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="courtEdge" x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="#00A3FF" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#FDB927" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#00A3FF" stopOpacity="0.28" />
          </linearGradient>
          <marker
            id="all-arrowhead"
            markerHeight="5"
            markerUnits="strokeWidth"
            markerWidth="5"
            orient="auto"
            refX="5"
            refY="2.5"
            viewBox="0 0 5 5"
          >
            <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#39FF88" />
          </marker>
          <marker
            id="assist-arrowhead"
            markerHeight="5"
            markerUnits="strokeWidth"
            markerWidth="5"
            orient="auto"
            refX="5"
            refY="2.5"
            viewBox="0 0 5 5"
          >
            <path d="M 0 0 L 5 2.5 L 0 5 z" fill="#FF8A22" />
          </marker>
          <filter id="courtGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow
              dx="0"
              dy="0"
              floodColor="#FDB927"
              floodOpacity="0.42"
              stdDeviation="1.2"
            />
          </filter>
          <filter id="allGlow" x="-45%" y="-45%" width="190%" height="190%">
            <feDropShadow
              dx="0"
              dy="0"
              floodColor="#39FF88"
              floodOpacity="0.95"
              stdDeviation="2.6"
            />
          </filter>
          <filter id="assistGlow" x="-45%" y="-45%" width="190%" height="190%">
            <feDropShadow
              dx="0"
              dy="0"
              floodColor="#FF8A22"
              floodOpacity="0.95"
              stdDeviation="2.6"
            />
          </filter>
        </defs>

        <rect x="4" y="4" width="92" height="92" rx="4" fill="url(#courtSurface)" />
        <rect x="6" y="6" width="88" height="90" rx="3" fill="url(#paintGlow)" />
        <path
          d="M 8 8 L 92 8 L 92 94 L 8 94 Z"
          fill="none"
          stroke="url(#courtEdge)"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />

        <g
          fill="none"
          stroke="#FDB927"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeOpacity="0.92"
          filter="url(#courtGlow)"
        >
          <path d="M 8 94 L 92 94" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M 8 8 L 92 8" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <path d="M 8 8 L 8 94" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <path d="M 92 8 L 92 94" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <path d="M 36 94 L 36 70 L 64 70 L 64 94" strokeWidth="0.9" vectorEffect="non-scaling-stroke" />
          <path d="M 50 70 m -13 0 a 13 13 0 1 0 26 0 a 13 13 0 1 0 -26 0" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <path d="M 43 85 A 7 7 0 0 0 57 85" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
          <path d="M 13 94 L 13 75" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
          <path d="M 87 94 L 87 75" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
          <path d="M 13 75 C 16 33 84 33 87 75" strokeWidth="1.1" vectorEffect="non-scaling-stroke" />
          <path d="M 26 8 A 24 24 0 0 0 74 8" strokeWidth="0.8" vectorEffect="non-scaling-stroke" />
        </g>

        <g filter="url(#courtGlow)">
          <rect
            x="42.8"
            y="83.3"
            width="14.4"
            height="1"
            rx="0.5"
            fill="#F8FAFC"
          />
          <circle
            cx="50"
            cy="85.6"
            r="1.75"
            fill="none"
            stroke="#FF8A22"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
          <line
            x1="50"
            y1="84.3"
            x2="50"
            y2="86.8"
            stroke="#FF8A22"
            strokeOpacity="0.65"
            strokeWidth="0.7"
            vectorEffect="non-scaling-stroke"
          />
        </g>

        <g>
          {zones.map((zone) => (
            <ZoneArrow
              key={zone.id}
              zone={zone}
              maxAttempts={maxAttempts}
              selected={zone.id === selectedZoneId}
              assistMode={assistMode}
              onSelect={onSelectZone}
            />
          ))}
        </g>
      </svg>

      <div className="pointer-events-none absolute left-5 top-5 rounded-2xl border border-warriors-gold/25 bg-black/65 px-4 py-3 text-[0.64rem] font-black uppercase tracking-[0.22em] text-warriors-gold shadow-panel backdrop-blur">
        Interactive Half-Court
      </div>
      <div className="pointer-events-none absolute bottom-5 right-5 rounded-2xl border border-white/10 bg-black/65 px-4 py-3 text-[0.64rem] font-black uppercase tracking-[0.22em] text-slate-300 shadow-panel backdrop-blur">
        Click arrows or dots
      </div>
    </div>
  );
}
