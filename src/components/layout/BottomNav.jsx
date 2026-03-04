const NAV_ITEMS = [
  { id: 'dashboard', label: 'Home',    emoji: '🏠' },
  { id: 'map',       label: 'Map',     emoji: '🗺️' },
  { id: 'quiz',      label: 'Quiz',    emoji: '🎯' },
  { id: 'daily',     label: 'Daily',   emoji: '📅' },
  { id: 'progress',  label: 'Progress', emoji: '📊' }
]

export default function BottomNav({ currentPage, onNavigate }) {
  return (
    <div className="bg-blue-800 dark:bg-slate-800 safe-bottom">
      <div className="flex">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center py-2 text-xs transition-colors ${
              currentPage === item.id
                ? 'text-white'
                : 'text-blue-200 dark:text-slate-400'
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
