import { NextRequest, NextResponse } from 'next/server'
import { getStopSequences, AICallOptions } from '@/lib/stopSequences'

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
  options?: AICallOptions
}

const generatePromptWithStops = (
  article: AnalysisPrompt['article'],
  analysisType: AnalysisPrompt['analysisType'] = 'CHAIN_OF_THOUGHT'
) => {
  const stopSequences = getStopSequences(analysisType)
  const endMarker = stopSequences[0] // Use first stop sequence as end marker

  return {
    prompt: `Let's analyze this news article step by step:

1. Initial Understanding:
   - Article Title: "${article.title}"
   - Source: ${article.source.name}
   - Key Points: ${article.description}

2. Context Analysis:
   - What is the broader context of this news?
   - What field or domain does this belong to?
   - Are there any historical precedents?

3. Critical Evaluation:
   - What are the main claims being made?
   - What evidence is presented?
   - Are there potential biases to consider?

4. Impact Assessment:
   - Who is affected by this news?
   - What are the immediate implications?
   - What could be the long-term consequences?

5. Verification Points:
   - What parts need fact-checking?
   - Are there multiple sources confirming this?
   - Any contradicting information?

6. Knowledge Synthesis:
   - How does this connect to other recent events?
   - What patterns or trends emerge?
   - What insights can we draw?

7. Future Implications:
   - What developments might follow?
   - What should readers watch for next?
   - What preventive or preparatory actions might be relevant?

Based on the above framework, let's analyze this specific content:
${article.content}

Please provide your analysis following this chain of thought structure.`
}

export async function POST(request: NextRequest) {
  try {
    const body: AnalysisPrompt = await request.json()

    if (!body.article || !body.article.content) {
      return NextResponse.json(
        { error: 'Article content is required' },
        { status: 400 }
      )
    }

    const { prompt, stopSequences, options } = generatePromptWithStops(
      body.article,
      body.analysisType
    )

    // Merge default options with user-provided options
    const finalOptions: AICallOptions = {
      ...options,
      ...body.options,
      stopSequences
    }

    // Here you would typically send this to an AI model with the stop sequences
    return NextResponse.json({
      prompt,
      configuration: finalOptions,
      message: 'Use this prompt with your preferred AI model'
    })
  } catch (error) {
    console.error('Analysis route error:', error)
    return NextResponse.json(
      { error: 'Failed to generate analysis prompt' },
      { status: 500 }
    )
  }
}
