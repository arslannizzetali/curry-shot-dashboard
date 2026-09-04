#!/usr/bin/env python3
"""Build a starting-five lineup per team: current (2026-27) roster, ranked by
last season's (2025-26) production, with height and per-game stats attached.

Writes data/starting_five.json: { teamSlug: [ {slot, name, ...}, x5 ] }
"""

from __future__ import annotations

import json
import time
from pathlib import Path

from nba_api.stats.endpoints import commonteamroster, leaguedashplayerstats
from nba_api.stats.static import teams

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = REPO_ROOT / "data" / "starting_five.json"
SEASON_ROSTER = "2026-27"
SEASON_STATS = "2025-26"

TEAM_SLUG_OVERRIDES = {
    "GSW": "warriors", "LAL": "lakers", "LAC": "clippers", "PHI": "sixers",
    "POR": "blazers", "NYK": "knicks", "SAS": "spurs", "NOP": "pelicans",
    "UTA": "jazz", "OKC": "thunder", "WAS": "wizards",
}


def team_slug(full_name: str, abbr: str) -> str:
    if abbr in TEAM_SLUG_OVERRIDES:
        return TEAM_SLUG_OVERRIDES[abbr]
    return full_name.split(" ")[-1].lower()


def height_to_label_and_inches(height: str) -> tuple[str, int]:
    feet, inches = height.split("-")
    total_inches = int(feet) * 12 + int(inches)
    return f"{feet}'{inches}\"", total_inches


def assign_slots(players: list[dict]) -> list[dict]:
    pool = list(players)

    def take(predicate, key, reverse=True):
        candidates = [p for p in pool if predicate(p)] or pool
        chosen = sorted(candidates, key=key, reverse=reverse)[0]
        pool.remove(chosen)
        return chosen

    pg = take(lambda p: "G" in p["position"], key=lambda p: p["assistsPerGame"])
    center = take(lambda p: "C" in p["position"], key=lambda p: p["heightInches"])
    pf = take(lambda p: "F" in p["position"], key=lambda p: p["heightInches"])
    sf = take(lambda p: "F" in p["position"], key=lambda p: p["heightInches"])
    sg = pool[0]

    pg["slot"], sg["slot"], sf["slot"], pf["slot"], center["slot"] = "PG", "SG", "SF", "PF", "C"
    return [pg, sg, sf, pf, center]


def main():
    print(f"Loading {SEASON_STATS} league-wide per-game stats...")
    stats_df = leaguedashplayerstats.LeagueDashPlayerStats(
        season=SEASON_STATS, per_mode_detailed="PerGame", timeout=30
    ).get_data_frames()[0]
    stats_by_id = stats_df.set_index("PLAYER_ID").to_dict("index")

    result = {}
    for team in teams.get_teams():
        slug = team_slug(team["full_name"], team["abbreviation"])
        print(f"=> {team['full_name']} ({slug})")
        roster = commonteamroster.CommonTeamRoster(
            team_id=team["id"], season=SEASON_ROSTER, timeout=30
        ).get_data_frames()[0]

        candidates = []
        for _, row in roster.iterrows():
            pid = row["PLAYER_ID"]
            player_stats = stats_by_id.get(pid)
            if not player_stats or player_stats.get("GP", 0) < 5:
                continue
            height_label, height_inches = height_to_label_and_inches(row["HEIGHT"])
            candidates.append({
                "playerId": int(pid),
                "name": row["PLAYER"],
                "jerseyNumber": str(row["NUM"]),
                "position": row["POSITION"],
                "heightLabel": height_label,
                "heightInches": height_inches,
                "pointsPerGame": round(float(player_stats["PTS"]), 1),
                "reboundsPerGame": round(float(player_stats["REB"]), 1),
                "assistsPerGame": round(float(player_stats["AST"]), 1),
                "fieldGoalPct": round(float(player_stats["FG_PCT"]) * 100, 1),
                "_rank": player_stats["PTS"] + player_stats["REB"] + player_stats["AST"],
            })

        top5 = sorted(candidates, key=lambda p: p["_rank"], reverse=True)[:5]
        if len(top5) < 5:
            print(f"   WARNING: only {len(top5)} eligible players found")
        for p in top5:
            del p["_rank"]

        lineup = assign_slots(top5) if len(top5) == 5 else top5
        result[slug] = lineup
        time.sleep(0.5)

    OUTPUT_PATH.write_text(json.dumps(result, indent=2))
    print(f"\nwrote {OUTPUT_PATH.relative_to(REPO_ROOT)} ({len(result)} teams)")


if __name__ == "__main__":
    main()
