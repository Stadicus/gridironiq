import { useState } from 'react'
import { motion } from 'framer-motion'
import QuizEngine from './QuizEngine'
import { QUIZ_MODES } from '../../utils/quizGenerator'
import { DIFFICULTY } from '../../utils/difficultyConfig'

const GEO_MODES = Object.values(QUIZ_MODES).filter(m => m.category === 'geography')
const NFL_MODES = Object.values(QUIZ_MODES).filter(m => m.category === 'nfl')


function ModeGrid({ modes, onSelect }) {
  const [activeMode, setActiveMode] = useState(null)

  function handleClick(id) {
    setActiveMode(id)
    onSelect(id)
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {modes.map((qm, i) => (
        <motion.button
          key={qm.id}
          initial={{ opacity: 0, y: 12 }}
          animate={activeMode === qm.id
            ? { opacity: 1, y: 0, boxShadow: ['0 0 0 0px #3b82f6', '0 0 0 6px #3b82f640', '0 0 0 3px #3b82f620', '0 0 0 6px #3b82f640'] }
            : { opacity: 1, y: 0 }
          }
          transition={{ delay: activeMode ? 0 : i * 0.04, duration: 0.35, repeat: activeMode === qm.id ? Infinity : 0 }}
          onClick={() => handleClick(qm.id)}
          className={`card text-left flex items-start gap-3 transition-colors active:scale-95 ${
            activeMode === qm.id
              ? 'border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'hover:border-blue-300'
          }`}
        >
          <span className="text-3xl">{qm.emoji}</span>
          <div>
            <div className="font-semibold text-slate-900 dark:text-white">{qm.label}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{qm.description}</div>
          </div>
        </motion.button>
      ))}
    </div>
  )
}

export default function QuizPage({ onNavigate, initialState, data, category }) {
  const [mode, setMode] = useState(initialState?.mode || null)
  const [difficulty, setDifficulty] = useState(initialState?.difficulty || data?.settings?.difficulty || 'medium')
  const [started, setStarted] = useState(!!initialState?.mode)

  const modes = category === 'nfl' ? NFL_MODES : GEO_MODES
  const heading = category === 'nfl' ? { emoji: '🏈', label: 'NFL Quizzes' } : { emoji: '🌎', label: 'Geography Quizzes' }

  function handleModeSelect(id) {
    setMode(id)
    // Short delay so the blink animation is visible before the quiz renders
    setTimeout(() => setStarted(true), 380)
  }

  if (started && mode) {
    return (
      <QuizEngine
        initialMode={mode}
        initialDifficulty={difficulty}
        onExit={() => { setStarted(false); setMode(null) }}
      />
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

      {/* ── Heading ──────────────────────────────────────────────────────── */}
      <h1 className="text-xl font-bold text-slate-800 dark:text-white">
        {heading.emoji} {heading.label}
      </h1>

      {/* ── Mode grid ────────────────────────────────────────────────────── */}
      <ModeGrid modes={modes} onSelect={handleModeSelect} />

      {/* ── Difficulty ───────────────────────────────────────────────────── */}
      <div className="card">
        <h2 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Difficulty</h2>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(DIFFICULTY).map(([key, diff]) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all text-sm ${
                difficulty === key
                  ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 text-slate-600 dark:text-slate-400'
              }`}
            >
              <span className="text-xl">{diff.emoji}</span>
              <span className="font-semibold">{diff.label}</span>
              <span className="text-xs text-center text-slate-400 dark:text-slate-500">{diff.description}</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-slate-400 dark:text-slate-500 -mt-2">
        Tap a quiz mode above to start instantly
      </p>
    </div>
  )
}
