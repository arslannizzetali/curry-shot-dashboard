# CurryShot Dashboard

**Interactive NBA shot-chart dashboard with an AI coaching assistant that turns shooting data into tactical game plans.**

[![CI](https://github.com/arslannizzetali/curry-shot-dashboard/actions/workflows/ci.yml/badge.svg)](https://github.com/arslannizzetali/curry-shot-dashboard/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Claude API](https://img.shields.io/badge/Claude-API-D97757)

🇹🇷 [Türkçe README](README.tr.md)

<!-- TODO(izzet): add a screenshot or short GIF (shot chart + coach panel) to docs/screenshots/ and reference it here. -->
<!-- TODO(izzet): add the live demo URL here and in the GitHub "Website" field, if deployed. -->

## Why this project?

Shot charts show *where* a player scores, but coaches need to know *what to do about it*: which actions to run, how to defend him, how he has played against tonight's opponent. CurryShot combines a filterable shot chart for one featured player per NBA team with an AI assistant that reads the filtered numbers and answers in a coach's vocabulary, always grounded in the data on screen.

<!-- TODO(izzet): say whether this was a personal project, a course project or built for a hackathon/competition, and any result. -->

## Features

- **Team-first selection** — all 30 NBA teams, one featured player each, with team-themed colours
- **Interactive half-court shot chart** — made/missed markers, filters for season, opponent, result, shot type, zone and distance
- **Live metrics** — attempts, FG%, 3P%, average distance, top zone and full zone breakdown
- **Compare Lineups** — two teams' starting fives side by side on a court formation
- **AI Coach** (Claude API):
  - tactical insights for the current filtered view, returned as structured JSON
  - free-form chat, including offensive game plans and defensive coverages
  - opponent matchup breakdown (player's FG% against every opponent, with small samples excluded)
  - opponent scouting brief from the player's full history against one team
- **Works offline** — without an API key, or if the API fails, a local rule-based engine answers instead; a status dot shows which one replied

## Tech stack

| Area | Choice | Why |
| --- | --- | --- |
| App | Next.js 14 (App Router), React 18, TypeScript | One project for UI and the server-side API route that keeps the API key off the client |
| Styling | Tailwind CSS | Fast iteration on a dense dashboard layout |
| Chart | Custom SVG court | Full control over court geometry and markers without a heavy chart library |
| AI | Anthropic Claude via `@anthropic-ai/sdk` | Structured JSON output for insights; Haiku by default for low cost |
| Data pipeline | Python + [`nba_api`](https://github.com/swar/nba_api) | Fetches shot logs and rosters from NBA Stats |
| Quality | Vitest, ESLint, Prettier, GitHub Actions | |

## Architecture

```mermaid
flowchart LR
  subgraph Offline data pipeline
    nba[NBA Stats] -->|nba_api| fetch[scripts/fetch_*.py]
    fetch --> json[data/shots/*.json]
    json -->|stratified sample| gen[scripts/generate_shot_data.py]
    gen --> ts[src/data/shotData.ts]
  end
  ts --> ui[Dashboard UI]
  ui -->|filters| metrics[Metric utils]
  metrics --> ui
  ui -->|filtered context| route[/api/coach]
  route -->|insights / chat / opponent prep| claude[Claude API]
  ui -.->|no key or API error| fallback[Rule-based coach]
```

The browser never sees the API key: it sends the already filtered, aggregated context to `/api/coach`, which builds the prompt and calls Claude. Requests are bounded in size (question length, chat history, context) to keep costs predictable.

## Data

Shot logs for the 2025-26 regular season were fetched from NBA Stats with `nba_api` (`scripts/fetch_shots.py`) for one featured player per team, then stratified-sampled per zone to at most 240 shots per player (`scripts/generate_shot_data.py`) so the chart stays readable while keeping each zone's make/attempt ratio. Starting fives come from `scripts/fetch_starting_five.py`. See [`DATA_NOTES.md`](DATA_NOTES.md) for the schema and refresh steps.

## Getting started

Requirements: Node.js 20+. Python 3 only if you want to refresh the data.

```bash
npm install
cp .env.example .env.local   # optional: add ANTHROPIC_API_KEY for the live AI coach
npm run dev                  # http://localhost:3000
```

`ANTHROPIC_MODEL` is optional and defaults to `claude-haiku-4-5`. Without a key, the dashboard works fully and the coach uses the offline rule engine.

Refreshing data:

```bash
pip install -r scripts/requirements.txt
python3 scripts/fetch_shots.py --player-id 201939 --player-slug stephen-curry \
  --player-name "Stephen Curry" --team-slug warriors --season 2025-26
python3 scripts/generate_shot_data.py
```

## Running tests

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Unit tests cover the metric calculations (FG%, 3P%, zone and opponent breakdowns), the offline coach rules and the API request limits.

## Project structure

```text
app/
  api/coach/route.ts     # Claude endpoint: insights, chat, opponent prep
  page.tsx               # Dashboard page
src/
  components/            # chart, coach, dashboard, lineup, metrics, player
  data/                  # Generated shot data, teams, starting fives, themes
  lib/anthropicClient.ts # SDK client and model config
  utils/coach/           # Context builder, offline rule engine, request limits
  utils/metrics/         # Summary, zone and opponent calculations
data/                    # Raw per-player shot logs and starting fives (JSON)
scripts/                 # Python data pipeline
tests/                   # Vitest unit tests
```

## Known limitations and roadmap

- One featured player per team and one season; the chart uses a sample (≤240 shots) rather than every attempt.
- Matchup analysis reflects the player's own shooting against each team, not the opponent's defensive scheme.
- No authentication or rate limiting on `/api/coach`; add both before a public deployment with a paid API key.
- NBA Stats data is used for a non-commercial portfolio project; check the data terms before any commercial use.
- Next.js 14 has published advisories fixed only in newer major versions; an upgrade is planned.
- Roadmap: player search beyond the featured roster, multi-season trends, schema validation for the data pipeline.

## AI-assisted development

<!-- TODO(izzet): describe which AI tools you used (e.g. Claude Code), at which stages, and what you designed and decided yourself (feature set, coach prompt design, fallback strategy, data pipeline). -->

`.claude/launch.json` is a Claude Code configuration that tells the agent how to start the dev server for previews. `PROJECT_PLAN.md` and `TODO.md` were the planning documents used while building the project.

## License

[MIT](LICENSE)

## Contact

İzzet Ali Arslan — [GitHub](https://github.com/arslannizzetali)
