// In-memory cache for Wikipedia thumbnail URLs (lives for the session)
const cache = {}

/**
 * Fetches the thumbnail image URL for a Wikipedia article.
 * Returns null if not found or on error.
 */
export async function fetchWikiImage(title, width = 400) {
  if (!title) return null
  const key = `${title}::${width}`
  if (key in cache) return cache[key]

  try {
    const res = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) { cache[key] = null; return null }
    const data = await res.json()
    // Rewrite thumbnail to requested width
    const src = data.thumbnail?.source ?? null
    const url = src ? src.replace(/\/\d+px-/, `/${width}px-`) : null
    cache[key] = url
    return url
  } catch {
    cache[key] = null
    return null
  }
}
