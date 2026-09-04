# Project Plan

## Goal

Build a usable CurryShot dashboard that makes Stephen Curry shot patterns easy to inspect by location, time period, game context, and shot outcome.

## MVP Scope

- Load a cleaned shot dataset from a local file.
- Render a basketball half-court shot chart.
- Plot makes and misses with distinguishable markers.
- Provide filters for season, shot result, shot zone, distance, and opponent.
- Show top-line metrics that update with filters.
- Keep the UI responsive on desktop and tablet-sized screens.

## Suggested Stack

- Frontend: React or Next.js
- Charts: D3, Plotly, Recharts, or a custom SVG/canvas court renderer
- Data: CSV or JSON for the MVP
- Styling: Tailwind CSS or project-local CSS modules

## Milestones

1. Define the dataset schema and add a small sample dataset.
2. Scaffold the web app and baseline layout.
3. Build the court visualization.
4. Add filtering and derived metrics.
5. Add data loading, validation, and cleaning scripts.
6. Polish responsive layout and empty/loading states.
7. Add tests for data transforms and key UI behavior.

## Acceptance Criteria

- A user can run the dashboard locally from a clean checkout.
- The shot chart renders real shot locations from the dataset.
- Filters update both the chart and summary metrics.
- Data preparation steps are documented and repeatable.
- The app handles missing or empty data without crashing.

## Open Decisions

- Final app framework
- Exact shot data source
- Whether the dashboard should support only Curry or be player-configurable
- Whether data should be static, refreshed manually, or fetched dynamically

