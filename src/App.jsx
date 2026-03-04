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
import { getData } from './utils/storage'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [quizState, setQuizState] = useState(null) // { mode, difficulty, region }
  const { data, xpProgress, currentLevel, newBadges, leveledUp, dismissBadge, dismissLevelUp } = useProgress()

  // Apply theme
  useEffect(() => {
    const theme = data.settings?.theme || 'light'
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [data.settings?.theme])

  const navigateTo = (targetPage, state = null) => {
    if (targetPage === 'quiz' && state) setQuizState(state)
    setPage(targetPage)
  }

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={navigateTo} data={data} />
      case 'map':       return <MapPage onNavigate={navigateTo} data={data} />
      case 'quiz':      return <QuizPage onNavigate={navigateTo} initialState={quizState} data={data} />
      case 'daily':     return <DailyPage onNavigate={navigateTo} data={data} />
      case 'progress':  return <ProgressPage onNavigate={navigateTo} data={data} />
      case 'settings':  return <SettingsPage onNavigate={navigateTo} data={data} />
      default:          return <Dashboard onNavigate={navigateTo} data={data} />
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
    </>
  )
}
