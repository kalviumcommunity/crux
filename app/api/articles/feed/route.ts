import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] API route called: /api/articles/feed")

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search")

    console.log("[v0] Search params:", { limit, search })

    console.log("[v0] NEWS_API_KEY available:", !!process.env.NEWS_API_KEY)

    if (process.env.NEWS_API_KEY) {
      try {
        const newsApiUrl = new URL("https://newsapi.org/v2/top-headlines")
        newsApiUrl.searchParams.set("apiKey", process.env.NEWS_API_KEY)
        newsApiUrl.searchParams.set("country", "us")
        newsApiUrl.searchParams.set("pageSize", limit.toString())

        if (search) {
          newsApiUrl.searchParams.set("q", search)
          newsApiUrl.pathname = "/v2/everything"
          newsApiUrl.searchParams.delete("country")
          newsApiUrl.searchParams.set("sortBy", "publishedAt")
          newsApiUrl.searchParams.set("language", "en")
        }

        console.log("[v0] Calling NewsAPI:", newsApiUrl.toString().replace(process.env.NEWS_API_KEY, "***"))

        const response = await fetch(newsApiUrl.toString(), {
          headers: {
            "User-Agent": "CruX-News-App/1.0",
          },
        })

        console.log("[v0] NewsAPI response status:", response.status)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("[v0] NewsAPI error response:", errorText)
          throw new Error(`NewsAPI error: ${response.status} - ${errorText}`)
        }

        const data = await response.json()
        console.log("[v0] NewsAPI data received:", {
          status: data.status,
          totalResults: data.totalResults,
          articlesCount: data.articles?.length,
        })

        if (data.status !== "ok" || !data.articles) {
          throw new Error(`NewsAPI returned error: ${data.message || "Unknown error"}`)
        }

        // Transform NewsAPI response to match our format
        const articles = data.articles
          .filter((article: any) => article.title && article.title !== "[Removed]")
          .map((article: any, index: number) => ({
            id: `news-${Date.now()}-${index}`,
            title: article.title,
            description: article.description || "No description available",
            content: article.content || article.description || "Content not available",
            author: article.author || "Unknown Author",
            publishedAt: article.publishedAt,
            urlToImage: article.urlToImage,
            url: article.url,
            source: article.source,
          }))
          .slice(0, limit)

        console.log("[v0] Returning real NewsAPI articles:", articles.length)

        return NextResponse.json({
          articles,
          total: data.totalResults,
        })
      } catch (newsApiError) {
        console.error("[v0] NewsAPI error, falling back to mock data:", newsApiError)
        // Fall through to mock data
      }
    } else {
      console.log("[v0] NEWS_API_KEY not found, using mock data")
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

    let articles = mockArticles

    if (search) {
      articles = mockArticles.filter(
        (article) =>
          article.title.toLowerCase().includes(search.toLowerCase()) ||
          article.description.toLowerCase().includes(search.toLowerCase()),
      )
      console.log("[v0] Filtered mock articles:", articles.length)
    }

    articles = articles.slice(0, limit)

    console.log("[v0] Returning mock articles:", articles.length)

    return NextResponse.json({
      articles,
      total: articles.length,
    })
  } catch (error) {
    console.error("[v0] API route error:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
