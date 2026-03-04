import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QuizEngine from './QuizEngine'
import { QUIZ_MODES } from '../../utils/quizGenerator'
import { DIFFICULTY } from '../../utils/difficultyConfig'

const GEO_MODES = Object.values(QUIZ_MODES).filter(m => m.category === 'geography')
const NFL_MODES = Object.values(QUIZ_MODES).filter(m => m.category === 'nfl')

const TABS = [
  { id: 'geography', label: 'Geography', emoji: '🌎', modes: GEO_MODES },
  { id: 'nfl',       label: 'NFL',       emoji: '🏈', modes: NFL_MODES },
]

function ModeGrid({ modes, selectedMode, onSelect }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {modes.map((qm, i) => (
        <motion.button
          key={qm.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.04 }}
          onClick={() => onSelect(qm.id)}
          className={`card text-left flex items-start gap-3 transition-all active:scale-95 ${
            selectedMode === qm.id
              ? 'border-2 border-blue-600 bg-blue-50 dark:bg-blue-900/20'
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

export default function QuizPage({ onNavigate, initialState, data }) {
  const [mode, setMode] = useState(initialState?.mode || null)
  const [difficulty, setDifficulty] = useState(initialState?.difficulty || data?.settings?.difficulty || 'medium')
  const [started, setStarted] = useState(!!initialState?.mode)
  const [activeTab, setActiveTab] = useState(() =>
    QUIZ_MODES[initialState?.mode]?.category === 'nfl' ? 'nfl' : 'geography'
  )

  if (started && mode) {
    return (
      <QuizEngine
        initialMode={mode}
        initialDifficulty={difficulty}
        onExit={() => { setStarted(false); setMode(null) }}
      />
    )
  }

  const currentTab = TABS.find(t => t.id === activeTab)

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">

      {/* ── Tab bar ──────────────────────────────────────────────────────── */}
      <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 gap-1">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setMode(null) }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
            }`}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label} Quizzes</span>
          </button>
        ))}
      </div>

      {/* ── Mode grid for active tab ─────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'nfl' ? 20 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          <ModeGrid
            modes={currentTab.modes}
            selectedMode={mode}
            onSelect={setMode}
          />
        </motion.div>
      </AnimatePresence>

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

      {/* ── Start ────────────────────────────────────────────────────────── */}
      <button
        onClick={() => mode && setStarted(true)}
        disabled={!mode}
        className="btn-primary py-4 text-lg disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {mode ? `Start ${QUIZ_MODES[mode]?.label} →` : 'Select a quiz mode above'}
      </button>
    </div>
  )
}
