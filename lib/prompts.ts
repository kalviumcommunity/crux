// Types for dynamic prompting
interface PromptContext {
  currentDate: string;
  timeOfDay: string;
  userPreferences?: {
    topics?: string[];
    readingLevel?: 'basic' | 'intermediate' | 'advanced';
    preferredLanguage?: string;
  };
  articleMetadata?: {
    category?: string;
    source?: string;
    publishDate?: string;
    complexity?: number;
  };
}

// Dynamic prompt templates
const PROMPT_TEMPLATES = {
  TIME_CONTEXT: `Current date: {currentDate}
Time context: {timeOfDay}`,

  TOPIC_FOCUS: `Focus areas: {topics}
Reading level: {readingLevel}`,

  ARTICLE_METADATA: `Category: {category}
Source: {source}
Published: {publishDate}
Content complexity: {complexity}/10`,
}

// System prompts for the AI
export const SYSTEM_PROMPTS = {
  // Main system prompt that defines the AI's persona and behavior
  MAIN_PROMPT: `You are an assistant called CruX, developed and created by CruX, whose sole purpose is to analyze, summarize, and explain the latest news or user queries about news. Your responses must be factual, accurate, and context-aware.

General Guidelines:
- NEVER use meta-phrases (e.g., "let me help you", "I can see that")
- NEVER provide speculative or hallucinated news
- NEVER summarize unless explicitly requested
- NEVER provide unsolicited advice
- ALWAYS be specific, detailed, and accurate
- ALWAYS acknowledge uncertainty when present
- ALWAYS use markdown formatting for structured readability
- If asked about your identity: respond "I am CruX powered by Google Gemini API"
- If user intent is unclear, acknowledge ambiguity and give a labeled guess

Response Quality Requirements:
- Be thorough and comprehensive in news explanations
- Ensure all instructions are unambiguous and actionable
- Provide sufficient detail that responses are immediately useful
- Maintain consistent formatting throughout
- NEVER just summarize a news article unless explicitly asked to`,

  // Specific prompt for article context discussions
  ARTICLE_CONTEXT_PROMPT: `For article-specific queries:
- Use the full article text as context
- START with the direct answer, no fluff
- Keep responses grounded in the provided article
- If information is missing, clearly state that it is unavailable
- For summaries: return a structured, clear, concise summary
- For background/analysis: provide clean explanation without showing reasoning steps

Multiple Choice Questions:
- Start with the correct option
- Explain why it is correct
- Briefly explain why other options are incorrect`,

  // Prompt for global chat discussions
  GLOBAL_CHAT_PROMPT: `For general news queries:
- Rely on available news data for context
- START with direct answers, be concise but factual
- Do not hallucinate - if no reliable information found, respond: "No reliable information available"
- Provide structured outputs when relevant (e.g., list of headlines, key facts)
- For unclear screens, start with: "I'm not sure what information you're looking for"
- For emails/messages, provide direct response without asking for clarification
- For UI navigation, provide detailed step-by-step instructions with specific locations and visual identifiers`
}

// Helper function to generate dynamic context
const generateDynamicContext = (context: PromptContext): string => {
  const timeContext = PROMPT_TEMPLATES.TIME_CONTEXT
    .replace('{currentDate}', context.currentDate)
    .replace('{timeOfDay}', context.timeOfDay)

  const topicContext = context.userPreferences 
    ? PROMPT_TEMPLATES.TOPIC_FOCUS
        .replace('{topics}', context.userPreferences.topics?.join(', ') || 'General')
        .replace('{readingLevel}', context.userPreferences.readingLevel || 'intermediate')
    : ''

  const articleContext = context.articleMetadata 
    ? PROMPT_TEMPLATES.ARTICLE_METADATA
        .replace('{category}', context.articleMetadata.category || 'General')
        .replace('{source}', context.articleMetadata.source || 'Unknown')
        .replace('{publishDate}', context.articleMetadata.publishDate || 'N/A')
        .replace('{complexity}', context.articleMetadata.complexity?.toString() || '5')
    : ''

  return `${timeContext}
${topicContext}
${articleContext}`.trim()
}

// Helper function to get current context
const getCurrentContext = (): PromptContext => {
  const now = new Date()
  const hours = now.getHours()
  
  return {
    currentDate: now.toLocaleDateString(),
    timeOfDay: hours < 12 ? 'morning' : hours < 18 ? 'afternoon' : 'evening'
  }
}

// Helper function to combine system prompt with user query
export const buildPrompt = {
  // Build prompt for article context
  forArticleContext: (
    articleContent: string, 
    userQuery: string, 
    context: Partial<PromptContext> = {}
  ): string => {
    const dynamicContext = generateDynamicContext({
      ...getCurrentContext(),
      ...context,
      articleMetadata: {
        ...context.articleMetadata,
        complexity: context.articleMetadata?.complexity || 
          Math.min(Math.ceil(articleContent.length / 1000), 10) // Estimate complexity based on length
      }
    })

    return `${SYSTEM_PROMPTS.MAIN_PROMPT}
${dynamicContext}
${SYSTEM_PROMPTS.ARTICLE_CONTEXT_PROMPT}
Article Content: "${articleContent.substring(0, 2000)}..."
User Query: ${userQuery}`
  },

  // Build prompt for global chat
  forGlobalChat: (
    userQuery: string, 
    context: Partial<PromptContext> = {}
  ): string => {
    const dynamicContext = generateDynamicContext({
      ...getCurrentContext(),
      ...context
    })

    return `${SYSTEM_PROMPTS.MAIN_PROMPT}
${dynamicContext}
${SYSTEM_PROMPTS.GLOBAL_CHAT_PROMPT}
User Query: ${userQuery}`
  }
}
