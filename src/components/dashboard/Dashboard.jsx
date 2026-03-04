import { motion } from 'framer-motion'
import { useDailyChallenge } from '../../hooks/useDailyChallenge'
import XPBar from '../gamification/XPBar'
import BadgeGrid from '../gamification/BadgeGrid'
import { getWeakStates, getXPProgress, getLevelForXP } from '../../utils/gamification'
import { STATES } from '../../data/states'

export default function Dashboard({ onNavigate, data }) {
  const xpProgress = getXPProgress(data?.profile?.totalXP || 0)
  const currentLevel = getLevelForXP(data?.profile?.totalXP || 0)
  const { isCompletedToday, streak: dailyStreak } = useDailyChallenge()

  const stateProgress = data?.stateProgress || {}
  const profile = data?.profile || {}
  const badges = data?.badges?.unlocked || []

  const totalAttempted = Object.keys(stateProgress).length
  const totalCorrect = profile.totalCorrect || 0
  const totalQ = profile.totalQuestions || 0
  const accuracy = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0

  const weakStates = getWeakStates(stateProgress, 4)

  const QUIZ_SHORTCUTS = [
    { mode: 'stateId',      label: 'Find States',    emoji: '🗺️' },
    { mode: 'capitals',     label: 'Capitals',       emoji: '🏛️' },
    { mode: 'nfl',          label: 'NFL Teams',      emoji: '🏈' },
    { mode: 'landmarks',    label: 'Landmarks',      emoji: '🗽' },
    { mode: 'famousPeople', label: 'Famous People',  emoji: '⭐' },
    { mode: 'mixed',        label: 'Mixed Quiz',     emoji: '🎲' }
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      {/* XP Bar */}
      <XPBar xpProgress={xpProgress} />

      {/* Daily Challenge CTA */}
      <motion.button
        onClick={() => onNavigate('daily')}
        whileTap={{ scale: 0.98 }}
        className={`flex items-center gap-4 rounded-2xl p-4 text-left transition-all ${
          isCompletedToday
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-blue-700 text-white shadow-lg hover:bg-blue-800'
        }`}
      >
        <span className="text-3xl">{isCompletedToday ? '✅' : '📅'}</span>
        <div className="flex-1">
          <div className={`font-bold ${isCompletedToday ? 'text-green-800 dark:text-green-300' : 'text-white'}`}>
            {isCompletedToday ? 'Daily Challenge Complete!' : "Today's Daily Challenge"}
          </div>
          <div className={`text-sm ${isCompletedToday ? 'text-green-600 dark:text-green-400' : 'text-blue-200'}`}>
            {isCompletedToday
              ? `Day streak: ${dailyStreak} 🔥 — Come back tomorrow!`
              : '10 questions · +50 bonus XP · Build your streak!'}
          </div>
        </div>
        {!isCompletedToday && <span className="text-white text-xl">→</span>}
      </motion.button>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { value: totalAttempted, label: 'States tried', emoji: '🗺️', max: 50 },
          { value: `${accuracy}%`, label: 'Accuracy', emoji: '🎯' },
          { value: badges.length, label: 'Badges', emoji: '🏅', max: 15 }
        ].map(stat => (
          <div key={stat.label} className="card text-center">
            <div className="text-xl mb-0.5">{stat.emoji}</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</div>
            {stat.max && <div className="text-xs text-slate-400">of {stat.max}</div>}
            <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick quiz shortcuts */}
      <div>
        <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-3">Quick Quiz</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {QUIZ_SHORTCUTS.map(qs => (
            <button
              key={qs.mode}
              onClick={() => onNavigate('quiz', { mode: qs.mode })}
              className="card flex flex-col items-center gap-1 py-3 hover:border-blue-300 active:scale-95 transition-all"
            >
              <span className="text-2xl">{qs.emoji}</span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400 text-center leading-tight">{qs.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Weak states */}
      {weakStates.length > 0 && (
        <div className="card">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 mb-3">💪 Practice These States</h2>
          <div className="space-y-2">
            {weakStates.map(({ state, score }) => (
              <div key={state.abbr} className="flex items-center gap-3">
                <button
                  onClick={() => onNavigate('quiz', { mode: 'stateId', region: state.region })}
                  className="flex-1 flex items-center gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg px-2 py-1.5 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 text-sm">
                    {state.abbr}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">{state.name}</div>
                    <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-600 rounded-full mt-1">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: `${score * 100}%` }} />
                    </div>
                  </div>
                  <span className="text-sm text-red-500 font-bold">{Math.round(score * 100)}%</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent badges */}
      {badges.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-slate-700 dark:text-slate-300">Recent Badges</h2>
            <button onClick={() => onNavigate('progress')} className="text-xs text-blue-600 hover:underline">See all →</button>
          </div>
          <BadgeGrid unlockedBadges={badges.slice(-6)} compact />
        </div>
      )}

      <footer className="text-center text-xs text-slate-400 dark:text-slate-600 py-2">
        Vibe coded with ❤️ by{' '}
        <a href="https://stadicus.com" target="_blank" rel="noopener noreferrer"
          className="underline hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
          Stadicus
        </a>
      </footer>
    </div>
  )
}
