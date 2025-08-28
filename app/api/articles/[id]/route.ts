import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("[v0] API route called: /api/articles/[id] with id:", params.id)

    const NEWS_API_KEY = process.env.NEWS_API_KEY
    console.log("[v0] NEWS_API_KEY available:", !!NEWS_API_KEY)

    if (NEWS_API_KEY) {
      try {
        // Since NewsAPI doesn't have individual article endpoints, we'll fetch recent articles
        // and try to find the one with matching URL or title
        const decodedId = decodeURIComponent(params.id)
        console.log("[v0] Decoded article ID:", decodedId)

        // Fetch recent articles to find the requested one
        const newsResponse = await fetch(
          `https://newsapi.org/v2/top-headlines?apiKey=${NEWS_API_KEY}&country=us&pageSize=100`,
        )

        if (newsResponse.ok) {
          const newsData = await newsResponse.json()
          console.log("[v0] NewsAPI response for individual article search:", newsData.status)

          if (newsData.status === "ok" && newsData.articles) {
            // Try to find article by URL or title
            const article = newsData.articles.find(
              (a: any) =>
                a.url === decodedId ||
                a.title === decodedId ||
                encodeURIComponent(a.url) === params.id ||
                encodeURIComponent(a.title) === params.id,
            )

            if (article) {
              console.log("[v0] Found NewsAPI article:", article.title)
              // Transform NewsAPI article to our format
              const transformedArticle = {
                id: article.url,
                title: article.title,
                description: article.description,
                content: article.content || article.description,
                author: article.author || article.source?.name,
                publishedAt: article.publishedAt,
                urlToImage: article.urlToImage,
                url: article.url,
                source: article.source,
              }
              return NextResponse.json({ article: transformedArticle })
            }
          }
        }
      } catch (newsError) {
        console.error("[v0] NewsAPI error:", newsError)
      }
    }

    const mockArticles = [
      {
        id: "1",
        title: "Revolutionary AI Breakthrough in Medical Diagnosis",
        description: "Scientists develop AI system that can diagnose rare diseases with 95% accuracy",
        content:
          "A groundbreaking artificial intelligence system developed by researchers at Stanford University has achieved a remarkable 95% accuracy rate in diagnosing rare medical conditions. The system, called MedAI, uses advanced machine learning algorithms to analyze patient symptoms, medical history, and diagnostic images to provide accurate diagnoses for conditions that often take months or years to identify correctly.",
        author: "Dr. Michael Rodriguez",
        publishedAt: "2024-01-15T10:30:00Z",
        urlToImage: "/medical-ai.png",
        url: "https://example.com/ai-medical-breakthrough",
        source: { id: "medical-news", name: "Medical News Today" },
      },
      {
        id: "2",
        title: "Global Climate Summit Reaches Historic Agreement",
        description: "World leaders commit to ambitious carbon reduction targets",
        content:
          'In a historic moment for global climate action, representatives from 195 countries have reached a comprehensive agreement at the Global Climate Summit in Geneva. The agreement, dubbed the "Geneva Accord," establishes binding carbon reduction targets that aim to limit global warming to 1.5°C above pre-industrial levels.',
        author: "Emma Thompson",
        publishedAt: "2024-01-14T14:20:00Z",
        urlToImage: "/climate-summit-leaders.png",
        url: "https://example.com/climate-summit-agreement",
        source: { id: "global-news", name: "Global News Network" },
      },
      {
        id: "3",
        title: "Quantum Computing Milestone: 1000-Qubit Processor Unveiled",
        description: "Tech giant announces breakthrough in quantum computing with unprecedented processing power",
        content:
          'TechCorp has unveiled the world\'s first 1000-qubit quantum processor, marking a significant milestone in quantum computing development. The processor, named "QuantumMax," represents a 10-fold increase in quantum processing power compared to previous systems.',
        author: "James Liu",
        publishedAt: "2024-01-13T09:15:00Z",
        urlToImage: "/quantum-computer-processor-technology.png",
        url: "https://example.com/quantum-computing-milestone",
        source: { id: "tech-today", name: "Tech Today" },
      },
    ]

    const article = mockArticles.find((a) => a.id === params.id)

    if (!article) {
      console.log("[v0] Article not found in mock data:", params.id)
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    console.log("[v0] Returning mock article:", article.title)
    return NextResponse.json({ article })
  } catch (error) {
    console.error("[v0] API route error:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}
