import { type NextRequest, NextResponse } from "next/server"
import { dbUtils } from "@/lib/db"
import { jwtUtils } from "@/lib/jwt"

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json()

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await dbUtils.findUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Create new user (in real app, hash password first)
    const newUser = await dbUtils.createUser({
      username,
      email,
      password, // In real app: await bcrypt.hash(password, 10)
    })

    // Generate JWT token
    const token = jwtUtils.sign({
      userId: newUser.id,
      email: newUser.email,
      username: newUser.username,
    })

    return NextResponse.json({
      message: "User created successfully",
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    })
  } catch (error) {
    console.error("Signup error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
