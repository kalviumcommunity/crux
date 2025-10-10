// Web search utility integrating Google Custom Search API (CSE)
// Falls back gracefully if environment variables are missing.

export interface SearchResult {
  title: string
  snippet: string
  url: string
  source?: string
  publishedAt?: string
}

interface GoogleCSEItem {
  title: string
  link: string
  snippet: string
  htmlSnippet?: string
  displayLink?: string
  pagemap?: any
}

const GOOGLE_SEARCH_ENDPOINT = 'https://www.googleapis.com/customsearch/v1'

export async function webSearch(query: string, maxResults = 5): Promise<SearchResult[]> {
  if (!query.trim()) return []

  const apiKey = process.env.GOOGLE_SEARCH_API_KEY
  const cx = process.env.GOOGLE_SEARCH_CX

  if (!apiKey || !cx) {
    console.warn('[webSearch] GOOGLE_SEARCH_API_KEY or GOOGLE_SEARCH_CX not set – returning empty results')
    return []
  }

  const params = new URLSearchParams({
    key: apiKey,
    cx,
    q: query,
    num: String(Math.min(Math.max(maxResults, 1), 10))
  })

  try {
    const res = await fetch(`${GOOGLE_SEARCH_ENDPOINT}?${params.toString()}`)
    if (!res.ok) {
      const text = await res.text()
      console.error('[webSearch] Google CSE error', res.status, text)
      return []
    }
    const data = await res.json() as { items?: GoogleCSEItem[] }
    const items = data.items || []
    return items.map(item => ({
      title: item.title,
      snippet: item.snippet,
      url: item.link,
      source: item.displayLink || extractDomain(item.link),
      publishedAt: extractPublishedDate(item.pagemap)
    }))
  } catch (e) {
    console.error('[webSearch] Unexpected failure', e)
    return []
  }
}

function extractDomain(url: string): string | undefined {
  try { return new URL(url).hostname.replace(/^www\./,'') } catch { return undefined }
}

// Attempt to pull a published date if present in pagemap metadata
function extractPublishedDate(pagemap: any): string | undefined {
  if (!pagemap) return undefined
  const meta = pagemap.metatags?.[0]
  const cand = meta?.['article:published_time'] || meta?.['og:updated_time'] || meta?.['date']
  return typeof cand === 'string' ? cand : undefined
}

export type { SearchResult as WebSearchResult }
