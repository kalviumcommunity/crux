import { type NextRequest, NextResponse } from "next/server"
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

    const { content, analysisType = 'comprehensive' } = await request.json()

    if (!content) {
      return NextResponse.json({ error: "Article content is required" }, { status: 400 })
    }

    // Generate structured news analysis
    const analysis = await aiUtils.generateNewsAnalysis(content, analysisType)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("News analysis error:", error)
    return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 })
  }
}
