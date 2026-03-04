import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '../../hooks/useQuiz'
import { useProgress } from '../../hooks/useProgress'
import { useMap } from '../../hooks/useMap'
import { DIFFICULTY } from '../../utils/difficultyConfig'
import { fetchWikiImage } from '../../utils/imageCache'
import QuizTimer from './QuizTimer'
import AnswerChoices from './AnswerChoices'
import TypeAnswer from './TypeAnswer'
import MapClickQuiz from './MapClickQuiz'
import USMap from '../map/USMap'
import QuizSummary from './QuizSummary'

export default function QuizEngine({ initialMode, initialDifficulty, onExit, onComplete }) {
  const quiz = useQuiz()
  const { submitAnswer: progressSubmit, streak } = useProgress()
  const { position, setPosition, isZoomedNE, toggleNEZoom } = useMap()
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [timerKey, setTimerKey] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const [questionImage, setQuestionImage] = useState(null)
  const [imageLoading, setImageLoading] = useState(false)

  // Start quiz on mount if initialMode provided
  useEffect(() => {
    if (initialMode && quiz.phase === quiz.PHASE.IDLE) {
      quiz.startQuiz(initialMode, initialDifficulty || 'medium')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset timer and selected answer on new question
  useEffect(() => {
    if (quiz.phase === quiz.PHASE.QUESTION) {
      setTimerKey(k => k + 1)
      setTimerActive(true)
      setSelectedAnswer(null)
    }
    if (quiz.phase === quiz.PHASE.ANSWERED) {
      setTimerActive(false)
    }
  }, [quiz.phase, quiz.index])

  // Notify parent on complete
  useEffect(() => {
    if (quiz.phase === quiz.PHASE.COMPLETE) {
      onComplete?.()
    }
  }, [quiz.phase, onComplete])

  // Fetch image for the current question
  useEffect(() => {
    const q = quiz.currentQuestion
    setQuestionImage(null)
    if (!q) return
    if (q.logoUrl) { setQuestionImage(q.logoUrl); return }
    if (q.wikiTitle) {
      setImageLoading(true)
      fetchWikiImage(q.wikiTitle).then(url => {
        setQuestionImage(url)
        setImageLoading(false)
      })
    }
  }, [quiz.index, quiz.currentQuestion])

  const handleAnswer = useCallback((answer) => {
    setSelectedAnswer(answer)
    quiz.submitAnswer(answer, progressSubmit)
    setTimerActive(false)
  }, [quiz, progressSubmit])

  const handleTimerExpire = useCallback(() => {
    if (quiz.phase === quiz.PHASE.QUESTION) {
      handleAnswer('')
    }
  }, [quiz.phase, handleAnswer])

  if (quiz.phase === quiz.PHASE.COMPLETE) {
    return (
      <QuizSummary
        results={quiz.results}
        totalXP={quiz.totalXP}
        mode={quiz.mode}
        difficulty={quiz.difficulty}
        onPlayAgain={() => quiz.startQuiz(quiz.mode, quiz.difficulty)}
        onExit={() => { quiz.exitQuiz(); onExit?.() }}
      />
    )
  }

  const q = quiz.currentQuestion
  const config = DIFFICULTY[quiz.difficulty]
  const answered = quiz.phase === quiz.PHASE.ANSWERED
  const isMapClick = q?.mapClick === true

  return (
    <div className="max-w-xl mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => { quiz.exitQuiz(); onExit?.() }} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm">
          ← Exit
        </button>
        <div className="flex items-center gap-3">
          {streak > 0 && <span className="text-orange-500 font-bold text-sm">🔥 {streak}</span>}
          <span className="text-slate-500 dark:text-slate-400 text-sm">
            {quiz.index + 1}/{quiz.questions.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-300"
          style={{ width: `${((quiz.index + (answered ? 1 : 0)) / quiz.questions.length) * 100}%` }}
        />
      </div>

      {/* Timer */}
      {config.timeLimit && q && (
        <QuizTimer
          key={timerKey}
          seconds={config.timeLimit}
          onExpire={handleTimerExpire}
          active={timerActive}
        />
      )}

      {/* Question */}
      <AnimatePresence mode="wait">
        {q && (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col gap-4"
          >
            {/* Question card */}
            <div className="card overflow-hidden">
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
                {(q.type || '').replace(/([A-Z])/g, ' $1').trim()}
              </div>

              {/* Question image */}
              {q.logoUrl ? (
                <div className="flex justify-center mb-3">
                  <img
                    src={q.logoUrl}
                    alt=""
                    className="h-24 w-24 object-contain"
                    onError={e => { e.target.style.display = 'none' }}
                  />
                </div>
              ) : imageLoading ? (
                <div className="h-40 mb-3 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                  <div className="w-7 h-7 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : questionImage ? (
                <div className="h-40 mb-3 -mx-4 -mt-1">
                  <img
                    src={questionImage}
                    alt=""
                    className="w-full h-full object-cover"
                    onError={() => setQuestionImage(null)}
                  />
                </div>
              ) : null}

              <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {q.question}
              </h2>

              {answered && q.explanation && (
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2">
                  {q.explanation}
                </p>
              )}
            </div>

            {/* Map for "name this state" questions */}
            {q.highlightState && !isMapClick && (
              <div className="relative card overflow-hidden p-0 rounded-2xl">
                <USMap
                  position={position}
                  onPositionChange={setPosition}
                  stateProgress={{}}
                  highlightState={answered ? null : q.highlightState}
                  correctState={answered ? q.correctStateAbbr : null}
                  quizMode={false}
                />
                <button
                  onClick={toggleNEZoom}
                  className="absolute top-2 right-2 text-xs font-semibold px-2 py-1.5 rounded-xl shadow bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                >
                  {isZoomedNE ? '🗺️ Full' : '🔍 NE'}
                </button>
              </div>
            )}

            {/* Answer input */}
            {isMapClick ? (
              <div className="card overflow-hidden p-0 rounded-2xl">
                <MapClickQuiz
                  targetState={q.correctStateAbbr}
                  correctAnswer={q.correctAnswer}
                  onAnswer={handleAnswer}
                  answered={answered}
                />
              </div>
            ) : config.multipleChoice ? (
              <AnswerChoices
                options={q.options || []}
                onAnswer={handleAnswer}
                answered={answered}
                correctAnswer={q.correctAnswer}
                selectedAnswer={selectedAnswer}
              />
            ) : (
              <TypeAnswer
                onAnswer={handleAnswer}
                answered={answered}
                correctAnswer={q.correctAnswer}
                hint={config.hintsEnabled ? q.hint : null}
              />
            )}

            {/* Feedback + Next */}
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <div className={`text-sm font-bold ${quiz.lastAnswerCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {quiz.lastAnswerCorrect
                    ? `✓ Correct! +${quiz.lastXP} XP`
                    : '✗ Not quite — keep going!'}
                </div>
                <button onClick={quiz.nextQuestion} className="btn-primary px-5 py-2">
                  {quiz.index + 1 >= quiz.questions.length ? 'See Results →' : 'Next →'}
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
