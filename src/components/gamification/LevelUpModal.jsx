import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { playLevelUp } from '../../utils/sound'

export default function LevelUpModal({ level, onClose }) {
  useEffect(() => { if (level) playLevelUp() }, [level])
  if (!level) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.6, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 350, damping: 22 }}
          className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl shadow-2xl p-10 text-center max-w-sm w-full"
        >
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-7xl mb-4"
          >
            {level.emoji}
          </motion.div>
          <div className="text-sm font-bold uppercase tracking-widest text-yellow-900 mb-1">Level Up!</div>
          <h2 className="text-5xl font-black text-white mb-2">{level.level}</h2>
          <p className="text-xl font-bold text-yellow-900 mb-6">{level.title}</p>
          <button
            onClick={onClose}
            className="bg-white text-orange-600 font-bold rounded-xl px-8 py-3 text-base hover:bg-yellow-50 active:scale-95 transition-all"
          >
            Keep Going!
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
