import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for structured AI responses
export const structuredResponseUtils = {
  // Validate confidence level
  validateConfidence: (confidence: string): 'high' | 'medium' | 'low' => {
    const validLevels = ['high', 'medium', 'low'] as const
    return validLevels.includes(confidence as any) ? confidence as 'high' | 'medium' | 'low' : 'medium'
  },

  // Validate sentiment
  validateSentiment: (sentiment: string): 'positive' | 'negative' | 'neutral' | 'mixed' => {
    const validSentiments = ['positive', 'negative', 'neutral', 'mixed'] as const
    return validSentiments.includes(sentiment as any) ? sentiment as 'positive' | 'negative' | 'neutral' | 'mixed' : 'neutral'
  },

  // Sanitize array of strings
  sanitizeStringArray: (arr: any): string[] => {
    if (!Array.isArray(arr)) return []
    return arr.filter(item => typeof item === 'string' && item.trim().length > 0)
  },

  // Format confidence level for display
  formatConfidence: (confidence: 'high' | 'medium' | 'low'): string => {
    return confidence.charAt(0).toUpperCase() + confidence.slice(1)
  },

  // Format sentiment for display
  formatSentiment: (sentiment: 'positive' | 'negative' | 'neutral' | 'mixed'): string => {
    return sentiment.charAt(0).toUpperCase() + sentiment.slice(1)
  },

  // Get confidence color classes
  getConfidenceColor: (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  },

  // Get sentiment color classes
  getSentimentColor: (sentiment: 'positive' | 'negative' | 'neutral' | 'mixed') => {
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
}
