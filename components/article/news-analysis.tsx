"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Loader2, TrendingUp, TrendingDown, Minus, Users, Clock, Target, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface NewsAnalysis {
  headline: string;
  summary: string;
  impact: string;
  stakeholders?: string[];
  timeline?: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
}

interface NewsAnalysisProps {
  articleContent: string;
  onAnalysisComplete?: (analysis: NewsAnalysis) => void;
}

export function NewsAnalysis({ articleContent, onAnalysisComplete }: NewsAnalysisProps) {
  const { user, token } = useAuth()
  const [analysis, setAnalysis] = useState<NewsAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getSentimentIcon = (sentiment: 'positive' | 'negative' | 'neutral' | 'mixed') => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'negative':
        return <TrendingDown className="w-5 h-5 text-red-500" />
      case 'neutral':
        return <Minus className="w-5 h-5 text-gray-500" />
      case 'mixed':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
    }
  }

  const getSentimentColor = (sentiment: 'positive' | 'negative' | 'neutral' | 'mixed') => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'negative':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'mixed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    }
  }

  const handleAnalyze = async () => {
    if (!user || !token) {
      setError("Please log in to use the analysis feature")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/articles/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: articleContent,
          analysisType: 'comprehensive'
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to generate analysis")
      }

      const data = await response.json()
      setAnalysis(data.analysis)
      onAnalysisComplete?.(data.analysis)
    } catch (err) {
      console.error("Analysis error:", err)
      setError(err instanceof Error ? err.message : "Failed to generate analysis")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Target className="w-5 h-5 text-accent" />
            News Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Please log in to analyze this article.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Target className="w-5 h-5 text-accent" />
          News Analysis
        </CardTitle>
        <p className="text-sm text-muted-foreground">Get AI-powered insights about this article</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {!analysis && !isLoading && (
          <Button 
            onClick={handleAnalyze} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Article"
            )}
          </Button>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-2">
              <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
              <p className="text-sm text-muted-foreground">Analyzing article content...</p>
            </div>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            {/* Headline */}
            <div>
              <h3 className="font-semibold text-lg mb-2">{analysis.headline}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{analysis.summary}</p>
            </div>

            <Separator />

            {/* Sentiment */}
            <div className="flex items-center gap-2">
              {getSentimentIcon(analysis.sentiment)}
              <Badge 
                variant="outline" 
                className={`text-xs ${getSentimentColor(analysis.sentiment)}`}
              >
                Sentiment: {analysis.sentiment}
              </Badge>
            </div>

            {/* Impact */}
            <div>
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Impact Assessment
              </h4>
              <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                {analysis.impact}
              </p>
            </div>

            {/* Stakeholders */}
            {analysis.stakeholders && analysis.stakeholders.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Key Stakeholders
                </h4>
                <div className="flex flex-wrap gap-1">
                  {analysis.stakeholders.map((stakeholder, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {stakeholder}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {analysis.timeline && analysis.timeline.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Key Events
                </h4>
                <ul className="space-y-1">
                  {analysis.timeline.map((event, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                      {event}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />

            {/* Re-analyze button */}
            <Button 
              onClick={handleAnalyze} 
              variant="outline" 
              size="sm" 
              className="w-full"
              disabled={isLoading}
            >
              Re-analyze
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
