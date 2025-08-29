import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useState } from "react"

interface ArticleAnalysisProps {
  article: {
    title: string
    content: string
    description: string
    source: {
      name: string
    }
  }
}

export function ArticleAnalysis({ article }: ArticleAnalysisProps) {
  const [analysis, setAnalysis] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const generateAnalysis = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chat/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ article }),
      })

      const data = await response.json()
      if (response.ok) {
        setAnalysis(data.prompt)
      } else {
        console.error('Failed to generate analysis:', data.error)
      }
    } catch (error) {
      console.error('Error generating analysis:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Button 
        onClick={generateAnalysis}
        disabled={loading}
        className="w-full"
      >
        {loading ? 'Generating Analysis...' : 'Analyze Article'}
      </Button>

      {analysis && (
        <Card className="p-4">
          <pre className="whitespace-pre-wrap text-sm">
            {analysis}
          </pre>
        </Card>
      )}
    </div>
  )
}
