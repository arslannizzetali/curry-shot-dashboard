# CurryShot Dashboard

> A local-first Next.js analytics dashboard for exploring NBA player shot
> profiles across the league, with an AI coaching layer on top.

CurryShot lets you pick any of the league's 30 teams and their featured player,
explore their shot profile on an interactive half-court chart with rich
filtering, live summary metrics, compare starting fives across teams, and lean
on an **AI Coach Agent** powered by Claude that turns the numbers into
tactical insights, a live coaching chat, defensive game plans, and opponent
scouting reports.

## Overview

| | |
|---|---|
| **Framework** | Next.js 14 (App Router) + React 18 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Data** | Local, typed shot data for one featured player per NBA team (no external API) |
| **AI** | Anthropic Claude API (`@anthropic-ai/sdk`), with a local rule-based fallback |
| **Status** | Working dashboard with a live AI Coach Agent; data is sample/season data, ready for a real dataset swap-in |

## Features

- **Team-first player selection** — pick any of the 30 NBA teams, then that
  team's featured player, with team-themed dashboard colors
- Responsive half-court shot chart with distinct made/missed markers
- Filters for season, opponent, shot result, shot type, shot zone, and distance
- Live summary metrics: attempts, makes, field goal %, three-point %,
  average shot distance, top shot zone, and full zone breakdown
- **Compare Lineups** mode — pick two teams and compare their starting fives
  side by side on a court formation view
- **AI Coach Agent** (`src/components/coach/CoachAssistantPanel.tsx`), backed
  by `app/api/coach/route.ts`:
  - Auto-generated tactical insights for the current filtered view
  - Free-form tactical chat — ask about zones, threes, weaknesses, a full
    offensive game plan, or how to defend the player. The coach answers with
    real basketball vocabulary (drag screens, Spain pick-and-roll, ICE
    coverage, zipper/floppy actions, matchup hunting) grounded in the actual
    shot data, not generic filler
  - **Opponent matchup breakdown** — the chat has access to the player's
    field-goal % against every opponent faced this season, so it can answer
    "which team is his best/worst matchup" directly, clearly framed as the
    player's own shooting sample against that team (not a claim about the
    opponent's real defensive scheme, which isn't in the data)
  - **Opponent Prep** — a scouting brief built from the player's full
    historical shots against one specific opponent (not the current filters)
  - Live status dot shows whether a reply came from Claude or the offline
    fallback (green = live Claude, red = rule engine)
  - If `ANTHROPIC_API_KEY` is missing, the request fails, or the API is
    rate-limited/offline, the panel automatically falls back to a local
    rule-based engine (`src/utils/coach/generateCoachInsights.ts` and
    `coachAgent.ts`) so the UI keeps working with zero downtime

## Data Notes

Each of the 30 NBA teams has one featured player with a full season of shot
data (`data/shots/<player>_2025-26.json`), aggregated into the shared shot
schema in `src/data/shotData.ts`. Every shot record includes the opponent,
result, type, zone, distance, and court coordinates — this is what powers the
shot chart, the zone/opponent breakdowns, and everything the AI Coach reasons
over.

Starting-five rosters for lineup comparison live in `data/starting_five.json`.

The older aggregate Curry zone dataset remains in `data/curry_three_zones.json`
for reference, but the current dashboard reads from the shared shot schema.

This is season/sample data suitable for local development and demoing the
dashboard end to end. Swap in a live data source (NBA Stats, a stats provider
API, or a maintained public dataset) before using this for real scouting or
publication — see `DATA_NOTES.md` for the expected schema and validation
checks when doing that swap.

## Getting Started

**1. Install dependencies**

```bash
npm install
```

**2. Configure the AI Coach (optional but recommended)**

Copy your Anthropic key into `.env.local` (created automatically if missing):

```text
ANTHROPIC_API_KEY=sk-ant-...
# Optional override. Defaults to claude-haiku-4-5 (cheapest, plenty for this feature).
# Other options: claude-sonnet-5, claude-opus-5
ANTHROPIC_MODEL=claude-haiku-4-5
```

Get a key at [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys).
Without a key the dashboard still runs fine — the AI Coach panel silently
falls back to its local rule-based engine.

**3. Run the local development server**

```bash
npm run dev
```

**4. Open the app**

```text
http://localhost:3000
```

**5. Build for production**

```bash
npm run build
```

## Project Structure

```text
app/
  page.tsx
  layout.tsx
  api/
    coach/
      route.ts        # Claude API endpoint: insights, chat, opponent-prep

data/
  shots/               # Per-player season shot logs (one file per featured player)
  starting_five.json   # Starting fives for Compare Lineups, per team

src/
  components/
    chart/
    coach/             # CoachAssistantPanel, TacticalInsightCard
    dashboard/
    lineup/            # Compare Lineups: TeamSelect, CourtFormation, PlayerStatCard
    metrics/
    player/
  data/
    shotData.ts        # Aggregates data/shots/*.json into the app's Shot[] type
    teamPlayersData.ts # Team + featured player registry
    startingFiveData.ts
    teamThemeConfig.ts
  lib/
    anthropicClient.ts # Anthropic SDK client + COACH_MODEL config
  types/
  utils/
    coach/              # buildCoachContext, generateCoachInsights (fallback),
                         # coachAgent (fallback chat)
    data/
    metrics/            # calculateSummaryMetrics, calculateZoneBreakdown,
                         # calculateOpponentBreakdown
```
