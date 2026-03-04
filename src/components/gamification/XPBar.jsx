import { motion } from 'framer-motion'

export default function XPBar({ xpProgress, compact = false }) {
  if (!xpProgress) return null
  const { current, next, progress, xpInLevel, xpNeededForNext } = xpProgress
  const pct = Math.min(progress * 100, 100)

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs">
        <span className="text-yellow-500 font-bold">{current.emoji} Lv.{current.level}</span>
        <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
          <motion.div
            className="h-full bg-yellow-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6 }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{current.emoji}</span>
          <div>
            <div className="font-bold text-slate-900 dark:text-white">Level {current.level} — {current.title}</div>
            {next && <div className="text-xs text-slate-400">Next: {next.title}</div>}
          </div>
        </div>
        {next && <div className="text-sm text-slate-500 dark:text-slate-400">{xpInLevel}/{xpNeededForNext} XP</div>}
      </div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      {!next && <div className="text-xs text-center text-yellow-500 font-bold mt-1">MAX LEVEL</div>}
    </div>
  )
}
