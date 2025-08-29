import { notFound } from "next/navigation"
import { ArticleView } from "@/components/article/article-view"
import { Navbar } from "@/components/navbar"

interface Article {
  id: string
  title: string
  description: string
  content: string
  author: string
  publishedAt: string
  urlToImage: string
  url: string
  source: {
    id: string
    name: string
  }
}

interface ArticlePageProps {
  params: {
    id: string
  }
}

async function getArticleById(id: string): Promise<Article | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/articles/${id}`, {
      cache: "no-store", // Ensure fresh data on each request
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.article
  } catch (error) {
    console.error("Failed to fetch article:", error)
    return null
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = params
  const article = await getArticleById(id)

  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <ArticleView article={article} />
      </main>
    </div>
  )
}
