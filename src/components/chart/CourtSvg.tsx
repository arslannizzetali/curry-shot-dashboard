import type { TeamTheme } from "@/src/types/team";

type CourtSvgProps = {
  teamTheme: TeamTheme;
};

export function CourtSvg({ teamTheme }: CourtSvgProps) {
  return (
    <g fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect
        x="5"
        y="5"
        width="90"
        height="90"
        rx="3"
        fill="#07101F"
        stroke={teamTheme.accent}
        strokeOpacity="0.55"
        strokeWidth="0.9"
      />
      <path d="M 5 95 L 95 95" stroke={teamTheme.accent} strokeOpacity="0.8" strokeWidth="1" />
      <path
        d="M 35 95 L 35 69 L 65 69 L 65 95"
        stroke="#E2E8F0"
        strokeOpacity="0.75"
        strokeWidth="0.8"
      />
      <path
        d="M 37 69 A 13 13 0 1 0 63 69"
        stroke="#E2E8F0"
        strokeOpacity="0.65"
        strokeWidth="0.7"
      />
      <path
        d="M 37 69 A 13 13 0 1 1 63 69"
        stroke="#E2E8F0"
        strokeDasharray="1.4 1.4"
        strokeOpacity="0.5"
        strokeWidth="0.7"
      />
      <path d="M 43 85 A 7 7 0 0 0 57 85" stroke="#E2E8F0" strokeOpacity="0.75" strokeWidth="0.8" />
      <path d="M 13 95 L 13 75" stroke={teamTheme.accent} strokeOpacity="0.72" strokeWidth="1" />
      <path d="M 87 95 L 87 75" stroke={teamTheme.accent} strokeOpacity="0.72" strokeWidth="1" />
      <path
        d="M 13 75 C 16 35 84 35 87 75"
        stroke={teamTheme.accent}
        strokeOpacity="0.72"
        strokeWidth="1"
      />
      <path d="M 26 5 A 24 24 0 0 0 74 5" stroke="#E2E8F0" strokeOpacity="0.45" strokeWidth="0.7" />
      <rect x="43" y="84" width="14" height="1.1" rx="0.4" fill="#F8FAFC" />
      <circle cx="50" cy="86" r="1.8" stroke={teamTheme.primary} strokeWidth="1" fill="none" />
    </g>
  );
}
