const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home',    emoji: '🏠' },
  { id: 'map',       label: 'Map',     emoji: '🗺️' },
  { id: 'quiz',      label: 'Quiz',    emoji: '🎯' },
  { id: 'daily',     label: 'Daily',   emoji: '📅' },
  { id: 'progress',  label: 'Stats',   emoji: '📊' }
]

export default function BottomNav({ currentPage, onNavigate }) {
  return (
    <div className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 safe-bottom">
      <div className="flex">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
              currentPage === item.id
                ? 'text-blue-700 dark:text-blue-400'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <span className="text-xl leading-none mb-0.5">{item.emoji}</span>
            <span className={`font-medium ${currentPage === item.id ? 'font-bold' : ''}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
