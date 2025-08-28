"use client"

import { useState } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Clock, ExternalLink, MessageSquare, Share2 } from "lucide-react"
import { ContextualChat } from "./contextual-chat"

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

interface ArticleViewProps {
  article: Article
}

export function ArticleView({ article }: ArticleViewProps) {
  const [showChat, setShowChat] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center text-accent hover:underline mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Feed
        </Link>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{article.source.name}</Badge>
            {article.author && (
              <>
                <span className="text-muted-foreground text-sm">•</span>
                <span className="text-muted-foreground text-sm">By {article.author}</span>
              </>
            )}
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4 text-balance">{article.title}</h1>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{formatDate(article.publishedAt)}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowChat(!showChat)}
                className={showChat ? "bg-accent text-accent-foreground" : ""}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                AI Chat
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              {article.url && (
                <Link href={article.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Source
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Featured Image */}
          <img
            src={article.urlToImage || "/placeholder.svg?height=384&width=768&query=news"}
            alt={article.title}
            className="w-full h-64 md:h-96 object-cover rounded-lg mb-6"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none text-foreground">
                  <p className="text-lg text-muted-foreground mb-6 font-medium">{article.description}</p>
                  <div className="space-y-4">
                    {article.content.split("\n").map(
                      (paragraph, index) =>
                        paragraph.trim() && (
                          <p key={index} className="leading-relaxed">
                            {paragraph}
                          </p>
                        ),
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Article Actions */}
            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Article
                </Button>
                {article.url && (
                  <Link href={article.url} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Read Original
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Contextual Chat Panel */}
          {showChat && (
            <div className="lg:col-span-1">
              <ContextualChat article={article} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
