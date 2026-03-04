import { useState, useEffect } from 'react'
import AppShell from './components/layout/AppShell'
import Dashboard from './components/dashboard/Dashboard'
import MapPage from './components/map/MapPage'
import QuizPage from './components/quiz/QuizPage'
import DailyPage from './components/dashboard/DailyPage'
import ProgressPage from './components/progress/ProgressPage'
import SettingsPage from './components/settings/SettingsPage'
import { useProgress } from './hooks/useProgress'
import BadgeUnlockModal from './components/gamification/BadgeUnlockModal'
import LevelUpModal from './components/gamification/LevelUpModal'
import SplashScreen from './components/onboarding/SplashScreen'
import WelcomeModal from './components/onboarding/WelcomeModal'
import { getData } from './utils/storage'
import { QUIZ_MODES } from './utils/quizGenerator'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [quizState, setQuizState] = useState(null) // { mode, difficulty, region }
  const [splashDone, setSplashDone] = useState(false)
  const [showWelcome, setShowWelcome] = useState(false)
  const { data, xpProgress, currentLevel, newBadges, leveledUp, dismissBadge, dismissLevelUp } = useProgress()

  // Show welcome modal after splash if first time
  const handleSplashDone = () => {
    setSplashDone(true)
    if (!getData().hasSeenWelcome) setShowWelcome(true)
  }

  // Apply theme
  useEffect(() => {
    const theme = data.settings?.theme || 'system'
    if (theme === 'system') {
      const mql = window.matchMedia('(prefers-color-scheme: dark)')
      document.documentElement.classList.toggle('dark', mql.matches)
      const handler = e => document.documentElement.classList.toggle('dark', e.matches)
      mql.addEventListener('change', handler)
      return () => mql.removeEventListener('change', handler)
    } else {
      document.documentElement.classList.toggle('dark', theme === 'dark')
    }
  }, [data.settings?.theme])

  const navigateTo = (targetPage, state = null) => {
    let resolved = targetPage
    // Resolve legacy 'quiz' deep-links to the right category page
    if (targetPage === 'quiz') {
      const category = state?.mode ? QUIZ_MODES[state.mode]?.category : null
      resolved = category === 'nfl' ? 'nfl' : 'geography'
    }
    if (resolved === 'geography' || resolved === 'nfl') setQuizState(state)
    setPage(resolved)
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard':  return <Dashboard onNavigate={navigateTo} data={data} />
      case 'map':        return <MapPage onNavigate={navigateTo} data={data} />
      case 'geography':  return <QuizPage category="geography" onNavigate={navigateTo} initialState={quizState} data={data} />
      case 'nfl':        return <QuizPage category="nfl" onNavigate={navigateTo} initialState={quizState} data={data} />
      case 'daily':      return <DailyPage onNavigate={navigateTo} data={data} />
      case 'progress':   return <ProgressPage onNavigate={navigateTo} data={data} />
      case 'settings':   return <SettingsPage onNavigate={navigateTo} data={data} />
      default:           return <Dashboard onNavigate={navigateTo} data={data} />
    }
  }

  return (
    <>
      <AppShell currentPage={page} onNavigate={navigateTo} xpProgress={xpProgress} currentLevel={currentLevel} streak={data.streaks?.current}>
        {renderPage()}
      </AppShell>

      {/* Global overlays */}
      {leveledUp && (
        <LevelUpModal level={leveledUp} onClose={dismissLevelUp} />
      )}
      {newBadges.length > 0 && (
        <BadgeUnlockModal badgeId={newBadges[0]} onClose={() => dismissBadge(newBadges[0])} />
      )}

      <SplashScreen onDone={handleSplashDone} />
      {splashDone && showWelcome && (
        <WelcomeModal onClose={() => setShowWelcome(false)} />
      )}
    </>
  )
}
