import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from 'react-simple-maps'
import { FIPS_TO_ABBR, STATE_BY_ABBR } from '../../data/states'
import { getMasteryColor } from '../../utils/gamification'
import { NFL_TEAMS, NFL_COORDS } from '../../data/nfl'

const GEO_URL = 'https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json'

// Northeast states that need zoom (small on standard map)
const NE_ABBRS = new Set(['CT','DE','MA','MD','ME','NH','NJ','NY','PA','RI','VT'])

// Approximate px-per-degree for AlbersUSA at scale=900 in an 800px-wide SVG.
// Used only for relative overlap detection — both conversions use the same scale
// so the direction and magnitude of displacement are consistent.
const LNG_PX = 11, LAT_PX = 10

// Force-directed spread: push overlapping markers apart until no pair is closer
// than minDist, then convert displacement back to lng/lat. Computed once at
// module load so it costs nothing at render time.
function spreadMarkers(teams, coords, minDist) {
  const pts = teams
    .filter(t => coords[t.id])
    .map(t => ({ id: t.id, x: coords[t.id][0] * LNG_PX, y: -coords[t.id][1] * LAT_PX }))

  for (let iter = 0; iter < 300; iter++) {
    let moved = false
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const a = pts[i], b = pts[j]
        const dx = b.x - a.x, dy = b.y - a.y
        const d = Math.hypot(dx, dy)
        if (d < minDist && d > 0.001) {
          const f = (minDist - d) * 0.5 / d
          a.x -= dx * f;  a.y -= dy * f
          b.x += dx * f;  b.y += dy * f
          moved = true
        }
      }
    }
    if (!moved) break
  }

  return Object.fromEntries(pts.map(p => [p.id, [p.x / LNG_PX, -p.y / LAT_PX]]))
}

const DISPLAY_COORDS_DESKTOP = spreadMarkers(NFL_TEAMS, NFL_COORDS, 20)
const DISPLAY_COORDS_MOBILE  = spreadMarkers(NFL_TEAMS, NFL_COORDS, 30)

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
  fillHeight = false,
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

  const isMobile = window.innerWidth < 640
  const base = isMobile ? 28 : 18
  const displayCoords = isMobile ? DISPLAY_COORDS_MOBILE : DISPLAY_COORDS_DESKTOP
  // Logos stay fixed screen size regardless of zoom, on both desktop and mobile.
  const logoSize = base

  return (
    <ComposableMap
      projection="geoAlbersUsa"
      projectionConfig={{ scale: 900 }}
      style={{ width: '100%', height: fillHeight ? '100%' : 'auto' }}
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
          const coords = displayCoords[team.id]
          if (!coords) return null
          return (
            <Marker key={team.id} coordinates={coords}>
              <image
                href={`https://a.espncdn.com/i/teamlogos/nfl/500/${team.id.toLowerCase()}.png`}
                x={-logoSize / 2} y={-logoSize / 2}
                width={logoSize} height={logoSize}
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
