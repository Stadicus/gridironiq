import { useState } from 'react'
import USMap from '../map/USMap'
import { useMap } from '../../hooks/useMap'

export default function MapClickQuiz({ targetState, onAnswer, answered, correctAnswer }) {
  const {
    position, setPosition,
    hoveredState, hoverState, unhoverState,
    isZoomedNE, toggleNEZoom
  } = useMap()

  const [clickedState, setClickedState] = useState(null)

  function handleClick(abbr) {
    if (answered) return
    setClickedState(abbr)
    // The answer check: if clicked correct state, pass the correctAnswer string, otherwise pass the abbr (wrong)
    const isCorrect = abbr === targetState
    onAnswer(isCorrect ? correctAnswer : abbr)
  }

  const isCorrect = answered && clickedState === targetState
  const isWrong   = answered && clickedState !== targetState && clickedState !== null

  return (
    <div className="relative">
      <USMap
        position={position}
        onPositionChange={setPosition}
        stateProgress={{}}
        hoveredState={hoveredState}
        onStateHover={hoverState}
        onStateLeave={unhoverState}
        onStateClick={(abbr) => handleClick(abbr)}
        correctState={answered ? targetState : null}
        wrongState={answered && clickedState !== targetState ? clickedState : null}
        quizMode={!answered}
      />

      <div className="absolute top-3 right-3 flex flex-col gap-2">
        <button
          onClick={toggleNEZoom}
          className="text-xs font-semibold px-3 py-2 rounded-xl shadow-md bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
        >
          {isZoomedNE ? '🗺️ Full Map' : '🔍 Zoom NE'}
        </button>
      </div>

      {answered && (
        <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 rounded-xl px-5 py-2 text-sm font-bold shadow-lg ${
          isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {isCorrect ? '✓ Correct!' : 'Correct state is highlighted in green'}
        </div>
      )}
    </div>
  )
}
