import { useState, useCallback } from 'react'

const FULL_MAP = { coordinates: [-96, 38], zoom: 1 }
const NE_ZOOM  = { coordinates: [-72.5, 43.5], zoom: 6 }

export function useMap() {
  const [position, setPosition] = useState(FULL_MAP)
  const [hoveredState, setHoveredState] = useState(null)
  const [selectedState, setSelectedState] = useState(null)
  const [regionFilter, setRegionFilter] = useState(null)
  const isZoomedNE = position.zoom > 1

  const zoomToNE = useCallback(() => setPosition(NE_ZOOM), [])
  const zoomOut  = useCallback(() => setPosition(FULL_MAP), [])
  const toggleNEZoom = useCallback(() => setPosition(p => p.zoom > 1 ? FULL_MAP : NE_ZOOM), [])

  const hoverState = useCallback((abbr) => setHoveredState(abbr), [])
  const unhoverState = useCallback(() => setHoveredState(null), [])
  const selectState = useCallback((abbr) => setSelectedState(prev => prev === abbr ? null : abbr), [])
  const clearSelection = useCallback(() => setSelectedState(null), [])

  return {
    position, setPosition,
    hoveredState, hoverState, unhoverState,
    selectedState, selectState, clearSelection,
    regionFilter, setRegionFilter,
    isZoomedNE, zoomToNE, zoomOut, toggleNEZoom
  }
}
