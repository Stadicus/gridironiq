// Blob URL cache — images are fetched once and stored as local blob:// URLs.
// This eliminates re-network on every question revisit and works offline
// after the first load.
const blobCache = {}

// Wikipedia summary metadata cache (URL + description + bio)
const wikiCache = {}

// Local image manifest — lazy-loaded on first use
let manifest = null
let manifestLoaded = false

async function getManifest() {
  if (manifestLoaded) return manifest
  manifestLoaded = true
  try {
    const { IMAGE_MANIFEST } = await import('../data/imageManifest.js')
    manifest = IMAGE_MANIFEST
    return manifest
  } catch {
    // Manifest not generated yet — will fall back to remote fetching
    manifest = {}
    return manifest
  }
}

function firstTwoSentences(text) {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || []
  return sentences.slice(0, 2).join('').trim()
}

/**
 * Fetches any image URL and caches it as a blob:// URL for the session.
 * Returns the blob URL (or the original URL as fallback on error).
 *
 * First checks the local manifest for ESPN logo URLs.
 */
export async function cacheImageUrl(url) {
  if (!url) return null
  if (url in blobCache) return blobCache[url]

  // Check if we have a local image for this URL (e.g., ESPN logo)
  const m = await getManifest()
  if (url in m) {
    const localPath = m[url]
    blobCache[url] = localPath
    return localPath
  }

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) { blobCache[url] = url; return url }
    const blob = await res.blob()
    const objectUrl = URL.createObjectURL(blob)
    blobCache[url] = objectUrl
    return objectUrl
  } catch {
    blobCache[url] = url
    return url
  }
}

/**
 * Fetches Wikipedia summary data.
 * Returns { imageUrl: blob URL|null, description: string|null, bio: string|null }
 * The image itself is blob-cached via cacheImageUrl.
 *
 * First checks the local image manifest; if present, returns the local path directly.
 * Falls back to Wikipedia API if no local image is available.
 */
export async function fetchWikiData(title, width = 400) {
  if (!title) return { imageUrl: null, description: null, bio: null }
  const key = `${title}::${width}`
  if (key in wikiCache) return wikiCache[key]

  // Check if we have a local image for this title
  const m = await getManifest()
  if (title in m) {
    const localPath = m[title]
    const result = { imageUrl: localPath, description: null, bio: null }
    wikiCache[key] = result
    return result
  }

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) {
      const empty = { imageUrl: null, description: null, bio: null }
      wikiCache[key] = empty
      return empty
    }
    const json = await res.json()
    const src = json.thumbnail?.source ?? null
    const thumbUrl = src ? src.replace(/\/\d+px-/, `/${width}px-`) : null
    // Blob-cache the actual image bytes
    const imageUrl = thumbUrl ? await cacheImageUrl(thumbUrl) : null
    const description = json.description ?? null
    const bio = json.extract ? firstTwoSentences(json.extract) : null
    const result = { imageUrl, description, bio }
    wikiCache[key] = result
    return result
  } catch {
    const empty = { imageUrl: null, description: null, bio: null }
    wikiCache[key] = empty
    return empty
  }
}

// Kept for any callers that only need the image URL
export async function fetchWikiImage(title, width = 400) {
  return (await fetchWikiData(title, width)).imageUrl
}
