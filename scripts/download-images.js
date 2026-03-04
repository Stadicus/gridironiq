#!/usr/bin/env node

/**
 * Download Images Script
 *
 * Reads all image sources from existing data files and downloads them locally.
 * Creates a manifest file for the app to use local images instead of fetching remotely.
 *
 * Usage: node scripts/download-images.js
 */

import fs from 'fs'
import path from 'path'
import https from 'https'
import { STATES, CAPITAL_WIKI } from '../src/data/states.js'
import { NFL_TEAMS, NFL_LEGENDS } from '../src/data/nfl.js'
import { WATERWAYS } from '../src/data/waterways.js'

const PUBLIC_DIR = path.resolve(process.cwd(), 'public', 'images')
const MANIFEST_PATH = path.resolve(process.cwd(), 'src', 'data', 'imageManifest.js')

// Directory structure
const DIRS = {
  nflLogos: path.join(PUBLIC_DIR, 'nfl-logos'),
  capitals: path.join(PUBLIC_DIR, 'capitals'),
  flags: path.join(PUBLIC_DIR, 'flags'),
  landmarks: path.join(PUBLIC_DIR, 'landmarks'),
  famousPeople: path.join(PUBLIC_DIR, 'famous-people'),
  stadiums: path.join(PUBLIC_DIR, 'stadiums'),
  players: path.join(PUBLIC_DIR, 'players'),
  waterways: path.join(PUBLIC_DIR, 'waterways')
}

// Create directories
Object.values(DIRS).forEach(dir => {
  fs.mkdirSync(dir, { recursive: true })
})

/**
 * Slugify a title to a filename
 */
function slug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/**
 * Clean person name (strip parenthetical suffixes like "(quarterback)")
 */
function cleanPersonName(name) {
  return name.replace(/\s*\([^)]*\)$/, '').trim()
}

/**
 * Download from URL with timeout and proper headers
 */
function downloadUrl(url) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Download timeout'))
    }, 8000)

    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }

    https.get(url, { headers, timeout: 8000 }, (res) => {
      // Handle redirects
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        clearTimeout(timeout)
        downloadUrl(res.headers.location).then(resolve).catch(reject)
        return
      }

      if (res.statusCode !== 200) {
        clearTimeout(timeout)
        reject(new Error(`HTTP ${res.statusCode}`))
        return
      }

      const chunks = []
      res.on('data', chunk => chunks.push(chunk))
      res.on('end', () => {
        clearTimeout(timeout)
        resolve(Buffer.concat(chunks))
      })
      res.on('error', err => {
        clearTimeout(timeout)
        reject(err)
      })
    }).on('error', err => {
      clearTimeout(timeout)
      reject(err)
    })
  })
}

/**
 * Fetch Wikipedia thumbnail URL for a given title
 */
async function getWikipediaThumbnailUrl(title) {
  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) })
    if (!res.ok) return null
    const json = await res.json()
    return json.thumbnail?.source ?? null
  } catch (err) {
    console.error(`  ✗ Wikipedia API error for "${title}": ${err.message}`)
    return null
  }
}

/**
 * Download and save image file, return relative path or null
 */
async function downloadImage(url, filename, dir) {
  try {
    const buffer = await downloadUrl(url)
    const filepath = path.join(dir, filename)
    fs.writeFileSync(filepath, buffer)
    return `/images/${path.basename(dir)}/${filename}`
  } catch (err) {
    console.error(`    ✗ Failed to download: ${err.message}`)
    return null
  }
}

/**
 * Main download process
 */
