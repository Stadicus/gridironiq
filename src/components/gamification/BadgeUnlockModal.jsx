import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BADGES } from '../../data/gamificationData'
import { playBadge } from '../../utils/sound'

export default function BadgeUnlockModal({ badgeId, onClose }) {
  const badge = BADGES.find(b => b.id === badgeId)
  useEffect(() => { if (badge) playBadge() }, [badge])
  if (!badge) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.5, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 text-center max-w-sm w-full"
        >
          <motion.div
            initial={{ rotate: -20, scale: 0 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
            className="text-7xl mb-4"
          >
            {badge.emoji}
          </motion.div>
          <div className="text-xs font-bold uppercase tracking-widest text-yellow-500 mb-1">Badge Unlocked!</div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">{badge.name}</h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{badge.description}</p>
          <button onClick={onClose} className="btn-primary w-full py-3 text-base">Awesome!</button>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
