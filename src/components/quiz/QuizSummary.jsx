import { motion } from 'framer-motion'

export default function QuizSummary({ results, totalXP, onPlayAgain, onExit, mode, difficulty }) {
  const correct = results.filter(r => r.isCorrect).length
  const total = results.length
  const pct = Math.round((correct / total) * 100)

  const grade = pct >= 90 ? { label: 'Outstanding!', emoji: '🌟', color: 'text-yellow-500' }
    : pct >= 70 ? { label: 'Great job!', emoji: '🎉', color: 'text-green-600' }
    : pct >= 50 ? { label: 'Good effort!', emoji: '👍', color: 'text-blue-600' }
    : { label: 'Keep practicing!', emoji: '💪', color: 'text-orange-500' }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-lg mx-auto px-4 py-8 flex flex-col gap-6"
    >
      {/* Score card */}
      <div className="card text-center">
        <div className="text-5xl mb-2">{grade.emoji}</div>
        <h2 className={`text-2xl font-bold ${grade.color} mb-1`}>{grade.label}</h2>
        <div className="text-6xl font-black text-slate-900 dark:text-white mt-2">{pct}%</div>
        <div className="text-slate-500 dark:text-slate-400 mt-1">{correct} of {total} correct</div>

        <div className="mt-4 flex justify-center gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-500">+{totalXP}</div>
            <div className="text-xs text-slate-400">XP earned</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">{correct}</div>
            <div className="text-xs text-slate-400">Correct</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-500">{total - correct}</div>
            <div className="text-xs text-slate-400">Wrong</div>
          </div>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="card">
        <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Question Review</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {results.map((r, i) => (
            <div key={i} className={`flex items-start gap-3 text-sm p-2 rounded-lg ${r.isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <span className="text-base leading-none mt-0.5">{r.isCorrect ? '✓' : '✗'}</span>
              <div className="flex-1 min-w-0">
                <div className="text-slate-700 dark:text-slate-300 truncate">{r.question.question}</div>
                {!r.isCorrect && (
                  <div className="text-xs text-red-600 dark:text-red-400">Correct: {r.question.correctAnswer}</div>
                )}
              </div>
              {r.xpGained > 0 && <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold flex-shrink-0">+{r.xpGained}XP</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button onClick={onPlayAgain} className="btn-primary flex-1 py-3">Play Again</button>
        <button onClick={onExit} className="btn-secondary flex-1 py-3">Back to Menu</button>
      </div>
    </motion.div>
  )
}
