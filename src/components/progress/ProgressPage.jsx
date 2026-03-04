import { useProgress } from '../../hooks/useProgress'
import XPBar from '../gamification/XPBar'
import BadgeGrid from '../gamification/BadgeGrid'
import { STATES } from '../../data/states'
import { getMasteryColor } from '../../utils/gamification'
import { QUIZ_MODES } from '../../utils/quizGenerator'

export default function ProgressPage({ onNavigate, data }) {
  const { xpProgress } = useProgress()
  const stateProgress = data?.stateProgress || {}
  const profile = data?.profile || {}
  const badges = data?.badges?.unlocked || []
  const quizStats = data?.quizStats || {}

  const totalQ = profile.totalQuestions || 0
  const totalCorrect = profile.totalCorrect || 0
  const accuracy = totalQ > 0 ? Math.round((totalCorrect / totalQ) * 100) : 0

  const masteredCount = STATES.filter(s => {
    const sp = stateProgress[s.abbr]
    return sp && sp.attempts > 0 && (sp.correct / sp.attempts) >= 0.8
  }).length

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">📊 Your Progress</h1>

      {/* XP & Level */}
      <XPBar xpProgress={xpProgress} />

      {/* Overall stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { v: totalQ,       l: 'Questions', e: '❓' },
          { v: `${accuracy}%`, l: 'Accuracy', e: '🎯' },
          { v: masteredCount, l: 'Mastered', e: '✅', sub: 'of 50' },
          { v: profile.longestStreak || 0, l: 'Best Streak', e: '🔥' }
        ].map(s => (
          <div key={s.l} className="card text-center">
            <div className="text-xl">{s.e}</div>
            <div className="text-2xl font-black text-slate-900 dark:text-white">{s.v}</div>
            {s.sub && <div className="text-xs text-slate-400">{s.sub}</div>}
            <div className="text-xs text-slate-500 dark:text-slate-400">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Quiz type breakdown */}
      <div className="card">
        <h2 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Quiz Breakdown</h2>
        <div className="space-y-3">
          {Object.entries(quizStats).filter(([, s]) => s.attempts > 0).map(([type, s]) => {
            const pct = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0
            const mode = QUIZ_MODES[type]
            return (
              <div key={type}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700 dark:text-slate-300">{mode?.emoji} {mode?.label || type}</span>
                  <span className="text-slate-500 dark:text-slate-400">{s.correct}/{s.attempts} ({pct}%)</span>
                </div>
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            )
          })}
          {Object.values(quizStats).every(s => s.attempts === 0) && (
            <p className="text-slate-400 text-sm">No quizzes completed yet.</p>
          )}
        </div>
      </div>

      {/* 50-state mastery grid */}
      <div className="card">
        <h2 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">State Mastery Map</h2>
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          {STATES.sort((a, b) => a.name.localeCompare(b.name)).map(s => {
            const sp = stateProgress[s.abbr]
            const color = getMasteryColor(s.abbr, stateProgress)
            const acc = sp?.attempts > 0 ? Math.round((sp.correct / sp.attempts) * 100) : null
            return (
              <button
                key={s.abbr}
                onClick={() => onNavigate('map')}
                title={`${s.name}: ${acc !== null ? acc + '%' : 'not started'}`}
                className="aspect-square rounded-lg flex items-center justify-center text-xs font-bold border border-white/30 transition-transform hover:scale-110 active:scale-95"
                style={{ backgroundColor: color }}
              >
                <span className={acc !== null && acc >= 80 ? 'text-white' : 'text-slate-700'}>{s.abbr}</span>
              </button>
            )
          })}
        </div>
        <div className="flex justify-center gap-4 mt-3 text-xs text-slate-400">
          {[['#cbd5e1','Not started'],['#fde68a','<50%'],['#fb923c','50–79%'],['#4ade80','≥80%']].map(([c, l]) => (
            <div key={l} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded" style={{ background: c }} />
              {l}
            </div>
          ))}
        </div>
      </div>

      {/* Badges */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-slate-700 dark:text-slate-300">Badges ({badges.length}/15)</h2>
        </div>
        <BadgeGrid unlockedBadges={badges} />
      </div>
    </div>
  )
}
