# Structured Output Implementation

This document describes the structured output implementation for the CruX News App using Google Gemini API.

## Overview

The app now uses Gemini's structured output feature to provide more consistent, reliable, and informative AI responses. Instead of free-form text, the AI returns structured data that includes confidence levels, key points, sources, and other metadata.

## Features

### 1. Contextual Article Chat
- **Purpose**: Chat about specific articles with AI assistance
- **Structured Response Fields**:
  - `answer`: Direct response to user's question
  - `keyPoints`: 3-5 key points from the article
  - `confidence`: 'high', 'medium', or 'low'
  - `sourceReferences`: Specific quotes from the article
  - `relatedTopics`: Related themes mentioned

### 2. Global Chat
- **Purpose**: General news and topic discussions
- **Structured Response Fields**:
  - `answer`: Direct response to user's query
  - `newsSummary`: Brief context or background
  - `keyFacts`: 3-5 key facts related to the query
  - `sources`: Any mentioned sources or references
  - `recommendations`: 2-3 suggested follow-up questions
  - `confidence`: 'high', 'medium', or 'low'

### 3. News Analysis
- **Purpose**: Comprehensive analysis of news content
- **Structured Response Fields**:
  - `headline`: Main topic or theme
  - `summary`: Comprehensive but concise summary
  - `impact`: Assessment of potential impact
  - `stakeholders`: Key stakeholders or affected parties
  - `timeline`: Chronological timeline of key events
  - `sentiment`: 'positive', 'negative', 'neutral', or 'mixed'

## Implementation Details

### API Routes

#### `/api/chat/contextual`
```typescript
POST /api/chat/contextual
{
  "articleId": string,
  "userQuery": string
}

Response:
{
  "response": string,
  "structuredResponse": {
    "answer": string,
    "keyPoints": string[],
    "confidence": "high" | "medium" | "low",
    "sourceReferences": string[],
    "relatedTopics": string[]
  },
  "articleTitle": string
}
```

#### `/api/chat/global`
```typescript
POST /api/chat/global
{
  "userQuery": string
}

Response:
{
  "response": string,
  "structuredResponse": {
    "answer": string,
    "newsSummary": string,
    "keyFacts": string[],
    "sources": string[],
    "recommendations": string[],
    "confidence": "high" | "medium" | "low"
  }
}
```

#### `/api/articles/analyze`
```typescript
POST /api/articles/analyze
{
  "content": string,
  "analysisType": "summary" | "impact" | "comprehensive"
}

Response:
{
  "analysis": {
    "headline": string,
    "summary": string,
    "impact": string,
    "stakeholders": string[],
    "timeline": string[],
    "sentiment": "positive" | "negative" | "neutral" | "mixed"
  }
}
```

### Components

#### ContextualChat
- Displays structured responses with confidence indicators
- Shows key points, source references, and related topics
- Color-coded confidence levels (green/yellow/red)

#### GlobalChat
- Enhanced with structured response display
- Shows key facts, sources, and recommendations
- Confidence level indicators

#### NewsAnalysis
- New component for comprehensive news analysis
- Sentiment analysis with visual indicators
- Impact assessment and stakeholder identification
- Timeline of key events

### Utility Functions

#### `structuredResponseUtils`
Located in `lib/utils.ts`:

```typescript
// Validate and sanitize structured responses
validateConfidence(confidence: string): 'high' | 'medium' | 'low'
validateSentiment(sentiment: string): 'positive' | 'negative' | 'neutral' | 'mixed'
sanitizeStringArray(arr: any): string[]

// Format for display
formatConfidence(confidence: string): string
formatSentiment(sentiment: string): string

// Get styling classes
getConfidenceColor(confidence: string): string
getSentimentColor(sentiment: string): string
```

## Usage Examples

### Using the News Analysis Component

```tsx
import { NewsAnalysis } from "@/components/article/news-analysis"

function ArticlePage({ article }) {
  return (
    <div>
      <h1>{article.title}</h1>
      <p>{article.content}</p>
      <NewsAnalysis 
        articleContent={article.content}
        onAnalysisComplete={(analysis) => {
          console.log('Analysis complete:', analysis)
        }}
      />
    </div>
  )
}
```

### Using Structured Responses in Chat

```tsx
// The structured response is automatically handled by the chat components
// You can access it from the API response:

const response = await fetch("/api/chat/contextual", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    articleId: article.id,
    userQuery: "What are the main points?",
  }),
})

const data = await response.json()
console.log(data.structuredResponse.keyPoints)
console.log(data.structuredResponse.confidence)
```

## Benefits

1. **Consistency**: Structured responses ensure consistent data format
2. **Reliability**: Confidence levels help users understand response quality
3. **Rich Information**: Key points, sources, and recommendations provide more value
4. **Better UX**: Visual indicators and organized information improve user experience
5. **Type Safety**: TypeScript interfaces ensure data integrity
6. **Extensibility**: Easy to add new fields or modify existing ones

## Error Handling

The implementation includes comprehensive error handling:

- **API Failures**: Fallback to structured mock responses
- **Invalid Data**: Validation utilities ensure data integrity
- **Missing Fields**: Optional fields are handled gracefully
- **Network Issues**: User-friendly error messages

## Future Enhancements

1. **Custom Schemas**: Allow users to define custom response schemas
2. **Response Templates**: Pre-defined templates for common use cases
3. **Batch Processing**: Analyze multiple articles simultaneously
4. **Export Features**: Export structured data in various formats
5. **Analytics**: Track response quality and user satisfaction

## Configuration

The structured output is configured through:

- **Prompts**: `lib/prompts.ts` contains structured output instructions
- **Schemas**: `lib/ai.ts` defines the JSON schemas for Gemini
- **Types**: TypeScript interfaces ensure type safety
- **Components**: React components handle display and interaction

## Testing

To test the structured output:

1. Start the development server
2. Navigate to an article page
3. Use the contextual chat feature
4. Check the browser console for structured response data
5. Verify that confidence levels and key points are displayed correctly

## Troubleshooting

### Common Issues

1. **Missing Structured Response**: Check if the API is returning the expected format
2. **Invalid Confidence Levels**: Use the validation utilities to sanitize data
3. **Empty Arrays**: Ensure the AI is generating the required fields
4. **Type Errors**: Verify that TypeScript interfaces match the actual data

### Debug Mode

Enable debug logging by setting the environment variable:
```bash
DEBUG_AI_RESPONSES=true
```

This will log structured responses to the console for debugging purposes.
