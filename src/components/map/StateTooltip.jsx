import { STATE_BY_ABBR } from '../../data/states'
import { getMasteryLabel } from '../../utils/gamification'

export default function StateTooltip({ abbr, stateProgress }) {
  if (!abbr) return null
  const state = STATE_BY_ABBR[abbr]
  if (!state) return null
  const mastery = getMasteryLabel(abbr, stateProgress)
  const sp = stateProgress?.[abbr]
  const acc = sp?.attempts > 0 ? Math.round((sp.correct / sp.attempts) * 100) : null

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-xl rounded-xl px-4 py-3 pointer-events-none border border-slate-100 dark:border-slate-700 z-10 min-w-[200px]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{state.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{state.capital} • {state.region}</div>
        </div>
        <div className="text-right">
          {acc !== null ? (
            <>
              <div className="font-bold text-blue-700 dark:text-blue-400">{acc}%</div>
              <div className="text-xs text-slate-400">{sp.attempts} tries</div>
            </>
          ) : (
            <div className="text-xs text-slate-400">Not started</div>
          )}
        </div>
      </div>
    </div>
  )
}
