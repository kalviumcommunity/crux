import { type NextRequest, NextResponse } from "next/server"
import { dbUtils } from "@/lib/db"
import { jwtUtils } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Find user by email
    const user = await dbUtils.findUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password (in real app, use bcrypt.compare)
    if (user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate JWT token
    const token = jwtUtils.sign({
      userId: user.id,
      email: user.email,
      username: user.username,
    })

    return NextResponse.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
