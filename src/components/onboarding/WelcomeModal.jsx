import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { markWelcomeSeen } from '../../utils/storage'

const PAGES = [
  {
    emoji: '🏈',
    title: 'Welcome to Gridiron IQ',
    body: 'The ultimate quiz app for US geography and NFL knowledge. Test yourself, earn XP, and master all 50 states!',
    bg: 'from-blue-700 to-blue-900',
    highlights: [
      { icon: '🗺️', label: '50 US States' },
      { icon: '🏟️', label: '32 NFL Teams' },
      { icon: '📅', label: 'Daily Challenges' },
    ],
  },
  {
    emoji: '🎯',
    title: 'Quiz Your Way',
    body: 'Choose from two categories with multiple modes. Pick your difficulty — Explorer, Traveler, or Expert.',
    bg: 'from-emerald-600 to-teal-800',
    highlights: [
      { icon: '🌎', label: 'Capitals & Flags' },
      { icon: '🏔️', label: 'Landmarks & Rivers' },
      { icon: '🏈', label: 'NFL Teams & Logos' },
    ],
  },
  {
    emoji: '🏆',
    title: 'Level Up & Earn Badges',
    body: 'Every correct answer earns XP. Build streaks, unlock 15 unique badges, and climb through 10 levels!',
    bg: 'from-yellow-500 to-orange-600',
    highlights: [
      { icon: '⚡', label: 'Earn XP' },
      { icon: '🎖️', label: 'Unlock Badges' },
      { icon: '🔥', label: 'Daily Streaks' },
    ],
  },
]

export default function WelcomeModal({ onClose }) {
  const [page, setPage] = useState(0)
  const [dir, setDir] = useState(1)
  const isLast = page === PAGES.length - 1
  const current = PAGES[page]

  const go = (next) => {
    setDir(next > page ? 1 : -1)
    setPage(next)
  }

  const finish = () => {
    markWelcomeSeen()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="w-full sm:max-w-sm bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Gradient header */}
        <div className={`bg-gradient-to-br ${current.bg} px-6 pt-8 pb-10 text-center relative overflow-hidden`}>
          <motion.div
            key={`emoji-${page}`}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 20 }}
            className="text-6xl mb-3"
          >
            {current.emoji}
          </motion.div>
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={`title-${page}`}
              custom={dir}
              variants={{
                enter: d => ({ x: d * 40, opacity: 0 }),
                center: { x: 0, opacity: 1 },
                exit: d => ({ x: d * -40, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.22 }}
            >
              <h2 className="text-2xl font-black text-white leading-tight">{current.title}</h2>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Body */}
        <div className="px-6 pb-6 -mt-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md p-4 mb-4">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={`body-${page}`}
                custom={dir}
                variants={{
                  enter: d => ({ x: d * 30, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: d => ({ x: d * -30, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.22 }}
              >
                <p className="text-slate-600 dark:text-slate-300 text-sm text-center mb-4 leading-relaxed">
                  {current.body}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {current.highlights.map(h => (
                    <div key={h.label} className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-700 rounded-xl py-2 px-1">
                      <span className="text-xl">{h.icon}</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 text-center leading-tight">{h.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mb-4">
            {PAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === page
                    ? 'w-6 bg-blue-600'
                    : 'w-2 bg-slate-300 dark:bg-slate-600'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            {page > 0 && (
              <button
                onClick={() => go(page - 1)}
                className="btn-secondary flex-1"
              >
                Back
              </button>
            )}
            {isLast ? (
              <button onClick={finish} className="btn-primary flex-1">
                Let's Play! 🚀
              </button>
            ) : (
              <button onClick={() => go(page + 1)} className="btn-primary flex-1">
                Next →
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
