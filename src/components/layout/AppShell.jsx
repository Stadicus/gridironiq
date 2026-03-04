import Navbar from './Navbar'
import BottomNav from './BottomNav'

export default function AppShell({ children, currentPage, onNavigate, xpProgress, currentLevel, streak }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      {/* Desktop top nav (hidden on mobile) */}
      <div className="hidden md:block">
        <Navbar
          currentPage={currentPage}
          onNavigate={onNavigate}
          xpProgress={xpProgress}
          currentLevel={currentLevel}
          streak={streak}
        />
      </div>

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-blue-800 text-white safe-top">
        <button onClick={() => onNavigate('dashboard')} className="font-bold text-lg hover:opacity-80 transition-opacity">🏈 Gridiron IQ</button>
        <div className="flex items-center gap-3 text-sm">
          {streak > 0 && <span className="flex items-center gap-1">🔥 {streak}</span>}
          <span className="flex items-center gap-1">⭐ Lv.{currentLevel?.level}</span>
          <button
            onClick={() => onNavigate('settings')}
            className="text-lg leading-none opacity-80 hover:opacity-100"
            aria-label="Settings"
          >⚙️</button>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50">
        <BottomNav currentPage={currentPage} onNavigate={onNavigate} />
      </div>
    </div>
  )
}
