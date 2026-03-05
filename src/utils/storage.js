const NS = 'gridiron-iq:v1'

const DEFAULT_DATA = {
  version: 1,
  hasSeenWelcome: false,
  profile: {
    totalXP: 0,
    level: 1,
    totalQuestions: 0,
    totalCorrect: 0,
    fastAnswers: 0,        // answers under 5s
    longestStreak: 0,
    lastPlayedDate: null
  },
  streaks: {
    current: 0,
    longest: 0
  },
  quizStats: {
    findState:  { attempts: 0, correct: 0 },
    nameState:  { attempts: 0, correct: 0 },
    capitals:   { attempts: 0, correct: 0 },
    landmarks:  { attempts: 0, correct: 0 },
    nfl:        { attempts: 0, correct: 0 },
    nflStadium: { attempts: 0, correct: 0 },
    nflLogo:    { attempts: 0, correct: 0 },
    nflDivision: { attempts: 0, correct: 0 },
    nflCity:    { attempts: 0, correct: 0 },
    nflQB:      { attempts: 0, correct: 0 },
    nflMVP:     { attempts: 0, correct: 0 },
    nflMixed:   { attempts: 0, correct: 0 },
    nicknames:  { attempts: 0, correct: 0 },
    flags:      { attempts: 0, correct: 0 },
    waterways:  { attempts: 0, correct: 0 }
  },
  stateProgress: {},   // { "CA": { attempts: 5, correct: 4 } }
  badges: { unlocked: [] },
  dailyChallenge: {
    lastDate: null,
    completed: false,
    streak: 0,
    totalCompleted: 0,
    history: []   // array of 'YYYY-MM-DD' strings for completed days
  },
  settings: {
    difficulty: 'medium',
    soundEnabled: true,
    theme: 'system'
  }
}

function load() {
  try {
    const raw = localStorage.getItem(NS)
    if (!raw) return structuredClone(DEFAULT_DATA)
    const data = JSON.parse(raw)
    // Shallow-merge to handle new keys added in updates
    return deepMerge(structuredClone(DEFAULT_DATA), data)
  } catch {
    return structuredClone(DEFAULT_DATA)
  }
}

function getStorageQuotaPercent() {
  try {
    if (!navigator.storage?.estimate) return null
    // Estimate is async, so just check localStorage size heuristically
    const testKey = 'quota-test'
    const testValue = 'x'.repeat(1024 * 1024) // 1MB
    try {
      localStorage.setItem(testKey, testValue)
      localStorage.removeItem(testKey)
      return null // Quota OK
    } catch {
      return 95 // Quota nearly exceeded
    }
  } catch {
    return null
  }
}

function save(data) {
  try {
    const quotaPercent = getStorageQuotaPercent()
    if (quotaPercent && quotaPercent > 90) {
      console.warn('Storage quota nearly exceeded. Consider pruning old data.')
      window.dispatchEvent(new CustomEvent('storageQuotaWarning', { detail: quotaPercent }))
    }

    localStorage.setItem(NS, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent('progressUpdated', { detail: data }))
  } catch (e) {
    console.error('Storage write failed', e)
    window.dispatchEvent(new CustomEvent('storageQuotaExceeded', { detail: e }))
  }
}

function deepMerge(target, source) {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key]) &&
        target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
      result[key] = deepMerge(target[key], source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}

function update(updater) {
  const data = load()
  const updated = updater(data)
  save(updated)
  return updated
}

// ── Public API ──────────────────────────────────────────────────────────────

export function getData() { return load() }

export { update }

export function recordAnswer({ quizType, isCorrect, stateAbbr, secondsTaken }) {
  return update(data => {
    const d = data.profile
    d.totalQuestions++
    d.lastPlayedDate = new Date().toISOString().split('T')[0]

    if (isCorrect) {
      d.totalCorrect++
      data.streaks.current++
      data.streaks.longest = Math.max(data.streaks.longest, data.streaks.current)
      d.longestStreak = data.streaks.longest
      if (secondsTaken < 5) d.fastAnswers++
    } else {
      data.streaks.current = 0
    }

    // Per quiz-type stats — validate and initialize missing types
    if (quizType) {
      if (!data.quizStats) data.quizStats = {}
      if (!data.quizStats[quizType]) {
        data.quizStats[quizType] = { attempts: 0, correct: 0 }
      }
      data.quizStats[quizType].attempts++
      if (isCorrect) data.quizStats[quizType].correct++
    }

    // Per-state tracking — initialize missing states
    if (stateAbbr) {
      if (!data.stateProgress) data.stateProgress = {}
      if (!data.stateProgress[stateAbbr]) {
        data.stateProgress[stateAbbr] = { attempts: 0, correct: 0 }
      }
      data.stateProgress[stateAbbr].attempts++
      if (isCorrect) data.stateProgress[stateAbbr].correct++
    }

    return data
  })
}

export function addXP(amount) {
  return update(data => {
    data.profile.totalXP += amount
    return data
  })
}

export function setLevel(level) {
  return update(data => {
    data.profile.level = level
    return data
  })
}

export function unlockBadge(badgeId) {
  return update(data => {
    if (!data.badges.unlocked.includes(badgeId)) {
      data.badges.unlocked.push(badgeId)
    }
    return data
  })
}

export function completeDailyChallenge() {
  const today = new Date().toISOString().split('T')[0]
  return update(data => {
    const dc = data.dailyChallenge
    if (dc.lastDate === today) return data   // already completed today
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
    dc.streak = dc.lastDate === yesterday ? dc.streak + 1 : 1
    dc.lastDate = today
    dc.completed = true
    dc.totalCompleted++
    if (!dc.history) dc.history = []
    if (!dc.history.includes(today)) {
      dc.history.push(today)
      // Keep only the last 60 days to avoid unbounded growth
      if (dc.history.length > 60) dc.history = dc.history.slice(-60)
    }
    return data
  })
}

export function resetDailyIfNeeded() {
  const today = new Date().toISOString().split('T')[0]
  return update(data => {
    if (data.dailyChallenge.lastDate !== today) {
      data.dailyChallenge.completed = false
    }
    return data
  })
}

export function saveSettings(settings) {
  return update(data => {
    data.settings = { ...data.settings, ...settings }
    return data
  })
}

export function exportData() {
  return JSON.stringify(load(), null, 2)
}

export function importData(json) {
  try {
    const parsed = JSON.parse(json)
    save(parsed)
    return true
  } catch {
    return false
  }
}

export function markWelcomeSeen() {
  return update(data => {
    data.hasSeenWelcome = true
    return data
  })
}

export function resetAll() {
  localStorage.removeItem(NS)
  save(structuredClone(DEFAULT_DATA))
}
