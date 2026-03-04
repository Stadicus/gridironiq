import { useState, useEffect, useCallback } from 'react'
import * as storage from '../utils/storage'
import { getLevelForXP, getXPProgress, checkNewBadges, calcXP } from '../utils/gamification'
import { LEVELS } from '../data/gamificationData'
import { addXP, setLevel, unlockBadge, recordAnswer } from '../utils/storage'

export function useProgress() {
  const [data, setData] = useState(() => {
    storage.resetDailyIfNeeded()
    return storage.getData()
  })
  const [newBadges, setNewBadges] = useState([])
  const [leveledUp, setLeveledUp] = useState(null)

  useEffect(() => {
    const onUpdate = (e) => setData(e.detail)
    window.addEventListener('progressUpdated', onUpdate)
    return () => window.removeEventListener('progressUpdated', onUpdate)
  }, [])

  const submitAnswer = useCallback(({ quizType, isCorrect, stateAbbr, secondsTaken, difficulty }) => {
    const xpGain = calcXP({ isCorrect, difficulty, streak: data.streaks.current, secondsTaken })

    // Record answer
    recordAnswer({ quizType, isCorrect, stateAbbr, secondsTaken })

    if (xpGain > 0) {
      const updated = addXP(xpGain)
      const fresh = storage.getData()

      // Check level up
      const oldLevel = data.profile.level
      const newLevel = getLevelForXP(fresh.profile.totalXP)
      if (newLevel.level > oldLevel) {
        setLevel(newLevel.level)
        setLeveledUp(newLevel)
      }

      // Check new badges
      const earnedBadges = checkNewBadges(fresh, fresh.badges.unlocked)
      if (earnedBadges.length > 0) {
        earnedBadges.forEach(id => unlockBadge(id))
        setNewBadges(prev => [...prev, ...earnedBadges])
      }
    }

    return xpGain
  }, [data])

  const dismissBadge = useCallback((badgeId) => {
    setNewBadges(prev => prev.filter(id => id !== badgeId))
  }, [])

  const dismissLevelUp = useCallback(() => setLeveledUp(null), [])

  const xpProgress = getXPProgress(data.profile.totalXP)

  return {
    data,
    xpProgress,
    currentLevel: getLevelForXP(data.profile.totalXP),
    streak: data.streaks.current,
    newBadges,
    leveledUp,
    submitAnswer,
    dismissBadge,
    dismissLevelUp
  }
}
