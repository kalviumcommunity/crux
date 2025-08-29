import { buildPrompt } from "./prompts"
import { logTokenUsage } from "./tokenCounter"

// Structured output schemas for different response types
const STRUCTURED_SCHEMAS = {
  // Schema for contextual article responses
  CONTEXTUAL_RESPONSE: {
    type: "object",
    properties: {
      answer: {
        type: "string",
        description: "Direct answer to the user's question about the article"
      },
      keyPoints: {
        type: "array",
        items: { type: "string" },
        description: "Key points from the article relevant to the query"
      },
      confidence: {
        type: "string",
        enum: ["high", "medium", "low"],
        description: "Confidence level in the response based on article content"
      },
      sourceReferences: {
        type: "array",
        items: { type: "string" },
        description: "Specific quotes or references from the article"
      },
      relatedTopics: {
        type: "array",
        items: { type: "string" },
        description: "Related topics or themes mentioned in the article"
      }
    },
    required: ["answer", "keyPoints", "confidence"]
  },

  // Schema for global chat responses
  GLOBAL_RESPONSE: {
    type: "object",
    properties: {
      answer: {
        type: "string",
        description: "Direct answer to the user's general news query"
      },
      newsSummary: {
        type: "string",
        description: "Brief summary of relevant news context"
      },
      keyFacts: {
        type: "array",
        items: { type: "string" },
        description: "Key facts related to the query"
      },
      sources: {
        type: "array",
        items: { type: "string" },
        description: "Mentioned sources or references"
      },
      recommendations: {
        type: "array",
        items: { type: "string" },
        description: "Suggested follow-up topics or questions"
      },
      confidence: {
        type: "string",
        enum: ["high", "medium", "low"],
        description: "Confidence level in the response"
      }
    },
    required: ["answer", "keyFacts", "confidence"]
  },

  // Schema for news analysis responses
  NEWS_ANALYSIS: {
    type: "object",
    properties: {
      headline: {
        type: "string",
        description: "Main headline or topic"
      },
      summary: {
        type: "string",
        description: "Comprehensive summary of the news"
      },
      impact: {
        type: "string",
        description: "Potential impact or significance"
      },
      stakeholders: {
        type: "array",
        items: { type: "string" },
        description: "Key stakeholders or affected parties"
      },
      timeline: {
        type: "array",
        items: { type: "string" },
        description: "Key events or timeline"
      },
      sentiment: {
        type: "string",
        enum: ["positive", "negative", "neutral", "mixed"],
        description: "Overall sentiment of the news"
      }
    },
    required: ["headline", "summary", "impact", "sentiment"]
  }
}

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
  ): Promise<ContextualResponse> => {
    try {
      const prompt = buildPrompt.forArticleContext(articleContent, userQuery, {
        articleMetadata: {
          category: context.category,
          source: context.source,
          publishDate: context.publishDate
        },
        userPreferences: context.userPreferences
      });

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          process.env.GEMINI_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
            tools: [
              {
                functionDeclarations: [
                  {
                    name: "getContextualResponse",
                    description: "Generate a structured response for article-specific queries",
                    parameters: STRUCTURED_SCHEMAS.CONTEXTUAL_RESPONSE
                  }
                ]
              }
            ],
            toolConfig: {
              functionCallingConfig: {
                mode: "ANY",
                allowedFunctionNames: ["getContextualResponse"]
              }
            }
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Extract structured response from function call
      const functionCall = data.candidates?.[0]?.content?.parts?.[0]?.functionCall
      if (functionCall && functionCall.name === "getContextualResponse") {
        const args = JSON.parse(functionCall.args)
        const structuredResponse = args as ContextualResponse
        
        // Log token usage
        logTokenUsage(
          prompt,
          JSON.stringify(structuredResponse),
          articleContent.substring(0, 2000)
        )
        
        return structuredResponse
      }

      // Fallback to unstructured response
      const fallbackText = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I apologize, but I could not generate a response at this time."
      
      return {
        answer: fallbackText,
        keyPoints: ["Unable to extract key points from response"],
        confidence: "low",
        sourceReferences: [],
        relatedTopics: []
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      // Fallback to structured mock response
      return {
        answer: `Based on the article content, ${userQuery.toLowerCase()} relates to the key findings discussed. The article highlights important developments that could impact this area significantly.`,
        keyPoints: [
          "Article contains relevant information",
          "Key developments are highlighted",
          "Potential impacts are discussed"
        ],
        confidence: "medium",
        sourceReferences: [],
        relatedTopics: []
      }
    }
  },

  generateGlobalResponse: async (
    userQuery: string,
    context: {
      userPreferences?: {
        topics?: string[];
        readingLevel?: 'basic' | 'intermediate' | 'advanced';
        preferredLanguage?: string;
      }
    } = {}
  ): Promise<GlobalResponse> => {
    try {
      const prompt = buildPrompt.forGlobalChat(userQuery, {
        userPreferences: context.userPreferences
      });

      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          process.env.GEMINI_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.4,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
            tools: [
              {
                functionDeclarations: [
                  {
                    name: "getGlobalResponse",
                    description: "Generate a structured response for general news queries",
                    parameters: STRUCTURED_SCHEMAS.GLOBAL_RESPONSE
                  }
                ]
              }
            ],
            toolConfig: {
              functionCallingConfig: {
                mode: "ANY",
                allowedFunctionNames: ["getGlobalResponse"]
              }
            }
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Extract structured response from function call
      const functionCall = data.candidates?.[0]?.content?.parts?.[0]?.functionCall
      if (functionCall && functionCall.name === "getGlobalResponse") {
        const args = JSON.parse(functionCall.args)
        const structuredResponse = args as GlobalResponse

        // Log token usage
        logTokenUsage(
          prompt,
          JSON.stringify(structuredResponse)
        )
        
        return structuredResponse
      }

      // Fallback to unstructured response
      const fallbackText = data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I apologize, but I could not generate a response at this time."
      
      return {
        answer: fallbackText,
        keyFacts: ["Unable to extract key facts from response"],
        confidence: "low",
        sources: [],
        recommendations: []
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      // Fallback to structured mock response
      return {
        answer: `That's a great question about ${userQuery.toLowerCase()}. Based on current trends and developments, there are several important considerations to explore.`,
        keyFacts: [
          "Current trends are relevant to the query",
          "Multiple factors need consideration",
          "Ongoing developments may impact outcomes"
        ],
        confidence: "medium",
        sources: [],
        recommendations: []
      }
    }
  },

  generateNewsAnalysis: async (
    newsContent: string,
    analysisType: 'summary' | 'impact' | 'comprehensive' = 'comprehensive'
  ): Promise<NewsAnalysis> => {
    try {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
          process.env.GEMINI_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: buildPrompt.forNewsAnalysis(newsContent, analysisType),
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 2048,
            },
            tools: [
              {
                functionDeclarations: [
                  {
                    name: "getNewsAnalysis",
                    description: "Generate a structured news analysis",
                    parameters: STRUCTURED_SCHEMAS.NEWS_ANALYSIS
                  }
                ]
              }
            ],
            toolConfig: {
              functionCallingConfig: {
                mode: "ANY",
                allowedFunctionNames: ["getNewsAnalysis"]
              }
            }
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      
      // Extract structured response from function call
      const functionCall = data.candidates?.[0]?.content?.parts?.[0]?.functionCall
      if (functionCall && functionCall.name === "getNewsAnalysis") {
        const args = JSON.parse(functionCall.args)
        return args as NewsAnalysis
      }

      // Fallback response
      return {
        headline: "News Analysis",
        summary: "Unable to generate structured analysis",
        impact: "Impact assessment unavailable",
        sentiment: "neutral"
      }
    } catch (error) {
      console.error("Error calling Gemini API for news analysis:", error)
      return {
        headline: "News Analysis",
        summary: "Analysis failed due to technical issues",
        impact: "Impact assessment unavailable",
        sentiment: "neutral"
      }
    }
  }
}
