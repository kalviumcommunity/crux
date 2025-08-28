import { buildPrompt } from "./prompts"

export const aiUtils = {
  generateContextualResponse: async (articleContent: string, userQuery: string): Promise<string> => {
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
                    text: buildPrompt.forArticleContext(articleContent, userQuery),
                  },
                ],
              },
            ],
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I apologize, but I could not generate a response at this time."
      )
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      // Fallback to mock response if API fails
      return `Based on the article content, ${userQuery.toLowerCase()} relates to the key findings discussed. The article highlights important developments that could impact this area significantly.`
    }
  },

  generateGlobalResponse: async (userQuery: string): Promise<string> => {
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
                    text: buildPrompt.forGlobalChat(userQuery),
                  },
                ],
              },
            ],
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      return (
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "I apologize, but I could not generate a response at this time."
      )
    } catch (error) {
      console.error("Error calling Gemini API:", error)
      // Fallback to mock response if API fails
      return `That's a great question about ${userQuery.toLowerCase()}. Based on current trends and developments, there are several important considerations to explore.`
    }
  },
}
