// Blob URL cache — images are fetched once and stored as local blob:// URLs.
// This eliminates re-network on every question revisit and works offline
// after the first load.
const blobCache = {}

// Wikipedia summary metadata cache (URL + description + bio)
const wikiCache = {}

function firstTwoSentences(text) {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) || []
  return sentences.slice(0, 2).join('').trim()
}

/**
 * Fetches any image URL and caches it as a blob:// URL for the session.
 * Returns the blob URL (or the original URL as fallback on error).
 */
export async function cacheImageUrl(url) {
  if (!url) return null
  if (url in blobCache) return blobCache[url]
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
 */
export async function fetchWikiData(title, width = 400) {
  if (!title) return { imageUrl: null, description: null, bio: null }
  const key = `${title}::${width}`
  if (key in wikiCache) return wikiCache[key]

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
