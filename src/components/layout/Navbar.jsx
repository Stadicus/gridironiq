const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home',      emoji: '🏠' },
  { id: 'map',       label: 'Map',       emoji: '🗺️' },
  { id: 'geography', label: 'Geography', emoji: '🌎' },
  { id: 'nfl',       label: 'NFL',       emoji: '🏈' },
  { id: 'daily',     label: 'Daily',     emoji: '📅' },
  { id: 'progress',  label: 'Progress',  emoji: '📊' },
  { id: 'settings',  label: 'Settings',  emoji: '⚙️' }
]

export default function Navbar({ currentPage, onNavigate, xpProgress, currentLevel, streak }) {
  const pct = xpProgress ? Math.round(xpProgress.progress * 100) : 0

  return (
    <nav className="bg-blue-800 text-white px-4 py-3 flex items-center gap-4 shadow-lg">
      <button onClick={() => onNavigate('dashboard')} className="font-bold text-xl mr-2 whitespace-nowrap hover:opacity-80 transition-opacity">🏈 Gridiron IQ</button>

      {/* Nav links */}
      <div className="flex items-center gap-1 flex-1">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              currentPage === item.id
                ? 'bg-white text-blue-800'
                : 'text-blue-100 hover:bg-blue-700'
            }`}
          >
            {item.emoji} {item.label}
          </button>
        ))}
      </div>

      {/* Right side: XP + level + streak */}
      <div className="flex items-center gap-4 ml-auto">
        {streak > 0 && (
          <div className="flex items-center gap-1 text-orange-300 font-bold">
            🔥 {streak}
          </div>
        )}

        <div className="flex flex-col items-end min-w-[140px]">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-blue-200">{currentLevel?.emoji} Lv.{currentLevel?.level}</span>
            <span className="text-blue-300 text-xs">{currentLevel?.title}</span>
          </div>
          <div className="w-full bg-blue-900 rounded-full h-2 mt-1">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          {xpProgress?.next && (
            <span className="text-blue-300 text-xs">{xpProgress.xpInLevel}/{xpProgress.xpNeededForNext} XP</span>
          )}
        </div>
      </div>
    </nav>
  )
}
