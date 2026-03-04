import { useState } from 'react'
import { useDailyChallenge } from '../../hooks/useDailyChallenge'
import QuizEngine from '../quiz/QuizEngine'
import { completeDailyChallenge, addXP } from '../../utils/storage'

const DAILY_BONUS_XP = 50

export default function DailyPage({ onNavigate, data }) {
  const { isCompletedToday, streak, totalCompleted, questions, complete, calendarDays } = useDailyChallenge()
  const [playing, setPlaying] = useState(false)
  const [justCompleted, setJustCompleted] = useState(false)

  function handleComplete() {
    complete()
    addXP(DAILY_BONUS_XP)
    setPlaying(false)
    setJustCompleted(true)
  }

  if (playing) {
    return (
      <QuizEngine
        initialMode="mixed"
        initialDifficulty="medium"
        onExit={() => setPlaying(false)}
        onComplete={handleComplete}
      />
    )
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">📅 Daily Challenge</h1>

      {/* Status card */}
      <div className={`card text-center py-6 ${isCompletedToday || justCompleted ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : ''}`}>
        <div className="text-5xl mb-3">{isCompletedToday || justCompleted ? '✅' : '🎯'}</div>
        {isCompletedToday || justCompleted ? (
          <>
            <h2 className="text-xl font-bold text-green-800 dark:text-green-300">
              {justCompleted ? 'Challenge Complete!' : "Today's Challenge Done!"}
            </h2>
            <p className="text-green-600 dark:text-green-400 mt-1">
              {justCompleted ? `+${DAILY_BONUS_XP} bonus XP earned!` : 'Come back tomorrow for a new challenge.'}
            </p>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Today's Challenge</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-1">10 mixed questions • +{DAILY_BONUS_XP} bonus XP</p>
            <button
              onClick={() => setPlaying(true)}
              className="btn-primary mt-4 px-8 py-3 text-base"
            >
              Start Challenge →
            </button>
          </>
        )}
      </div>

      {/* Streak */}
      <div className="card flex items-center gap-4">
        <div className="text-4xl">🔥</div>
        <div>
          <div className="text-3xl font-black text-orange-500">{streak}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400">Day streak</div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">{totalCompleted}</div>
          <div className="text-xs text-slate-400">Total completed</div>
        </div>
      </div>

      {/* 30-day calendar */}
      <div className="card">
        <h2 className="font-semibold text-slate-700 dark:text-slate-300 mb-3">Last 30 Days</h2>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const today = new Date().toISOString().split('T')[0]
            const isToday = day.dateStr === today
            const history = data?.dailyChallenge?.history || []
            const done = history.includes(day.dateStr) || (isToday && justCompleted)
            return (
              <div
                key={day.dateStr}
                title={day.dateStr}
                className={`aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-all ${
                  done
                    ? 'bg-green-500 text-white'
                    : isToday
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-2 border-blue-400'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                }`}
              >
                {day.dayNum}
              </div>
            )
          })}
        </div>
        <p className="text-xs text-slate-400 mt-2 text-center">Calendar shows today and the past 30 days</p>
      </div>
    </div>
  )
}
