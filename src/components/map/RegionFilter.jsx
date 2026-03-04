const REGIONS = [
  { id: null,        label: 'All States', emoji: '🇺🇸' },
  { id: 'Northeast', label: 'Northeast',  emoji: '🏙️' },
  { id: 'Southeast', label: 'Southeast',  emoji: '🌴' },
  { id: 'Midwest',   label: 'Midwest',    emoji: '🌾' },
  { id: 'Southwest', label: 'Southwest',  emoji: '🌵' },
  { id: 'West',      label: 'West',       emoji: '🏔️' }
]

export default function RegionFilter({ selected, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 px-1 scrollbar-hide">
      {REGIONS.map(r => (
        <button
          key={r.id ?? 'all'}
          onClick={() => onChange(r.id)}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
            selected === r.id
              ? 'bg-blue-700 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-blue-300'
          }`}
        >
          <span>{r.emoji}</span>
          <span className="whitespace-nowrap">{r.label}</span>
        </button>
      ))}
    </div>
  )
}
