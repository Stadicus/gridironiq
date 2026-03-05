import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuiz } from '../../hooks/useQuiz'
import { useProgress } from '../../hooks/useProgress'
import { useMap } from '../../hooks/useMap'
import { DIFFICULTY } from '../../utils/difficultyConfig'
import { fetchWikiData, cacheImageUrl } from '../../utils/imageCache'
import { playCorrect, playWrong } from '../../utils/sound'
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
  const [questionBio, setQuestionBio] = useState(null)
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

  // Fetch and locally cache image (and bio for famousPeople) for the current question
  useEffect(() => {
    const q = quiz.currentQuestion
    setQuestionImage(null)
    setQuestionBio(null)
    if (!q) return
    if (q.logoUrl) {
      setImageLoading(true)
      cacheImageUrl(q.logoUrl).then(url => {
        setQuestionImage(url)
        setImageLoading(false)
      })
      return
    }
    if (q.wikiTitle) {
      setImageLoading(true)
      fetchWikiData(q.wikiTitle).then(({ imageUrl, bio }) => {
        setQuestionImage(imageUrl)
        if (q.type === 'famousPeople') setQuestionBio(bio)
        setImageLoading(false)
      })
    }
  }, [quiz.index, quiz.currentQuestion])

  const handleAnswer = useCallback((answer) => {
    setSelectedAnswer(answer)
    const isCorrect = quiz.submitAnswer(answer, progressSubmit)
    setTimerActive(false)
    if (isCorrect) playCorrect(); else playWrong()
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
    <>
    <div className="max-w-xl mx-auto px-4 pt-4 pb-20 md:pb-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { quiz.exitQuiz(); onExit?.() }}
          aria-label="Exit quiz"
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm"
        >
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
              {(q.wikiTitle || q.logoUrl) ? (
                /* Portrait layout for all image questions — image left, content right.
                   Responsive: mobile shows full-width stacked, tablet/desktop shows portrait left.
                   Image column uses absolute positioning to fill edge-to-edge. */
                <div className="flex flex-col md:flex-row -mx-4 -mt-4 -mb-4">
                  <div
                    className={`w-full md:w-1/3 md:aspect-square flex-shrink-0 self-start relative overflow-hidden ${q.logoUrl ? 'bg-white dark:bg-slate-900' : 'bg-slate-100 dark:bg-slate-700'}`}
                  >
                    {imageLoading ? (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : questionImage ? (
                      <img
                        src={questionImage}
                        alt=""
                        className={`absolute inset-0 w-full h-full ${q.logoUrl ? 'object-contain p-4' : 'object-cover object-top'}`}
                        onError={() => setQuestionImage(null)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-4xl">🖼️</div>
                    )}
                  </div>
                  <div className="flex-1 px-4 py-3 flex flex-col gap-2 min-w-0">
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                      {(q.type || '').replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <h2 className="text-base font-bold text-slate-900 dark:text-white leading-snug">{q.question}</h2>
                    {answered && q.explanation && (
                      <p className="text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2">{q.explanation}</p>
                    )}
                    {answered && questionBio && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic leading-relaxed">{questionBio}</p>
                    )}
                  </div>
                </div>
              ) : (
                /* No image: flat layout */
                <>
                  <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2">
                    {(q.type || '').replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
                    {q.question}
                  </h2>
                  {/* Skip explanation for stateId — map already shows the answer visually */}
                  {answered && q.explanation && q.type !== 'stateId' && (
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-700 rounded-lg px-3 py-2">
                      {q.explanation}
                    </p>
                  )}
                </>
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
                  aria-label={isZoomedNE ? 'Show full US map' : 'Zoom to Northeast'}
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
                hint={config.hintsEnabled ? q.hint : null}
              />
            ) : (
              <TypeAnswer
                onAnswer={handleAnswer}
                answered={answered}
                correctAnswer={q.correctAnswer}
                hint={config.hintsEnabled ? q.hint : null}
              />
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* Sticky action bar — fixed above bottom nav on mobile, sticky at bottom on desktop */}
    <div className="fixed md:sticky bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 shadow-[0_-2px_8px_rgba(0,0,0,0.06)]">
      <div className="max-w-xl mx-auto px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px)+3.25rem)] md:pb-3 flex items-center gap-3 min-h-[52px]">
        {/* Left: timer while answering, feedback after answered */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {answered ? (
              <motion.div
                key="feedback"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className={`text-sm font-bold truncate ${quiz.lastAnswerCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}
              >
                {quiz.lastAnswerCorrect
                  ? `✓ Correct! +${quiz.lastXP} XP`
                  : '✗ Not quite — keep going!'}
              </motion.div>
            ) : config.timeLimit && q ? (
              <motion.div key="timer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <QuizTimer
                  key={timerKey}
                  seconds={config.timeLimit}
                  onExpire={handleTimerExpire}
                  active={timerActive}
                />
              </motion.div>
            ) : (
              <div key="empty" />
            )}
          </AnimatePresence>
        </div>

        {/* Right: Next / See Results button */}
        <AnimatePresence>
          {answered && (
            <motion.button
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.18 }}
              onClick={quiz.nextQuestion}
              aria-label={quiz.index + 1 >= quiz.questions.length ? 'View quiz results' : 'Go to next question'}
              className="btn-primary px-5 py-2 whitespace-nowrap flex-shrink-0"
            >
              {quiz.index + 1 >= quiz.questions.length ? 'See Results →' : 'Next →'}
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  )
}
