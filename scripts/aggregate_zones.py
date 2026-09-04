#!/usr/bin/env python3
"""Placeholder aggregator for Curry three-point shot zones."""

ZONE_NAMES = (
    "Left Corner 3",
    "Left Wing",
    "Left Above Break",
    "Center Above Break",
    "Right Above Break",
    "Right Wing",
    "Right Corner 3"
)


def main() -> None:
    # TODO: Replace this placeholder with zone aggregation logic.
    # The future implementation should read raw Curry shot chart data, bucket
    # every three-point attempt into the seven dashboard zones, calculate makes,
    # attempts, 3PT percentage, assisted makes, and assist rate, then write
    # data/curry_three_zones.json for the Next.js dashboard.
    print(
        "Placeholder aggregation script. Later this will aggregate Curry's "
        f"three-point shots into {len(ZONE_NAMES)} zones."
    )


if __name__ == "__main__":
    main()
