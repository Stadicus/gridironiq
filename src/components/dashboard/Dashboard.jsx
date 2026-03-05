import { motion } from 'framer-motion'
import { useDailyChallenge } from '../../hooks/useDailyChallenge'
import XPBar from '../gamification/XPBar'
import BadgeGrid from '../gamification/BadgeGrid'
import { getXPProgress, getLevelForXP } from '../../utils/gamification'

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
