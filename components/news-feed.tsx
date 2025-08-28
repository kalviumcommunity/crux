"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock, ExternalLink, Search, Loader2 } from "lucide-react"

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

export function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("[v0] Fetching articles from /api/articles/feed")
      const response = await fetch("/api/articles/feed", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Error response:", errorText)
        throw new Error(`Failed to fetch articles: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Articles loaded:", data.articles?.length || 0)
      setArticles(data.articles || [])
    } catch (error) {
      console.error("[v0] Failed to load articles:", error)
      setError(error instanceof Error ? error.message : "Failed to load articles")
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      loadArticles()
      return
    }

    try {
      setSearching(true)
      setError(null)
      console.log("[v0] Searching for:", searchQuery)
      const response = await fetch(`/api/articles/feed?search=${encodeURIComponent(searchQuery)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.log("[v0] Search error response:", errorText)
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] Search results:", data.articles?.length || 0)
      setArticles(data.articles || [])
    } catch (error) {
      console.error("[v0] Search failed:", error)
      setError(error instanceof Error ? error.message : "Search failed")
    } finally {
      setSearching(false)
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    loadArticles()
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    return `${Math.floor(diffInHours / 24)}d ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={loadArticles} variant="outline">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news articles..."
            className="pl-10"
          />
        </div>
        <Button type="submit" disabled={searching}>
          {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </Button>
        {searchQuery && (
          <Button type="button" variant="outline" onClick={clearSearch}>
            Clear
          </Button>
        )}
      </form>

      {/* Results Info */}
      {searchQuery && (
        <div className="text-sm text-muted-foreground">
          {articles.length} result{articles.length !== 1 ? "s" : ""} for "{searchQuery}"
        </div>
      )}

      {/* Articles */}
      <div className="space-y-6">
        {articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found.</p>
          </div>
        ) : (
          articles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
              <Link href={`/article/${article.id}`}>
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="text-xs">
                          {article.source.name}
                        </Badge>
                        {article.author && (
                          <>
                            <span className="text-muted-foreground text-sm">•</span>
                            <span className="text-muted-foreground text-sm">{article.author}</span>
                          </>
                        )}
                      </div>
                      <h2 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
                        {article.title}
                      </h2>
                    </div>
                    <img
                      src={article.urlToImage || "/placeholder.svg?height=128&width=128&query=news"}
                      alt={article.title}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg flex-shrink-0"
                    />
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 line-clamp-2">{article.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{formatTimeAgo(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-accent">
                      <span>Read more</span>
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
