import { type NextRequest, NextResponse } from "next/server"
import { dbUtils } from "@/lib/db"
import { aiUtils } from "@/lib/ai"
import { jwtUtils } from "@/lib/jwt"

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

    const { articleId, userQuery } = await request.json()

    if (!articleId || !userQuery) {
      return NextResponse.json({ error: "Article ID and user query are required" }, { status: 400 })
    }

    // Get article content for context
    const article = await dbUtils.getArticleById(articleId)
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    // Generate AI response with article context
    const structuredResponse = await aiUtils.generateContextualResponse(article.content, userQuery)

    return NextResponse.json({
      response: structuredResponse.answer,
      structuredResponse,
      articleTitle: article.title,
    })
  } catch (error) {
    console.error("Contextual chat error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
