import { useEffect, useState, useRef } from 'react'

export default function QuizTimer({ seconds, onExpire, active = true }) {
  const [timeLeft, setTimeLeft] = useState(seconds)
  const intervalRef = useRef(null)

  useEffect(() => {
    setTimeLeft(seconds)
  }, [seconds])

  useEffect(() => {
    if (!active) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          onExpire?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [active, onExpire])

  const pct = (timeLeft / seconds) * 100
  const color = pct > 50 ? '#22c55e' : pct > 25 ? '#f59e0b' : '#ef4444'

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
      <span className={`text-sm font-bold w-6 text-right ${timeLeft <= 5 ? 'text-red-500' : 'text-slate-600 dark:text-slate-300'}`}>
        {timeLeft}
      </span>
    </div>
  )
}
