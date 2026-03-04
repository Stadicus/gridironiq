import { useState } from 'react'
import { motion } from 'framer-motion'

export default function AnswerChoices({ options, onAnswer, answered, correctAnswer, selectedAnswer, hint }) {
  const [showHint, setShowHint] = useState(false)
  return (
    <div className="flex flex-col gap-3">
      {!answered && hint && (
        <div>
          {showHint
            ? <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">💡 {hint}</div>
            : <button onClick={() => setShowHint(true)} className="text-xs text-slate-400 hover:text-blue-600 underline">Show hint</button>
          }
        </div>
      )}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((opt, i) => {
        let bg = 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
        let text = 'text-slate-800 dark:text-slate-200'

        if (answered) {
          if (opt === correctAnswer) {
            bg = 'bg-green-500 border-green-500'
            text = 'text-white'
          } else if (opt === selectedAnswer && opt !== correctAnswer) {
            bg = 'bg-red-500 border-red-500'
            text = 'text-white animate-shake'
          } else {
            bg = 'bg-slate-100 dark:bg-slate-700 border-slate-200 dark:border-slate-600 opacity-50'
          }
        }

        return (
          <motion.button
            key={opt}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => !answered && onAnswer(opt)}
            disabled={answered}
            className={`${bg} ${text} border-2 rounded-xl px-4 py-3 text-left font-medium text-sm transition-all duration-150 ${!answered ? 'active:scale-95 cursor-pointer' : 'cursor-default'}`}
          >
            <span className="text-xs text-slate-400 dark:text-slate-500 mr-2">{String.fromCharCode(65 + i)}.</span>
            {opt}
          </motion.button>
        )
      })}
    </div>
    </div>
  )
}
