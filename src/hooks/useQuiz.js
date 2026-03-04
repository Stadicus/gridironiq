import { useState, useCallback, useRef } from 'react'
import { generateQuestions } from '../utils/quizGenerator'
import { DIFFICULTY } from '../utils/difficultyConfig'

const PHASE = { IDLE: 'idle', QUESTION: 'question', ANSWERED: 'answered', COMPLETE: 'complete' }

export function useQuiz() {
  const [phase, setPhase] = useState(PHASE.IDLE)
  const [mode, setMode] = useState('stateId')
  const [difficulty, setDifficulty] = useState('medium')
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [results, setResults] = useState([])
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(null)
  const [lastXP, setLastXP] = useState(0)
  const startTimeRef = useRef(null)

  const startQuiz = useCallback((selectedMode, selectedDifficulty, regionFilter = null) => {
    const config = DIFFICULTY[selectedDifficulty]
    const qs = generateQuestions(selectedMode, config.questionCount, regionFilter)
    setMode(selectedMode)
    setDifficulty(selectedDifficulty)
    setQuestions(qs)
    setIndex(0)
    setResults([])
    setLastAnswerCorrect(null)
    setLastXP(0)
    setPhase(PHASE.QUESTION)
    startTimeRef.current = Date.now()
  }, [])

  const currentQuestion = questions[index] || null

  const submitAnswer = useCallback((answer, submitAnswerFn) => {
    if (phase !== PHASE.QUESTION || !currentQuestion) return

    const secondsTaken = (Date.now() - (startTimeRef.current || Date.now())) / 1000
    const isCorrect = answer.toLowerCase().trim() === currentQuestion.correctAnswer.toLowerCase().trim()

    const xpGained = submitAnswerFn({
      quizType: currentQuestion.type,
      isCorrect,
      stateAbbr: currentQuestion.correctStateAbbr,
      secondsTaken,
      difficulty
    })

    setLastAnswerCorrect(isCorrect)
    setLastXP(xpGained)
    setResults(prev => [...prev, { question: currentQuestion, answer, isCorrect, secondsTaken, xpGained }])
    setPhase(PHASE.ANSWERED)
    startTimeRef.current = Date.now()
  }, [phase, currentQuestion, difficulty])

  const nextQuestion = useCallback(() => {
    if (index + 1 >= questions.length) {
      setPhase(PHASE.COMPLETE)
    } else {
      setIndex(i => i + 1)
      setPhase(PHASE.QUESTION)
      setLastAnswerCorrect(null)
      startTimeRef.current = Date.now()
    }
  }, [index, questions.length])

  const exitQuiz = useCallback(() => {
    setPhase(PHASE.IDLE)
    setQuestions([])
    setResults([])
    setIndex(0)
  }, [])

  const totalXP = results.reduce((sum, r) => sum + (r.xpGained || 0), 0)
  const correctCount = results.filter(r => r.isCorrect).length

  return {
    phase,
    PHASE,
    mode,
    difficulty,
    questions,
    index,
    currentQuestion,
    results,
    lastAnswerCorrect,
    lastXP,
    totalXP,
    correctCount,
    startQuiz,
    submitAnswer,
    nextQuestion,
    exitQuiz
  }
}
