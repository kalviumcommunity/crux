import { buildPrompt } from "./prompts"
import { webSearch, type WebSearchResult } from "./search"
import { logTokenUsage } from "./tokenCounter"

// Gemini API configuration
const GEMINI_API_BASE = process.env.GEMINI_API_BASE || 'https://generativelanguage.googleapis.com/v1'
const GEMINI_MODEL = 'gemini-2.5-flash'

// Type definitions for structured responses
export interface ContextualResponse {
  answer: string;
  keyPoints: string[];
  confidence: 'high' | 'medium' | 'low';
  sourceReferences?: string[];
  relatedTopics?: string[];
}

export interface GlobalResponse {
  answer: string;
  newsSummary?: string;
  keyFacts: string[];
  sources?: string[];
  recommendations?: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface NewsAnalysis {
  headline: string;
  summary: string;
  impact: string;
  stakeholders?: string[];
  timeline?: string[];
  sentiment: 'positive' | 'negative' | 'neutral' | 'mixed';
}

// Helper function to handle Gemini API calls
const callGeminiAPI = async (prompt: string, generationConfig: any = {}) => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured")
  }

  const response = await fetch(
    `${GEMINI_API_BASE}/models/${GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.3,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
          ...generationConfig
        }
      }),
    },
  )

  if (!response.ok) {
    const errorText = await response.text()
    console.error(`Gemini API error (${response.status}):`, errorText)
    throw new Error(`Gemini API error: ${response.status} - ${errorText}`)
  }

  return await response.json()
}

// Helper function to extract clean text from response
const extractResponseText = (data: any): string => {
  const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
  
  if (!textResponse) {
    return "I apologize, but I could not generate a response at this time."
  }

  // Clean up the response - remove any JSON formatting or code blocks
  let cleanText = textResponse
  
  // Remove ```json and ``` markers
  cleanText = cleanText.replace(/```json\s*/g, '').replace(/```\s*/g, '')
  
  // Try to extract just the text content if it's in JSON format
  try {
    const parsed = JSON.parse(cleanText)
    // If it has an answer field, use that
    if (parsed.answer) {
      return parsed.answer
    }
    // If it's an object but no answer field, return as string
    if (typeof parsed === 'object') {
      return JSON.stringify(parsed)
    }
  } catch (error) {
    // Not JSON, return the text as is
  }

  return cleanText.trim()
}

export const aiUtils = {
  generateContextualResponse: async (
    articleContent: string, 
    userQuery: string,
    context: {
      category?: string;
      source?: string;
      publishDate?: string;
      userPreferences?: {
        topics?: string[];
        readingLevel?: 'basic' | 'intermediate' | 'advanced';
      }
    } = {}
  ): Promise<string> => {
    try {
      const prompt = buildPrompt.forArticleContext(articleContent, userQuery, {
        articleMetadata: {
          category: context.category,
          source: context.source,
          publishDate: context.publishDate
        },
        userPreferences: context.userPreferences
      })

      const data = await callGeminiAPI(prompt, {
        temperature: 0.3,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      })

      console.log("Gemini API response received")
      
      const responseText = extractResponseText(data)
      
      // Log token usage
      logTokenUsage(
        prompt,
        responseText,
        articleContent.substring(0, 2000)
      )

      return responseText
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      return `Based on the article content, ${userQuery.toLowerCase()} relates to the key findings discussed. The article highlights important developments that could impact this area significantly.`
    }
  },

  generateGlobalResponse: async (
    userQuery: string,
    context: {
      userPreferences?: {
        topics?: string[];
        readingLevel?: 'basic' | 'intermediate' | 'advanced';
        preferredLanguage?: string;
      },
      enableWebSearch?: boolean;
      maxWebResults?: number;
    } = {}
  ): Promise<GlobalResponse & { webResults: WebSearchResult[] }> => {
    try {
      let webResults: WebSearchResult[] | undefined = undefined
      if (context.enableWebSearch !== false) {
        try {
          webResults = await webSearch(userQuery, context.maxWebResults ?? 5)
        } catch (searchError) {
          console.warn("Web search failed, continuing without web results:", searchError)
          webResults = []
        }
      }

      const prompt = buildPrompt.forGlobalChat(
        userQuery,
        { userPreferences: context.userPreferences },
        webResults
      )

      const data = await callGeminiAPI(prompt, {
        temperature: 0.7,
        maxOutputTokens: 2048,
      })

      console.log("Gemini API response received")
      
      // Extract text response and parse it into structured format
      const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text
      
      if (textResponse) {
        // Try to parse the response as JSON if it's structured
        try {
          const parsed = JSON.parse(textResponse)
          if (parsed.answer && parsed.keyFacts && parsed.confidence) {
            const structuredResponse = parsed as GlobalResponse
            
            // Log token usage
            logTokenUsage(
              prompt,
              JSON.stringify(structuredResponse)
            )
            
            return { ...structuredResponse, webResults: webResults || [] }
          }
        } catch (parseError) {
          // If not JSON, extract information from text
          console.log("Response not in JSON format, parsing manually")
        }
        
        // Manual parsing from text
        const lines = textResponse.split('\n').filter((line: string) => line.trim())
        const answer = lines.find((line: string) => !line.includes(':') && line.length > 20) || textResponse
        const keyFacts = lines.filter((line: string) => line.match(/^\d+\.|\*\s*-/)).slice(0, 5)
        
        const structuredResponse: GlobalResponse = {
          answer: answer.trim(),
          keyFacts: keyFacts.length > 0 ? keyFacts.map((fact: string) => fact.replace(/^\d+\.\s*|\*\s*-/, '').trim()) : ["Key information extracted from query"],
          confidence: "high",
          sources: webResults?.map((r, i) => `${r.source || r.url} (${r.url})`) ?? [],
          recommendations: [],
        }
        
        return { ...structuredResponse, webResults: webResults || [] }
      }

      // Fallback response if no textResponse
      return {
        answer: "I apologize, but I could not generate a response at this time.",
        keyFacts: ["Unable to extract key facts from response"],
        confidence: "low",
        sources: [],
        recommendations: [],
        webResults: webResults || []
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      return { 
        answer: `That's a great question about ${userQuery.toLowerCase()}. Based on current trends and developments, there are several important considerations to explore.`,
        keyFacts: [],
        confidence: 'low',
        webResults: []
      }
    }
  },

  generateNewsAnalysis: async (
    newsContent: string,
    analysisType: 'summary' | 'impact' | 'comprehensive' = 'comprehensive'
  ): Promise<string> => {
    try {
      const prompt = buildPrompt.forNewsAnalysis(newsContent, analysisType)

      const data = await callGeminiAPI(prompt, {
        temperature: 0.2,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      })

      console.log("Gemini API response received")
      
      const responseText = extractResponseText(data)

      return responseText
    } catch (error) {
      console.error("Error calling Gemini API for news analysis:", error)
      return "I apologize, but I could not generate a news analysis at this time due to technical issues."
    }
  },

  // Simple direct chat - if you need a basic chat interface
  simpleChat: async (
    message: string,
    context: {
      temperature?: number;
      maxTokens?: number;
    } = {}
  ): Promise<string> => {
    try {
      const data = await callGeminiAPI(message, {
        temperature: context.temperature || 0.7,
        maxOutputTokens: context.maxTokens || 2048,
      })

      const responseText = extractResponseText(data)
      return responseText
    } catch (error) {
      console.error("Error in simple chat:", error)
      return "I apologize, but I'm having trouble responding right now. Please try again shortly."
    }
  }
}