async function main() {
  const manifest = {}
  const failures = []

  console.log('🎬 Starting image download...\n')

  // ──────────────────────────────────────────────────────────────────────────
  // 1. Download NFL Logos
  // ──────────────────────────────────────────────────────────────────────────
  console.log('📍 NFL Team Logos...')
  for (const team of NFL_TEAMS) {
    const logoUrl = `https://a.espncdn.com/i/teamlogos/nfl/500/${team.id}.png`
    const filename = `${team.id.toLowerCase()}.png`
    const relPath = await downloadImage(logoUrl, filename, DIRS.nflLogos)
    if (relPath) {
      manifest[logoUrl] = relPath
      process.stdout.write('.')
    } else {
      failures.push(`NFL logo for ${team.name} (${team.id})`)
      process.stdout.write('✗')
    }
  }
  console.log(' ✓\n')

  // ──────────────────────────────────────────────────────────────────────────
  // 2. Download State Capitals
  // ──────────────────────────────────────────────────────────────────────────
  console.log('🏛️  State Capitals...')
  for (const [abbr, wikiTitle] of Object.entries(CAPITAL_WIKI)) {
    const thumbUrl = await getWikipediaThumbnailUrl(wikiTitle)
    if (!thumbUrl) {
      failures.push(`Capital: ${wikiTitle}`)
      process.stdout.write('✗')
      continue
    }

    const filename = `${slug(wikiTitle)}.jpg`
    const relPath = await downloadImage(thumbUrl, filename, DIRS.capitals)
    if (relPath) {
      manifest[wikiTitle] = relPath
      process.stdout.write('.')
    } else {
      failures.push(`Capital: ${wikiTitle}`)
      process.stdout.write('✗')
    }

    // Rate limit: 100ms between Wikipedia requests
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  console.log(' ✓\n')

  // ──────────────────────────────────────────────────────────────────────────
  // 3. Download State Flags
  // ──────────────────────────────────────────────────────────────────────────
  console.log('🚩 State Flags...')
  for (const state of STATES) {
    const flagTitle = `Flag of ${state.name}`
    const thumbUrl = await getWikipediaThumbnailUrl(flagTitle)
    if (!thumbUrl) {
      failures.push(`Flag: ${flagTitle}`)
      process.stdout.write('✗')
      continue
    }

    const filename = `${slug(flagTitle)}.jpg`
    const relPath = await downloadImage(thumbUrl, filename, DIRS.flags)
    if (relPath) {
      manifest[flagTitle] = relPath
      process.stdout.write('.')
    } else {
      failures.push(`Flag: ${flagTitle}`)
      process.stdout.write('✗')
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }
  console.log(' ✓\n')

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Download Landmarks (de-duplicate)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('🏞️  Landmarks...')
  const seenLandmarks = new Set()
  for (const state of STATES) {
    for (const landmark of state.landmarks) {
      if (seenLandmarks.has(landmark)) continue
      seenLandmarks.add(landmark)

      const thumbUrl = await getWikipediaThumbnailUrl(landmark)
      if (!thumbUrl) {
        failures.push(`Landmark: ${landmark}`)
        process.stdout.write('✗')
        continue
      }

      const filename = `${slug(landmark)}.jpg`
      const relPath = await downloadImage(thumbUrl, filename, DIRS.landmarks)
      if (relPath) {
        manifest[landmark] = relPath
        process.stdout.write('.')
      } else {
        failures.push(`Landmark: ${landmark}`)
        process.stdout.write('✗')
      }

      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  console.log(' ✓\n')

  // ──────────────────────────────────────────────────────────────────────────
  // 5. Download Famous People (de-duplicate)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('👤 Famous People...')
  const seenPeople = new Set()
  for (const state of STATES) {
    for (const person of state.famousPeople) {
      const cleanedName = cleanPersonName(person)
      if (seenPeople.has(cleanedName)) continue
      seenPeople.add(cleanedName)

      const thumbUrl = await getWikipediaThumbnailUrl(cleanedName)
      if (!thumbUrl) {
        failures.push(`Person: ${cleanedName}`)
        process.stdout.write('✗')
        continue
      }

      const filename = `${slug(cleanedName)}.jpg`
      const relPath = await downloadImage(thumbUrl, filename, DIRS.famousPeople)
      if (relPath) {
        manifest[cleanedName] = relPath
        process.stdout.write('.')
      } else {
        failures.push(`Person: ${cleanedName}`)
        process.stdout.write('✗')
      }

      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }
  console.log(' ✓\n')

  // ──────────────────────────────────────────────────────────────────────────
  // 6. Download NFL Stadiums (de-duplicate)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('🏈 NFL Stadiums...')
  const seenStadiums = new Set()
  for (const team of NFL_TEAMS) {
    if (seenStadiums.has(team.stadium)) continue
    seenStadiums.add(team.stadium)

    const thumbUrl = await getWikipediaThumbnailUrl(team.stadium)
    if (!thumbUrl) {
      failures.push(`Stadium: ${team.stadium}`)
      process.stdout.write('✗')
      continue
    }

    const filename = `${slug(team.stadium)}.jpg`
    const relPath = await downloadImage(thumbUrl, filename, DIRS.stadiums)
    if (relPath) {
      manifest[team.stadium] = relPath
      process.stdout.write('.')
    } else {
      failures.push(`Stadium: ${team.stadium}`)
      process.stdout.write('✗')
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }
  console.log(' ✓\n')

  // ──────────────────────────────────────────────────────────────────────────
  // 7. Download NFL Players/Legends (from NFL_LEGENDS)
  // ──────────────────────────────────────────────────────────────────────────
  console.log('⭐ NFL Players & Legends...')
  for (const legend of NFL_LEGENDS) {
    const thumbUrl = await getWikipediaThumbnailUrl(legend.wikiTitle)
    if (!thumbUrl) {
      failures.push(`Player: ${legend.wikiTitle}`)
      process.stdout.write('✗')
      continue
    }

    const filename = `${slug(legend.wikiTitle)}.jpg`
    const relPath = await downloadImage(thumbUrl, filename, DIRS.players)
    if (relPath) {
      manifest[legend.wikiTitle] = relPath
      process.stdout.write('.')
    } else {
      failures.push(`Player: ${legend.wikiTitle}`)
      process.stdout.write('✗')
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }
  console.log(' ✓\n')

  // ──────────────────────────────────────────────────────────────────────────
  // 8. Download Waterways
  // ──────────────────────────────────────────────────────────────────────────
  console.log('💧 Waterways...')
  for (const waterway of WATERWAYS) {
    const thumbUrl = await getWikipediaThumbnailUrl(waterway.wikiTitle)
    if (!thumbUrl) {
      failures.push(`Waterway: ${waterway.wikiTitle}`)
      process.stdout.write('✗')
      continue
    }

    const filename = `${slug(waterway.wikiTitle)}.jpg`
    const relPath = await downloadImage(thumbUrl, filename, DIRS.waterways)
    if (relPath) {
      manifest[waterway.wikiTitle] = relPath
      process.stdout.write('.')
    } else {
      failures.push(`Waterway: ${waterway.wikiTitle}`)
      process.stdout.write('✗')
    }

    await new Promise(resolve => setTimeout(resolve, 100))
  }
  console.log(' ✓\n')

  // ──────────────────────────────────────────────────────────────────────────
  // Write manifest file
  // ──────────────────────────────────────────────────────────────────────────
  console.log('📝 Writing manifest...')
  const manifestCode = `// Auto-generated image manifest — maps wiki titles and logo URLs to local paths
// DO NOT EDIT manually. Re-run: node scripts/download-images.js

export const IMAGE_MANIFEST = ${JSON.stringify(manifest, null, 2)}
`

  fs.writeFileSync(MANIFEST_PATH, manifestCode)
  console.log(`✓ Manifest written to ${MANIFEST_PATH}\n`)

  // ──────────────────────────────────────────────────────────────────────────
  // Summary
  // ──────────────────────────────────────────────────────────────────────────
  const totalImages = Object.keys(manifest).length
  console.log(`📊 Summary:`)
  console.log(`  ✓ Downloaded: ${totalImages} images`)
  console.log(`  Location: ${PUBLIC_DIR}`)

  if (failures.length > 0) {
    console.log(`\n⚠️  Failed to download ${failures.length} images:`)
    failures.forEach(f => console.log(`    • ${f}`))
  } else {
    console.log(`\n✅ All images downloaded successfully!`)
  }

  console.log(`\n🎉 Done! Run 'npm run dev' to test the app.`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
