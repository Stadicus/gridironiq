#!/usr/bin/env node

/**
 * Generate a comprehensive list of all images with their local/remote status
 */

import { STATES, CAPITAL_WIKI } from '../src/data/states.js'
import { NFL_TEAMS, NFL_LEGENDS } from '../src/data/nfl.js'
import { WATERWAYS } from '../src/data/waterways.js'
import { IMAGE_MANIFEST } from '../src/data/imageManifest.js'

// Slug function
function slug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

// Clean person name
function cleanPersonName(name) {
  return name.replace(/\s*\([^)]*\)$/, '').trim()
}

const images = []

// 1. NFL Logos
for (const team of NFL_TEAMS) {
  const logoUrl = `https://a.espncdn.com/i/teamlogos/nfl/500/${team.id}.png`
  const localPath = `/images/nfl-logos/${team.id.toLowerCase()}.png`
  const isLocal = logoUrl in IMAGE_MANIFEST
  images.push({
    category: 'NFL Logo',
    title: team.name,
    localPath,
    remoteUrl: logoUrl,
    isLocal,
    source: 'ESPN CDN'
  })
}

// 2. State Capitals
for (const [abbr, wikiTitle] of Object.entries(CAPITAL_WIKI)) {
  const localPath = `/images/capitals/${slug(wikiTitle)}.jpg`
  const isLocal = wikiTitle in IMAGE_MANIFEST
  const remoteUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`
  images.push({
    category: 'State Capital',
    title: wikiTitle,
    localPath,
    remoteUrl,
    isLocal,
    source: 'Wikipedia'
  })
}

// 3. State Flags
for (const state of STATES) {
  const flagTitle = `Flag of ${state.name}`
  const localPath = `/images/flags/${slug(flagTitle)}.jpg`
  const isLocal = flagTitle in IMAGE_MANIFEST
  const remoteUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(flagTitle)}`
  images.push({
    category: 'State Flag',
    title: flagTitle,
    localPath,
    remoteUrl,
    isLocal,
    source: 'Wikipedia'
  })
}

// 4. Landmarks (de-duped)
const seenLandmarks = new Set()
for (const state of STATES) {
  for (const landmark of state.landmarks) {
    if (seenLandmarks.has(landmark)) continue
    seenLandmarks.add(landmark)

    const localPath = `/images/landmarks/${slug(landmark)}.jpg`
    const isLocal = landmark in IMAGE_MANIFEST
    const remoteUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(landmark)}`
    images.push({
      category: 'Landmark',
      title: landmark,
      localPath,
      remoteUrl,
      isLocal,
      source: 'Wikipedia'
    })
  }
}

// 5. Famous People (de-duped)
const seenPeople = new Set()
for (const state of STATES) {
  for (const person of state.famousPeople) {
    const cleanedName = cleanPersonName(person)
    if (seenPeople.has(cleanedName)) continue
    seenPeople.add(cleanedName)

    const localPath = `/images/famous-people/${slug(cleanedName)}.jpg`
    const isLocal = cleanedName in IMAGE_MANIFEST
    const remoteUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(cleanedName)}`
    images.push({
      category: 'Famous Person',
      title: cleanedName,
      localPath,
      remoteUrl,
      isLocal,
      source: 'Wikipedia'
    })
  }
}

// 6. NFL Stadiums (de-duped)
const seenStadiums = new Set()
for (const team of NFL_TEAMS) {
  if (seenStadiums.has(team.stadium)) continue
  seenStadiums.add(team.stadium)

  const localPath = `/images/stadiums/${slug(team.stadium)}.jpg`
  const isLocal = team.stadium in IMAGE_MANIFEST
  const remoteUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(team.stadium)}`
  images.push({
    category: 'NFL Stadium',
    title: team.stadium,
    localPath,
    remoteUrl,
    isLocal,
    source: 'Wikipedia'
  })
}

// 7. NFL Players/Legends
for (const legend of NFL_LEGENDS) {
  const localPath = `/images/players/${slug(legend.wikiTitle)}.jpg`
  const isLocal = legend.wikiTitle in IMAGE_MANIFEST
  const remoteUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(legend.wikiTitle)}`
  images.push({
    category: 'NFL Player',
    title: legend.name,
    wikiTitle: legend.wikiTitle,
    localPath,
    remoteUrl,
    isLocal,
    source: 'Wikipedia'
  })
}

// 8. Waterways
for (const waterway of WATERWAYS) {
  const localPath = `/images/waterways/${slug(waterway.wikiTitle)}.jpg`
  const isLocal = waterway.wikiTitle in IMAGE_MANIFEST
  const remoteUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(waterway.wikiTitle)}`
  images.push({
    category: 'Waterway',
    title: waterway.name,
    wikiTitle: waterway.wikiTitle,
    localPath,
    remoteUrl,
    isLocal,
    source: 'Wikipedia'
  })
}

// Sort by category, then title
images.sort((a, b) => {
  if (a.category !== b.category) return a.category.localeCompare(b.category)
  return a.title.localeCompare(b.title)
})

// Output as JSON
console.log(JSON.stringify(images, null, 2))
