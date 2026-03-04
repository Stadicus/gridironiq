# Gridiron IQ

A progressive web app for learning US geography and NFL knowledge through interactive quizzes and an explorable map.

**Live app:** https://gridiron.stadicus.com

---

## Features

- **15+ quiz modes** across two categories:
  - *Geography* — state ID, capitals, landmarks, famous people, nicknames, flags, waterways, mixed
  - *NFL* — team logos, cities, divisions, stadiums, QBs, MVP legends, mixed
- **Three difficulty levels** — Explorer (hints, no timer), Traveler (15s timer), Expert (free-text, 15s timer)
- **Interactive US Map** — click any state for details, zoom into the Northeast, toggle NFL team logo markers
- **Daily Challenge** — 5 mixed questions with streak tracking
- **Gamification** — XP, 10 levels, 15 badges, streak multipliers, speed bonuses
- **Progress tracking** — per-state mastery colours, per-quiz-type breakdowns, badge collection
- **Dark mode** and **PWA** — installable on iOS/Android, works offline after first load
- **Local storage** — all progress stays in the browser; export/import supported in Settings

## Tech Stack

React 18 · Vite 5 · Tailwind CSS · Framer Motion · react-simple-maps · Web Audio API (synthesized sounds, no audio files)

## Development

Requires Node.js 18+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build (also validates imports)
npm run preview  # preview production build locally
```

No test suite is configured. `npm run build` catches import errors and type issues via Vite's transform step.

## Data & Attribution

- US state geography data: [us-atlas](https://github.com/topojson/us-atlas) TopoJSON via jsDelivr CDN
- NFL team logos: ESPN CDN (`a.espncdn.com`)
- Famous people / landmark images: Wikipedia REST API
- All quiz content (state facts, NFL rosters, stadium locations) is authored in `src/data/`
