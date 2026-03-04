import { useState, useEffect } from 'react'
import { getData, completeDailyChallenge, resetDailyIfNeeded } from '../utils/storage'
import { generateDailyChallenge } from '../utils/quizGenerator'

export function useDailyChallenge() {
  const [dcData, setDcData] = useState(() => {
    resetDailyIfNeeded()
    return getData().dailyChallenge
  })
  const [questions] = useState(() => generateDailyChallenge())

  useEffect(() => {
    const onUpdate = (e) => setDcData(e.detail.dailyChallenge)
    window.addEventListener('progressUpdated', onUpdate)
    return () => window.removeEventListener('progressUpdated', onUpdate)
  }, [])

  const today = new Date().toISOString().split('T')[0]
  const isCompletedToday = dcData.lastDate === today && dcData.completed

  const complete = () => {
    completeDailyChallenge()
  }

  // Build last-30-days calendar
  const calendarDays = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(Date.now() - (29 - i) * 86400000)
    const dateStr = d.toISOString().split('T')[0]
    return {
      dateStr,
      dayNum: d.getDate(),
      dayLabel: d.toLocaleDateString('en-US', { weekday: 'short' })
    }
  })

  return {
    isCompletedToday,
    streak: dcData.streak,
    totalCompleted: dcData.totalCompleted,
    questions,
    complete,
    calendarDays
  }
}
