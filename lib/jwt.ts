import jwt from "jsonwebtoken"

// JWT utilities for authentication
export interface JWTPayload {
  userId: string
  email: string
  username: string
}

export const jwtUtils = {
  sign: (payload: JWTPayload): string => {
    const secret = process.env.JWT_SECRET || "fallback_secret_key"
    return jwt.sign(payload, secret, { expiresIn: "24h" })
  },

  verify: (token: string): JWTPayload | null => {
    try {
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET is not set in environment variables")
        return null
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as JWTPayload
      
      // Validate the payload structure
      if (!decoded.userId || !decoded.email || !decoded.username) {
        console.error("Invalid token payload structure")
        return null
      }
      
      return {
        userId: decoded.userId,
        email: decoded.email,
        username: decoded.username,
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      return null
    }
  },
}
