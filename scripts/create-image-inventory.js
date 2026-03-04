#!/usr/bin/env node

/**
 * Create a comprehensive markdown inventory of all images
 */

import fs from 'fs'
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

// Count by status and category
const localCount = images.filter(i => i.isLocal).length
const remoteCount = images.filter(i => !i.isLocal).length
const totalCount = images.length

// Group by category
const byCategory = {}
for (const img of images) {
  const cat = img.category
  if (!byCategory[cat]) byCategory[cat] = { local: 0, remote: 0, list: [] }
  byCategory[cat].list.push(img)
  if (img.isLocal) byCategory[cat].local++
  else byCategory[cat].remote++
}

// Generate markdown
let md = `# Complete Image Inventory for Gridiron IQ

**Last Updated:** 2026-03-04
**Total Images:** ${totalCount} | **Available Locally:** ${localCount} ✅ | **Missing:** ${remoteCount} ❌

## Summary by Category

| Category | Local ✅ | Missing ❌ | Total |
|----------|----------|-----------|-------|
`

for (const cat of Object.keys(byCategory).sort()) {
  const stats = byCategory[cat]
  const total = stats.local + stats.remote
  md += `| ${cat} | ${stats.local} | ${stats.remote} | ${total} |\n`
}

md += `
## Instructions

1. **For each missing image:**
   - Open the Wikipedia link provided
   - Download a representative image (300-500px recommended)
   - Rename it to the specified **Local Filename**
   - Place it in the appropriate directory under \`public/images/\`

2. **Update the manifest:**
   - Run: \`node scripts/download-images.js\`
   - This will regenerate the manifest with your new images

3. **Verify:**
   - Run: \`npm run build\`
   - Run: \`npm run dev\`
   - Test the app to confirm images load correctly

---

## Detailed Image List

`

for (const cat of Object.keys(byCategory).sort()) {
  const catImages = byCategory[cat].list
  const local = catImages.filter(i => i.isLocal)
  const missing = catImages.filter(i => !i.isLocal)

  md += `### ${cat}\n\n`
  md += `**Status:** ${local.length}/${catImages.length} available\n\n`

  if (local.length > 0) {
    md += `#### ✅ Available Locally (${local.length})\n\n`
    md += `| Title | Local Path |\n`
    md += `|-------|------------|\n`
    for (const img of local) {
      const filename = img.localPath.split('/').pop()
      md += `| ${img.title} | \`${filename}\` |\n`
    }
    md += `\n`
  }

  if (missing.length > 0) {
    md += `#### ❌ Missing (${missing.length})\n\n`
    md += `| # | Title | Local Filename | Wikipedia Link |\n`
    md += `|---|-------|-----------------|----------------|\n`
    let count = 1
    for (const img of missing) {
      const filename = img.localPath.split('/').pop()
      const wikiLink = `[${img.title}](${img.remoteUrl})`
      md += `| ${count} | ${img.title} | \`${filename}\` | ${wikiLink} |\n`
      count++
    }
    md += `\n`
  }
}

md += `---

## File Organization

\`\`\`
public/images/
├── nfl-logos/           (32 images - all available)
├── capitals/            (50 needed - some available)
├── flags/               (50 needed - some available)
├── landmarks/           (210+ needed - some available)
├── famous-people/       (230+ needed - some available)
├── stadiums/            (30 needed - some available)
├── players/             (38 needed - to be downloaded)
└── waterways/           (25 needed - some available)
\`\`\`

## Tips for Finding Images

- **Wikipedia Articles:** Use the provided Wikipedia links - they usually have an "Image" or "Media" section
- **Wikimedia Commons:** Many Wikipedia images come from Wikimedia Commons - you can search there directly
- **Image Quality:** Aim for images at least 300px wide for best quality in the app
- **Naming Convention:** Use the exact filename provided - it maps directly to the local manifest
- **Format:** JPEG for photos/people, PNG for logos

## Reporting Issues

If a Wikipedia link is broken or a particular image can't be found:
1. Try searching Wikimedia Commons directly
2. Use Google Images to find an alternative
3. Note it in your implementation
`

// Write to file
const outputPath = 'IMAGE_INVENTORY.md'
fs.writeFileSync(outputPath, md)
console.log(`✅ Created ${outputPath}`)
console.log(`📊 Total images: ${totalCount} (${localCount} local, ${remoteCount} missing)`)
