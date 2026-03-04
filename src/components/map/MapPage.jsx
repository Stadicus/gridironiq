import { useState, useRef } from 'react'
import USMap from './USMap'
import { useMap } from '../../hooks/useMap'
import { STATE_BY_ABBR } from '../../data/states'
import { TEAMS_BY_STATE } from '../../data/nfl'

const TOOLTIP_W = 224 // approximate max-width of tooltip

export default function MapPage({ onNavigate, data }) {
  const {
    position, setPosition,
    hoveredState, hoverState, unhoverState,
    selectedState, selectState, clearSelection,
    isZoomedNE, toggleNEZoom
  } = useMap()

  const [showNFLLogos, setShowNFLLogos] = useState(false)
  const [hoveredTeam, setHoveredTeam] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const mapContainerRef = useRef(null)

  function handleMouseMove(e) {
    const rect = mapContainerRef.current?.getBoundingClientRect()
    if (rect) setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  const stateProgress = data?.stateProgress || {}
  const selectedInfo = selectedState ? STATE_BY_ABBR[selectedState] : null
  const nflTeams = selectedState ? (TEAMS_BY_STATE[selectedState] || []) : []

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto px-2 py-4 gap-3">

      {/* Map area */}
      <div
        ref={mapContainerRef}
        onMouseMove={handleMouseMove}
        className="relative flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
      >
        <USMap
          position={position}
          onPositionChange={setPosition}
          stateProgress={stateProgress}
          hoveredState={hoveredState}
          selectedState={selectedState}
          onStateHover={hoverState}
          onStateLeave={unhoverState}
          onStateClick={selectState}
          showNFLLogos={showNFLLogos}
          onTeamHover={setHoveredTeam}
          onTeamLeave={() => setHoveredTeam(null)}
          fillHeight
        />

        {/* Controls: top-right */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={toggleNEZoom}
            className={`text-xs font-semibold px-3 py-2 rounded-xl shadow-md transition-all ${
              isZoomedNE
                ? 'bg-blue-700 text-white'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
            }`}
            title="Zoom into Northeast"
          >
            {isZoomedNE ? '🗺️ Full Map' : '🔍 Zoom NE'}
          </button>
          <button
            onClick={() => setShowNFLLogos(v => !v)}
            className={`text-xs font-semibold px-3 py-2 rounded-xl shadow-md transition-all ${
              showNFLLogos
                ? 'bg-green-600 text-white'
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600'
            }`}
            title="Toggle NFL team logos"
          >
            {showNFLLogos ? '🏈 Hide NFL' : '🏈 NFL Teams'}
          </button>
        </div>

        {/* State name label — follows cursor, only when NFL logos are hidden */}
        {!showNFLLogos && hoveredState && !selectedState && (() => {
          const containerW = mapContainerRef.current?.clientWidth || 800
          const state = STATE_BY_ABBR[hoveredState]
          if (!state) return null
          const flipX = mousePos.x + 14 + 160 > containerW
          return (
            <div
              className="absolute bg-slate-900/80 dark:bg-slate-700/90 text-white text-xs font-semibold px-2.5 py-1 rounded-lg pointer-events-none z-20 whitespace-nowrap shadow-lg"
              style={{
                top: mousePos.y + 14,
                ...(flipX
                  ? { right: containerW - mousePos.x + 14 }
                  : { left: mousePos.x + 14 }),
              }}
            >
              {state.name}
            </div>
          )
        })()}

        {/* NFL team hover tooltip — follows mouse */}
        {hoveredTeam && (() => {
          const containerW = mapContainerRef.current?.clientWidth || 800
          const flipX = mousePos.x + 14 + TOOLTIP_W > containerW
          return (
            <div
              className="absolute bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-600 p-3 text-sm pointer-events-none z-20"
              style={{
                top: mousePos.y + 14,
                ...(flipX
                  ? { right: containerW - mousePos.x + 14 }
                  : { left: mousePos.x + 14 }),
                maxWidth: TOOLTIP_W,
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <img
                  src={`https://a.espncdn.com/i/teamlogos/nfl/500/${hoveredTeam.id.toLowerCase()}.png`}
                  alt={hoveredTeam.name}
                  className="w-8 h-8"
                />
                <span className="font-bold text-slate-900 dark:text-white leading-tight">{hoveredTeam.name}</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400 space-y-0.5 text-xs">
                <div>🏟️ {hoveredTeam.stadium}</div>
                <div>📍 {hoveredTeam.city}, {hoveredTeam.state}</div>
                <div>🏆 {hoveredTeam.conference} · {hoveredTeam.division}</div>
              </div>
            </div>
          )
        })()}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 px-1">
        {[['#cbd5e1','Not started'],['#fde68a','<50%'],['#fb923c','50–79%'],['#4ade80','Mastered ≥80%']].map(([color, label]) => (
          <div key={label} className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* State info modal */}
      {selectedInfo && (
        <div
          className="fixed inset-0 bg-black/40 z-30 flex items-center justify-center p-4"
          onClick={clearSelection}
        >
          <div
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">{selectedInfo.name}</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{selectedInfo.capital} · {selectedInfo.nickname}</p>
                </div>
                <div className="flex gap-2 shrink-0 ml-3">
                  <button
                    onClick={() => { clearSelection(); onNavigate('quiz', { mode: 'stateId' }) }}
                    className="btn-primary text-sm px-3 py-1.5"
                  >
                    Quiz
                  </button>
                  <button onClick={clearSelection} className="btn-secondary text-sm px-2.5 py-1.5">✕</button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">🏛️ Landmarks</h3>
                  <ul className="space-y-0.5 text-slate-600 dark:text-slate-400">
                    {selectedInfo.landmarks.map(l => <li key={l}>• {l}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">⭐ Famous People</h3>
                  <ul className="space-y-0.5 text-slate-600 dark:text-slate-400">
                    {selectedInfo.famousPeople.map(p => <li key={p}>• {p}</li>)}
                  </ul>
                </div>
                {nflTeams.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">🏈 NFL Teams</h3>
                    <ul className="space-y-0.5 text-slate-600 dark:text-slate-400">
                      {nflTeams.map(t => <li key={t.id}>• {t.name} ({t.stadium})</li>)}
                    </ul>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-slate-700 dark:text-slate-300 mb-1">💡 Fun Facts</h3>
                  <ul className="space-y-0.5 text-slate-600 dark:text-slate-400">
                    {selectedInfo.funFacts.map(f => <li key={f}>• {f}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
