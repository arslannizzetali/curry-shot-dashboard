#!/usr/bin/env python3
"""Combine per-player JSON shot files in data/shots/ into src/data/shotData.ts.

Each player's full-season shot log (500-1500+ attempts) is stratified-sampled
down to MAX_SHOTS_PER_PLAYER per zone so the court chart stays readable and
the SVG doesn't render thousands of circles, while keeping each zone's real
make/attempt proportions intact.
"""

from __future__ import annotations

import json
import random
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SHOTS_DIR = REPO_ROOT / "data" / "shots"
OUTPUT_PATH = REPO_ROOT / "src" / "data" / "shotData.ts"
MAX_SHOTS_PER_PLAYER = 240

random.seed(42)


def stratified_sample(shots: list[dict], limit: int) -> list[dict]:
    if len(shots) <= limit:
        return shots

    by_zone = defaultdict(list)
    for shot in shots:
        by_zone[shot["shotZone"]].append(shot)

    total = len(shots)
    sampled = []
    for zone, zone_shots in by_zone.items():
        target = round(limit * len(zone_shots) / total)
        target = max(1, min(target, len(zone_shots)))
        sampled.extend(random.sample(zone_shots, target))

    random.shuffle(sampled)
    return sampled[:limit]


def to_camel_case(slug: str) -> str:
    parts = slug.split("-")
    return parts[0] + "".join(part.capitalize() for part in parts[1:])


def emit_shot_literal(shot: dict) -> str:
    return (
        "  {\n"
        f'    playerId: "{shot["playerId"]}",\n'
        f'    playerName: "{shot["playerName"]}",\n'
        f'    teamId: "{shot["teamId"]}",\n'
        f'    season: "{shot["season"]}",\n'
        f'    opponent: "{shot["opponent"]}",\n'
        f'    shotResult: "{shot["shotResult"]}",\n'
        f'    shotZone: "{shot["shotZone"]}",\n'
        f'    shotDistance: {shot["shotDistance"]},\n'
        f'    x: {shot["x"]},\n'
        f'    y: {shot["y"]},\n'
        f'    shotType: "{shot["shotType"]}"\n'
        "  }"
    )


def main():
    files = sorted(SHOTS_DIR.glob("*.json"))
    if not files:
        raise SystemExit(f"No shot files found in {SHOTS_DIR}")

    lines = ['import type { Shot } from "@/src/types/shot";', ""]
    var_names = []

    for file_path in files:
        player_slug = file_path.stem.rsplit("_", 1)[0]
        shots = json.loads(file_path.read_text())
        sampled = stratified_sample(shots, MAX_SHOTS_PER_PLAYER)
        var_name = to_camel_case(player_slug) + "Shots"
        var_names.append(var_name)

        print(f"{player_slug}: {len(shots)} -> {len(sampled)} shots")

        lines.append(f"const {var_name}: Shot[] = [")
        lines.append(",\n".join(emit_shot_literal(shot) for shot in sampled))
        lines.append("];")
        lines.append("")

    lines.append(f"export const shotData: Shot[] = [{', '.join(f'...{name}' for name in var_names)}];")
    lines.append("")

    OUTPUT_PATH.write_text("\n".join(lines))
    print(f"\nwrote {OUTPUT_PATH.relative_to(REPO_ROOT)} ({len(var_names)} players)")


if __name__ == "__main__":
    main()
