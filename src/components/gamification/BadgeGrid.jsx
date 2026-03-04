import { BADGES } from '../../data/gamificationData'

export default function BadgeGrid({ unlockedBadges = [], compact = false }) {
  const unlocked = new Set(unlockedBadges)

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        {BADGES.filter(b => unlocked.has(b.id)).map(b => (
          <div key={b.id} title={b.name} className="w-10 h-10 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center text-xl border border-yellow-200 dark:border-yellow-800">
            {b.emoji}
          </div>
        ))}
        {unlockedBadges.length === 0 && <span className="text-sm text-slate-400">No badges yet — start quizzing!</span>}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
      {BADGES.map(b => {
        const earned = unlocked.has(b.id)
        return (
          <div key={b.id} className={`flex flex-col items-center gap-1 p-3 rounded-xl text-center transition-all ${
            earned
              ? 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
              : 'bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 opacity-40'
          }`}>
            <span className={`text-2xl ${!earned ? 'grayscale' : ''}`}>{b.emoji}</span>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{b.name}</div>
            {earned && <div className="text-xs text-slate-400 leading-tight hidden sm:block">{b.description}</div>}
          </div>
        )
      })}
    </div>
  )
}
