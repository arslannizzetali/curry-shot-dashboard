#!/usr/bin/env python3
"""Fetch real NBA shot chart data for a player/season via nba_api and write it
in the dashboard's Shot schema (src/types/shot.ts) as JSON.

The player's own team is resolved per-shot from the row's TEAM_ID, so a
mid-season trade doesn't break the opponent calculation and the caller never
has to know which team the player was on during that season.

Usage:
    python3 scripts/fetch_shots.py --player-id 201939 \
        --player-slug stephen-curry --player-name "Stephen Curry" \
        --team-slug warriors --season 2025-26

Output goes to data/shots/<player-slug>_<season>.json
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from nba_api.stats.endpoints import shotchartdetail
from nba_api.stats.static import teams

REPO_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_DIR = REPO_ROOT / "data" / "shots"

TEAM_ABBR_BY_ID = {t["id"]: t["abbreviation"] for t in teams.get_teams()}

# NBA's zone labels collapse into the dashboard's 8-zone model.
ZONE_MAP = {
    "Restricted Area": "Restricted Area",
    "In The Paint (Non-RA)": "Paint",
    "Mid-Range": "Mid-Range",
    "Left Corner 3": "Left Corner 3",
    "Right Corner 3": "Right Corner 3",
}

ABOVE_BREAK_AREA_MAP = {
    "Left Side Center(LC)": "Left Wing",
    "Right Side Center(RC)": "Right Wing",
    "Center(C)": "Top of Key",
    "Left Side(L)": "Left Wing",
    "Right Side(R)": "Right Wing",
}

# Hoop-anchored linear mapping into the dashboard's 0-100 SVG court box.
# Calibrated against the drawn court in src/components/chart/CourtSvg.tsx:
# hoop sits at (50, 86), half-court line at y=5, sidelines at x=5/95.
HOOP_X, HOOP_Y = 50.0, 86.0
X_SCALE = 45.0 / 250.0
Y_SCALE = 81.0 / 470.0


def convert_coords(loc_x: float, loc_y: float) -> tuple[float, float]:
    x = HOOP_X + loc_x * X_SCALE
    y = HOOP_Y - loc_y * Y_SCALE
    x = max(6.0, min(94.0, x))
    y = max(6.0, min(94.0, y))
    return round(x, 1), round(y, 1)


def map_zone(zone_basic: str, zone_area: str) -> str | None:
    if zone_basic in ZONE_MAP:
        return ZONE_MAP[zone_basic]
    if zone_basic == "Above the Break 3":
        return ABOVE_BREAK_AREA_MAP.get(zone_area)
    return None  # e.g. "Backcourt" heaves have no dashboard zone


def fetch_raw_shots(player_id: int, season: str):
    response = shotchartdetail.ShotChartDetail(
        team_id=0,  # 0 = all teams; resolves trades within the season automatically
        player_id=player_id,
        season_type_all_star="Regular Season",
        season_nullable=season,
        context_measure_simple="FGA",
        timeout=60,
    )
    frame = response.get_data_frames()[0]
    return frame.to_dict("records")


def transform(rows, *, player_id_slug: str, player_name: str, team_slug: str, season: str):
    shots = []
    skipped = 0
    for row in rows:
        zone = map_zone(row["SHOT_ZONE_BASIC"], row["SHOT_ZONE_AREA"])
        if zone is None:
            skipped += 1
            continue

        own_abbr = TEAM_ABBR_BY_ID.get(row["TEAM_ID"])
        home_team = row["HTM"]
        visitor_team = row["VTM"]
        opponent = visitor_team if home_team == own_abbr else home_team

        x, y = convert_coords(row["LOC_X"], row["LOC_Y"])

        shots.append({
            "playerId": player_id_slug,
            "playerName": player_name,
            "teamId": team_slug,
            "season": season,
            "opponent": opponent,
            "shotResult": "made" if row["SHOT_MADE_FLAG"] == 1 else "missed",
            "shotZone": zone,
            "shotDistance": int(row["SHOT_DISTANCE"]),
            "x": x,
            "y": y,
            "shotType": row["SHOT_TYPE"],
        })

    return shots, skipped


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--player-id", type=int, required=True, help="NBA Stats PLAYER_ID")
    parser.add_argument("--player-slug", required=True, help="Dashboard PlayerId, e.g. stephen-curry")
    parser.add_argument("--player-name", required=True, help="Display name, e.g. 'Stephen Curry'")
    parser.add_argument("--team-slug", required=True, help="Dashboard TeamId to attach these shots to, e.g. warriors")
    parser.add_argument("--season", required=True, help="e.g. 2025-26")
    args = parser.parse_args()

    print(f"Fetching {args.player_name} ({args.season}) shot chart from NBA Stats...")
    raw_rows = fetch_raw_shots(args.player_id, args.season)
    print(f"  {len(raw_rows)} raw attempts returned")

    shots, skipped = transform(
        raw_rows,
        player_id_slug=args.player_slug,
        player_name=args.player_name,
        team_slug=args.team_slug,
        season=args.season,
    )
    print(f"  {len(shots)} shots converted, {skipped} skipped (no dashboard zone match)")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_path = OUTPUT_DIR / f"{args.player_slug}_{args.season}.json"
    output_path.write_text(json.dumps(shots, indent=2))
    print(f"  wrote {output_path.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    main()
