# Data Notes

## Current MVP Data

The current dashboard uses a shared local shot schema in `src/data/shotData.ts`.
The rows are suitable for local UI development, filtering, chart rendering, and
metric calculation.

LeBron James data is temporary and must be replaced with real shot data before
production analysis or publication. The LeBron rows are marked in code with this
comment:

```text
temporary mock data for LeBron James
```

The existing `data/curry_three_zones.json` file is an aggregate Curry zone
reference dataset. It is not the active source for the current x/y shot chart.

## Expected Shot Record

Each shot row should include:

- `game_id`
- `game_date`
- `season`
- `opponent`
- `period`
- `minutes_remaining`
- `seconds_remaining`
- `shot_made`
- `shot_type`
- `shot_zone_basic`
- `shot_zone_area`
- `shot_zone_range`
- `shot_distance`
- `loc_x`
- `loc_y`
- `home_or_away`

Optional fields:

- `action_type`
- `game_event_id`
- `team_name`
- `player_id`
- `player_name`
- `score_margin`
- `playoffs`

## Source Options

- Static CSV export for fast MVP development
- NBA stats data through a local collection script
- Public historical datasets, if licensing and completeness are acceptable
- Basketball Reference or Kaggle-style public datasets, after validating terms
  and schema completeness

Before using a source in production or publishing the dashboard, verify the source terms, attribution requirements, schema stability, and refresh limits.

## Cleaning Rules

- Normalize dates to ISO format: `YYYY-MM-DD`.
- Convert `shot_made` to a boolean.
- Keep court coordinates numeric and preserve the original coordinate system.
- Derive display labels separately from raw source values.
- Remove duplicate shots by `game_id` and `game_event_id` when both are available.
- Treat missing coordinates as invalid for the shot chart, but keep the row available for aggregate checks if useful.

## Validation Checks

- Required columns exist.
- Coordinate values are numeric.
- Shot distance is non-negative.
- Makes plus misses equals total attempts after filtering.
- Season and game date values agree.
- Duplicate shot identifiers are reported.
