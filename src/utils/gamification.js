import { LEVELS, BADGES } from '../data/gamificationData'
import { STATES } from '../data/states'
import { REGIONS } from '../data/states'

export function calcXP({ isCorrect, difficulty, streak, secondsTaken }) {
  if (!isCorrect) return 0
  const base = 10
  const diffMult = { easy: 1, medium: 1.5, hard: 2 }[difficulty] ?? 1
  const streakMult = 1 + Math.min(streak * 0.05, 0.5)
  const speedBonus = secondsTaken != null ? Math.max(0, 10 - Math.floor(secondsTaken)) : 0
  return Math.round(base * diffMult * streakMult + speedBonus)
}

export function getLevelForXP(xp) {
  let current = LEVELS[0]
  for (const lvl of LEVELS) {
    if (xp >= lvl.xpRequired) current = lvl
    else break
  }
  return current
}

export function getNextLevel(currentLevel) {
  return LEVELS.find(l => l.level === currentLevel + 1) || null
}

export function getXPProgress(xp) {
  const current = getLevelForXP(xp)
  const next = getNextLevel(current.level)
  if (!next) return { current, next: null, progress: 1, xpInLevel: 0, xpNeededForNext: 0 }
  const xpInLevel = xp - current.xpRequired
  const xpNeededForNext = next.xpRequired - current.xpRequired
  return { current, next, progress: xpInLevel / xpNeededForNext, xpInLevel, xpNeededForNext }
}

export function checkNewBadges(stats, alreadyUnlocked) {
  // Compute region mastery count
  let regionMastered = 0
  for (const [, states] of Object.entries(REGIONS)) {
    const stateAccuracy = states.map(s => {
      const sp = stats.stateProgress[s.abbr]
      if (!sp || sp.attempts === 0) return 0
      return sp.correct / sp.attempts
    })
    const avgAccuracy = stateAccuracy.reduce((a, b) => a + b, 0) / stateAccuracy.length
    if (avgAccuracy >= 0.8) regionMastered++
  }

  const enrichedStats = { ...stats, _regionMastered: regionMastered }
  return BADGES
    .filter(b => !alreadyUnlocked.includes(b.id))
    .filter(b => {
      try { return b.condition(enrichedStats) } catch { return false }
    })
    .map(b => b.id)
}

export function getMasteryColor(stateAbbr, stateProgress) {
  const sp = stateProgress?.[stateAbbr]
  if (!sp || sp.attempts === 0) return '#cbd5e1'      // gray-300 — not attempted
  const acc = sp.correct / sp.attempts
  if (acc >= 0.8) return '#4ade80'                    // green-400 — mastered
  if (acc >= 0.5) return '#fb923c'                    // orange-400 — intermediate
  return '#fde68a'                                    // yellow-200 — learning
}

export function getMasteryLabel(stateAbbr, stateProgress) {
  const sp = stateProgress?.[stateAbbr]
  if (!sp || sp.attempts === 0) return 'Not started'
  const acc = sp.correct / sp.attempts
  const pct = Math.round(acc * 100)
  if (acc >= 0.8) return `Mastered (${pct}%)`
  if (acc >= 0.5) return `Learning (${pct}%)`
  return `Struggling (${pct}%)`
}

export function getWeakStates(stateProgress, limit = 5) {
  return STATES
    .map(s => {
      const sp = stateProgress?.[s.abbr]
      if (!sp || sp.attempts === 0) return { state: s, score: -1, attempted: false }
      return { state: s, score: sp.correct / sp.attempts, attempted: true }
    })
    .filter(x => x.attempted)
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
}
