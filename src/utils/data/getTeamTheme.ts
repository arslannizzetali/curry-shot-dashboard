import { teamThemeConfig } from "@/src/data/teamThemeConfig";
import type { TeamId, TeamTheme } from "@/src/types/team";

export function getTeamTheme(teamId: TeamId): TeamTheme {
  return teamThemeConfig[teamId] ?? teamThemeConfig.warriors;
}
