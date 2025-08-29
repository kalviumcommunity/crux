import { NextRequest, NextResponse } from 'next/server'

type Article = {
  id: string
  title: string
  description: string
  content: string
  author: string
  publishedAt: string
  urlToImage: string
  url: string
  source: {
    id: string | null
    name: string
  }
}

const fallbackArticles: Article[] = [
  {
    id: '1',
    title: 'Medical AI Breakthrough in Disease Detection',
    description: 'AI system achieves 95% accuracy in early disease detection',
    content: 'A new artificial intelligence system has demonstrated remarkable accuracy in detecting early stages of various diseases...',
    author: 'Dr. Sarah Chen',
    publishedAt: '2024-01-15T10:30:00Z',
    urlToImage: '/medical-ai.png',
    url: 'https://example.com/medical-ai-breakthrough',
    source: { id: 'health-tech', name: 'Health Tech News' }
  },
  {
    id: '2',
    title: 'Global Climate Summit Reaches Historic Agreement',
    description: 'World leaders commit to aggressive carbon reduction targets',
    content: 'In a landmark decision, representatives from 195 countries have agreed to unprecedented measures to combat climate change...',
    author: 'Michael Greene',
    publishedAt: '2024-01-14T14:20:00Z',
    urlToImage: '/climate-summit-leaders.png',
    url: 'https://example.com/climate-summit-agreement',
    source: { id: 'global-news', name: 'Global News Network' }
  }
]

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params

    // Try GNews API first
    const GNEWS_API_KEY = process.env.GNEWS_API_KEY
    if (GNEWS_API_KEY) {
      try {
        // Use article ID as search query
        const searchUrl = `https://gnews.io/api/v4/search?q=${encodeURIComponent(id)}&apikey=${GNEWS_API_KEY}&max=1&lang=en`

        const response = await fetch(searchUrl)
        if (!response.ok) {
          throw new Error(`GNews API error: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.articles?.[0]) {
          const gnewsArticle = data.articles[0]
          const article: Article = {
            id,
            title: gnewsArticle.title,
            description: gnewsArticle.description,
            content: gnewsArticle.content,
            author: gnewsArticle.source?.name || 'Unknown',
            publishedAt: gnewsArticle.publishedAt,
            urlToImage: gnewsArticle.image,
            url: gnewsArticle.url,
            source: {
              id: gnewsArticle.source?.name?.toLowerCase().replace(/\s+/g, '-') || null,
              name: gnewsArticle.source?.name || 'Unknown Source'
            }
          }

          return NextResponse.json(article)
        }
      } catch (error) {
        console.error('Failed to fetch from GNews:', error)
        // Fall through to fallback articles
      }
    }

    // If GNews API fails or is unavailable, try fallback articles
    const fallbackArticle = fallbackArticles.find(article => article.id === id)
    if (fallbackArticle) {
      return NextResponse.json(fallbackArticle)
    }

    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 })
  }
}
