# US States Quiz — Setup

## Quick Start

```bash
# 1. Install dependencies (requires Node.js 18+)
npm install

# 2. Start development server
npm run dev

# 3. Open http://localhost:5173
```

## Build for Production

```bash
npm run build
npm run preview   # Preview the build locally
```

## Node.js Not Installed?

Download from https://nodejs.org/ (LTS version recommended)

After installing, restart your terminal and run `npm install`.

## PWA Icons

To enable the "Install App" feature, generate PWA icons:
1. Open https://www.pwabuilder.com/imageGenerator
2. Upload `public/favicon.svg`
3. Download the icon pack
4. Place `icon-192.png` and `icon-512.png` in `public/icons/`

Or run `node generate-icons.js` for instructions.

## Features

- 🗺️ **Interactive US Map** — click states, zoom into NE small states
- 🎯 **6 Quiz Modes** — Find State, Capitals, Landmarks, Famous People, NFL Teams, NFL Stadiums
- 📅 **Daily Challenge** — 5 mixed questions with streak tracking
- 🏆 **Gamification** — XP, 10 levels, 15 badges, streak system
- 📊 **Progress Tracking** — per-state mastery, quiz breakdowns, badge collection
- 🌙 **Dark Mode** — toggle in Settings
- 📱 **Mobile PWA** — installable on iOS/Android
- 💾 **Local Storage** — all progress stored in browser, export/import supported
