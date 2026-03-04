# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## App

Published at **https://gridiron.stadicus.com**

## Commands

```bash
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Production build (also runs Vite PWA manifest generation)
npm run preview    # Preview production build locally
```

No linter or test suite is configured. Verify changes with `npm run build` — it catches import errors and type issues via Vite's transform step.

## Architecture

Single-page app with manual routing: `App.jsx` holds a `page` state string and renders the active page component via a switch. Navigation is passed down as `onNavigate(page, state?)`. There is no React Router.

### Data flow

```
localStorage  ←→  storage.js  ←→  useProgress (hook)  →  App.jsx  →  page props
```

- **`src/utils/storage.js`** — all persistence. Namespace `gridiron-iq:v1`. Exports atomic update functions (`recordAnswer`, `addXP`, `unlockBadge`, etc.). On every write, dispatches a `progressUpdated` CustomEvent so hooks can re-sync. New keys added to `DEFAULT_DATA` are safe for existing users (deep-merged on load).
- **`src/hooks/useProgress.js`** — listens for `progressUpdated`, exposes `submitAnswer()` which chains: calcXP → recordAnswer → addXP → checkNewBadges → level-up detection. This is the only place answers should be submitted.
- **`App.jsx`** calls `useProgress()` once and passes `data` down to every page as a prop. Pages must not call `useProgress()` themselves (causes duplicate hook instances). When navigating to `'quiz'`, always call `setQuizState(state)` (even with null) so the quiz page resets correctly — `navigateTo('quiz')` without a state shows the overview.

### Quiz system

```
QuizPage  →  QuizEngine  →  useQuiz (hook)  ←  quizGenerator.js
```

- **`src/utils/quizGenerator.js`** — the content engine. Exports `QUIZ_MODES` (metadata object) and `generateQuestions(mode, count)`. Each question object: `{ id, type, question, correctAnswer, options[], hint, explanation, wikiTitle?, logoUrl?, highlightState?, correctStateAbbr?, mapClick? }`.
- **`src/hooks/useQuiz.js`** — state machine: `IDLE → QUESTION → ANSWERED → COMPLETE`. `submitAnswer()` returns `isCorrect` (boolean) synchronously for use by callers like sound effects.
- **`QuizEngine.jsx`** — renders the active question. Image questions use a portrait layout: `w-1/3 aspect-square` column on the left, content on the right. `q.mapClick` triggers `MapClickQuiz`; `q.highlightState` shows the map with a highlighted state; `q.logoUrl`/`q.wikiTitle` triggers image fetch. stateId questions suppress the explanation text to avoid layout jump.

### Quiz modes

Two tab categories in `QuizPage.jsx`:
- **`geography`** — stateId, capitals, landmarks, famousPeople, nicknames, flags, waterways, mixed
- **`nfl`** — nflLogo, nfl, nflCity, nflDivision, nflStadium, nflQB, nflMVP, nflMixed

`mixed` draws only from geography generators. `nflMixed` draws from all NFL generators.

### Images

**`src/utils/imageCache.js`** — two-level cache:
1. `fetchWikiData(title)` — fetches `/api/rest_v1/page/summary/{title}`, caches metadata in `wikiCache`. Returns `{ imageUrl, bio }` where `bio` is the first two sentences of the Wikipedia extract.
2. `cacheImageUrl(url)` — fetches any image URL as a blob, stores as `blob://` URL in `blobCache`. Used for both wiki thumbnails and ESPN logo URLs. Both caches are in-memory per session.

Landmark `wikiTitle` values are used **without any name cleaning** (unlike `famousPeople` which runs `cleanPersonName`). Parenthetical suffixes in landmark names will break the Wikipedia lookup — always use exact Wikipedia article titles.

### Sound

**`src/utils/sound.js`** — Web Audio API synthesized sounds, no audio files. `getCtx()` lazily creates `AudioContext`. `tone()` plays a single oscillator with attack/decay envelope. `glideTone()` adds frequency ramping (used for the wrong-answer "bwomp"). Respects `soundEnabled` from localStorage. Exports: `playCorrect`, `playWrong`, `playLevelUp`, `playBadge`.

### Map

- **`USMap.jsx`** uses `react-simple-maps` (`ComposableMap` + `ZoomableGroup` + `Geographies` + `Marker`). TopoJSON from jsDelivr CDN. State fill colors from `getMasteryColor(abbr, stateProgress)`.
- **`useMap.js`** holds viewport state. Two presets: full US (`[-96, 38]` zoom 1) and NE zoom (`[-72.5, 43.5]` zoom 6).
- NFL logo markers use `NFL_COORDS` from `nfl.js` and ESPN CDN. A force-directed `spreadMarkers()` algorithm (precomputed at module load) prevents logo overlap. Desktop logos stay fixed screen size regardless of zoom; mobile logos scale with zoom.
- On the Map page, hovering a state shows a cursor-following name tooltip (only when NFL logos are hidden). Clicking opens a full state info modal.

### Gamification

- **XP formula** (`gamification.js`): `base(10) × diffMult × streakMult + speedBonus`. Difficulty multipliers: easy=1×, medium=1.5×, hard=2×. Streak adds +5% per streak capped at 50%. Speed bonus up to 10 XP for answers under 5s.
- **Mastery colors**: gray (no attempts), yellow (<50% correct), orange (50–79%), green (≥80%).
- 10 levels, 15 badges defined in `src/data/gamificationData.js`.

### Data files

- **`src/data/states.js`** — 50 states with `abbr, name, capital, region, nickname, admitted, landmarks[], famousPeople[], funFacts[]`. Also exports `FIPS_TO_ABBR`, `STATE_BY_ABBR`, `CAPITAL_WIKI` (Wikipedia article titles for each capitol building).
- **`src/data/nfl.js`** — `NFL_TEAMS`, `TEAM_BY_ID`, `STARTING_QBS` (2025 season), `NFL_COORDS` (stadium `[lng, lat]`), `TEAMS_BY_STATE`, `NFL_LEGENDS` (38 players with `{ name, teamId, wikiTitle }` for the Legends & Stars quiz).
- **`src/data/waterways.js`** — 25 rivers/lakes with `{ name, type, state, question, fact, wikiTitle }`.
