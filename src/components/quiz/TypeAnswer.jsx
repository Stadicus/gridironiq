import { useState, useRef, useEffect } from 'react'

export default function TypeAnswer({ onAnswer, answered, correctAnswer, hint }) {
  const [value, setValue] = useState('')
  const [showHint, setShowHint] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (!answered) {
      setValue('')
      inputRef.current?.focus()
    }
  }, [answered])

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed) return
    onAnswer(trimmed)
  }

  const isCorrect = answered && value.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
  const isWrong   = answered && !isCorrect

  return (
    <div className="space-y-3">
      <div className={`flex gap-2 rounded-xl overflow-hidden border-2 transition-colors ${
        isCorrect ? 'border-green-500' : isWrong ? 'border-red-500' : 'border-slate-200 dark:border-slate-600 focus-within:border-blue-500'
      }`}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !answered && submit()}
          disabled={answered}
          placeholder="Type your answer…"
          className="flex-1 px-4 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none placeholder-slate-400 text-sm"
        />
        {!answered && (
          <button
            onClick={submit}
            disabled={!value.trim()}
            className="btn-primary rounded-none px-4 disabled:opacity-40"
          >
            Submit
          </button>
        )}
      </div>

      {answered && (
        <div className={`rounded-xl px-4 py-3 text-sm font-medium ${isCorrect ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300' : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'}`}>
          {isCorrect ? '✓ Correct!' : `✗ Correct answer: ${correctAnswer}`}
        </div>
      )}

      {!answered && hint && (
        <div>
          {showHint
            ? <div className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2">💡 {hint}</div>
            : <button onClick={() => setShowHint(true)} className="text-xs text-slate-400 hover:text-blue-600 underline">Show hint</button>
          }
        </div>
      )}
    </div>
  )
}
