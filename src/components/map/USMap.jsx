import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps'
import { FIPS_TO_ABBR, STATE_BY_ABBR } from '../../data/states'
import { getMasteryColor } from '../../utils/gamification'
import { NFL_TEAMS, NFL_COORDS } from '../../data/nfl'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

// Northeast states that need zoom (small on standard map)
const NE_ABBRS = new Set(['CT','DE','MA','MD','ME','NH','NJ','NY','PA','RI','VT'])

export default function USMap({
  position,
  onPositionChange,
  stateProgress = {},
  hoveredState,
  selectedState,
  onStateHover,
  onStateLeave,
  onStateClick,
  highlightState = null,
  correctState = null,
  wrongState = null,
  quizMode = false,
  showNFLLogos = false,
  onTeamHover,
  onTeamLeave,
}) {
  function getFill(abbr) {
    if (correctState && abbr === correctState) return '#22c55e'
    if (wrongState && abbr === wrongState) return '#ef4444'
    if (highlightState && abbr === highlightState) return '#3b82f6'
    if (abbr === selectedState) return '#2563eb'
    if (abbr === hoveredState) return '#60a5fa'
    return getMasteryColor(abbr, stateProgress)
  }

  function getStroke(abbr) {
    if (abbr === selectedState || abbr === hoveredState || abbr === highlightState) return '#1e40af'
    return '#fff'
  }

  function getStrokeWidth(abbr) {
    if (abbr === selectedState || abbr === highlightState) return 2
    if (abbr === hoveredState) return 1.5
    return 0.5
  }

  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 900 }}
      style={{ width: '100%', height: 'auto' }}
    >
      <ZoomableGroup
        zoom={position.zoom}
        center={position.coordinates}
        onMoveEnd={onPositionChange}
        maxZoom={12}
        minZoom={1}
      >
        <Geographies geography={GEO_URL}>
          {({ geographies }) =>
            geographies.map(geo => {
              const fips = String(geo.id).padStart(2, '0')
              const abbr = FIPS_TO_ABBR[fips]
              const state = abbr ? STATE_BY_ABBR[abbr] : null
              if (!state) return null

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onMouseEnter={() => onStateHover?.(abbr)}
                  onMouseLeave={() => onStateLeave?.()}
                  onClick={() => onStateClick?.(abbr, state)}
                  style={{
                    default: {
                      fill: getFill(abbr),
                      stroke: getStroke(abbr),
                      strokeWidth: getStrokeWidth(abbr),
                      outline: 'none',
                      cursor: quizMode ? 'crosshair' : 'pointer',
                      transition: 'fill 0.15s ease'
                    },
                    hover: {
                      fill: quizMode ? getFill(abbr) : '#60a5fa',
                      stroke: '#1e40af',
                      strokeWidth: 1.5,
                      outline: 'none',
                      cursor: quizMode ? 'crosshair' : 'pointer'
                    },
                    pressed: {
                      fill: '#2563eb',
                      outline: 'none'
                    }
                  }}
                />
              )
            })
          }
        </Geographies>

        {showNFLLogos && NFL_TEAMS.map(team => {
          const coords = NFL_COORDS[team.id]
          if (!coords) return null
          const s = 18 / position.zoom
          return (
            <Marker key={team.id} coordinates={coords}>
              <image
                href={`https://a.espncdn.com/i/teamlogos/nfl/500/${team.id.toLowerCase()}.png`}
                x={-s / 2} y={-s / 2}
                width={s} height={s}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => onTeamHover?.(team)}
                onMouseLeave={() => onTeamLeave?.()}
              />
            </Marker>
          )
        })}
      </ZoomableGroup>
    </ComposableMap>
  )
}
