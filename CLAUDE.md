# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

- **`src/utils/storage.js`** — all persistence. Namespace `usstates:v1`. Exports atomic update functions (`recordAnswer`, `addXP`, `unlockBadge`, etc.). On every write, dispatches a `progressUpdated` CustomEvent so hooks can re-sync.
- **`src/hooks/useProgress.js`** — listens for `progressUpdated`, exposes `submitAnswer()` which chains: calcXP → recordAnswer → addXP → checkNewBadges → level-up detection. This is the only place answers should be submitted.
- **`App.jsx`** calls `useProgress()` once and passes `data` down to every page as a prop. Pages must not call `useProgress()` themselves (causes duplicate hook instances).

### Quiz system

```
QuizPage  →  QuizEngine  →  useQuiz (hook)  ←  quizGenerator.js
```

- **`src/utils/quizGenerator.js`** — the content engine. Exports `QUIZ_MODES` (metadata for all 15 modes) and `generateQuestions(mode, count, difficulty)`. Each question object: `{ id, type, question, correctAnswer, options[], hint, explanation, wikiTitle?, logoUrl?, highlightState?, correctStateAbbr? }`.
- **`src/hooks/useQuiz.js`** — state machine with phases: `QUESTION → ANSWERED → SUMMARY`. Exposes `submitAnswer()`, `nextQuestion()`, `phase`, `score`, etc.
- **`QuizEngine.jsx`** — renders the active question. Detects `q.highlightState` to show the interactive map instead of answer choices (click-the-state mode). Detects `q.logoUrl` / `q.wikiTitle` to fetch and display images via `imageCache.js`.
- **Hard mode** uses `TypeAnswer.jsx` (free-text input); easy/medium use `AnswerChoices.jsx` (multiple choice). Controlled by `difficulty` prop from `difficultyConfig.js`.

### Quiz modes

Modes are split into two categories rendered as tabs in `QuizPage.jsx`:
- **`category: 'geography'`** — stateId, capitals, landmarks, famousPeople, nicknames, statehood, flags, waterways, mixed
- **`category: 'nfl'`** — nfl, nflLogo, nflCity, nflDivision, nflStadium, nflQB

### Map

- **`USMap.jsx`** uses `react-simple-maps` (`ComposableMap` + `ZoomableGroup` + `Geographies` + `Marker`). TopoJSON loaded from jsDelivr CDN. State fill colors come from `getMasteryColor(abbr, stateProgress)`.
- **`useMap.js`** holds viewport state. Two presets: full US (`[-96, 38]` zoom 1) and NE zoom (`[-72.5, 43.5]` zoom 6).
- NFL logo markers use `NFL_COORDS` from `nfl.js` and ESPN CDN (`https://a.espncdn.com/i/teamlogos/nfl/500/{id_lower}.png`). Marker size scales as `18 / position.zoom` to stay visually constant.

### Gamification

- **XP formula** (`gamification.js`): `base(10) × diffMult × streakMult + speedBonus`. Difficulty multipliers: easy=1×, medium=1.5×, hard=2×. Streak adds +5% per streak capped at 50%. Speed bonus up to 10 XP for answers under 5s.
- **Mastery colors**: gray (no attempts), yellow (<50% correct), orange (50–79%), green (≥80%).
- 10 levels, 15 badges defined in `src/data/gamificationData.js`.

### Data files

- **`src/data/states.js`** — 50 states, each with: `abbr, name, capital, region, nickname, statehood, landmarks[], famousPeople[], funFacts[], flagUrl`. Also exports `FIPS_TO_ABBR`, `STATE_BY_ABBR`, `CAPITAL_WIKI`.
- **`src/data/nfl.js`** — `NFL_TEAMS`, `TEAM_BY_ID`, `STARTING_QBS` (2025 season), `NFL_COORDS` (stadium `[lng, lat]`), `TEAMS_BY_STATE`.
- **`src/data/waterways.js`** — 25 rivers/lakes, each with `{ name, type, state, question, fact, wikiTitle }`.

### Images

`src/utils/imageCache.js` fetches Wikipedia thumbnails via `/api/rest_v1/page/summary/{title}` (rewrites to 400px width, 5s timeout, in-memory cache). NFL logos use ESPN CDN directly — no fetch needed.

### Storage schema

Key `gridiron-iq:v1` in localStorage. Top-level keys: `profile`, `streaks`, `quizStats`, `stateProgress`, `badges`, `dailyChallenge`, `settings`. New keys are deep-merged on load, so adding fields to `DEFAULT_DATA` in `storage.js` is safe for existing users.
