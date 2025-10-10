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

  const { userQuery, enableWebSearch = true, maxWebResults = 5 } = await request.json()

    if (!userQuery) {
      return NextResponse.json({ error: "User query is required" }, { status: 400 })
    }

    // Generate AI response
    const structuredResponse = await aiUtils.generateGlobalResponse(userQuery, {
      enableWebSearch,
      maxWebResults
    })

    return NextResponse.json({ 
      response: structuredResponse.answer,
      structuredResponse 
    })
  } catch (error) {
    console.error("Global chat error:", error)
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
