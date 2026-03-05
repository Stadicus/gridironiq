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
    const oldLevel = data.profile.level

    // Batch all storage updates into one consolidated call to reduce I/O
    const final = storage.update(currentData => {
      const d = currentData.profile
      d.totalQuestions++
      d.lastPlayedDate = new Date().toISOString().split('T')[0]

      if (isCorrect) {
        d.totalCorrect++
        currentData.streaks.current++
        currentData.streaks.longest = Math.max(currentData.streaks.longest, currentData.streaks.current)
        d.longestStreak = currentData.streaks.longest
        if (secondsTaken < 5) d.fastAnswers++
      } else {
        currentData.streaks.current = 0
      }

      // Per quiz-type stats
      if (quizType) {
        if (!currentData.quizStats) currentData.quizStats = {}
        if (!currentData.quizStats[quizType]) {
          currentData.quizStats[quizType] = { attempts: 0, correct: 0 }
        }
        currentData.quizStats[quizType].attempts++
        if (isCorrect) currentData.quizStats[quizType].correct++
      }

      // Per-state tracking
      if (stateAbbr) {
        if (!currentData.stateProgress) currentData.stateProgress = {}
        if (!currentData.stateProgress[stateAbbr]) {
          currentData.stateProgress[stateAbbr] = { attempts: 0, correct: 0 }
        }
        currentData.stateProgress[stateAbbr].attempts++
        if (isCorrect) currentData.stateProgress[stateAbbr].correct++
      }

      // Add XP
      if (xpGain > 0) {
        d.totalXP += xpGain
      }

      // Check level up
      const newLevel = getLevelForXP(d.totalXP)
      if (newLevel.level > oldLevel) {
        d.level = newLevel.level
        setLeveledUp(newLevel)
      }

      // Check new badges
      const earnedBadges = checkNewBadges(currentData, currentData.badges.unlocked)
      if (earnedBadges.length > 0) {
        earnedBadges.forEach(id => {
          if (!currentData.badges.unlocked.includes(id)) {
            currentData.badges.unlocked.push(id)
          }
        })
        setNewBadges(prev => [...prev, ...earnedBadges])
      }

      return currentData
    })

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
