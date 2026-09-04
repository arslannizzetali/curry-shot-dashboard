import type { CSSProperties, ReactNode } from "react";
import type { Team, TeamTheme } from "@/src/types/team";

type DashboardShellProps = {
  selectedTeam: Team;
  teamTheme: TeamTheme;
  children: ReactNode;
};

export function DashboardShell({
  selectedTeam,
  teamTheme,
  children
}: DashboardShellProps) {
  const shellStyle = {
    "--team-primary": teamTheme.primary,
    "--team-accent": teamTheme.accent
  } as CSSProperties;

  return (
    <main
      className="min-h-screen bg-[#050814] text-white"
      style={shellStyle}
      aria-label={`${selectedTeam.name} shot dashboard`}
    >
      <div className="min-h-screen bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:40px_40px]">
        <div
          className="min-h-screen"
          style={{
            background: `linear-gradient(135deg, ${teamTheme.primary}40 0%, #050814 34%, #0A1020 72%, ${teamTheme.accent}24 100%)`
          }}
        >
          <div className="mx-auto flex w-full max-w-[1500px] flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
