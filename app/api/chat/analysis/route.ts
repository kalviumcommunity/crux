import { NextRequest, NextResponse } from 'next/server'
import { aiUtils } from '@/lib/ai'
import { jwtUtils } from '@/lib/jwt'

type AnalysisPrompt = {
  article: {
    title: string
    content: string
    description: string
    source: {
      name: string
    }
  }
  analysisType?: 'ANALYSIS' | 'CHAIN_OF_THOUGHT' | 'FACT_CHECK' | 'SUMMARY'
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = jwtUtils.verify(token)
    if (!user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const body: AnalysisPrompt = await request.json()

    if (!body.article || !body.article.content) {
      return NextResponse.json(
        { error: 'Article content is required' },
        { status: 400 }
      )
    }

    // Map analysis types to our function parameters
    const analysisTypeMap = {
      'SUMMARY': 'summary' as const,
      'ANALYSIS': 'comprehensive' as const,
      'CHAIN_OF_THOUGHT': 'comprehensive' as const,
      'FACT_CHECK': 'impact' as const
    }

    const analysisType = analysisTypeMap[body.analysisType || 'ANALYSIS'] || 'comprehensive'

    // Generate AI analysis
    const analysis = await aiUtils.generateNewsAnalysis(
      `${body.article.title}\n\n${body.article.description}\n\n${body.article.content}`,
      analysisType
    )

    return NextResponse.json({
      analysis,
      articleTitle: body.article.title,
      source: body.article.source.name
    })
  } catch (error) {
    console.error('Analysis route error:', error)
    return NextResponse.json(
      { error: 'Failed to generate analysis' },
      { status: 500 }
    )
  }
}
