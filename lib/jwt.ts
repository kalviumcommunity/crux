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
      const secret = process.env.JWT_SECRET || "fallback_secret_key"
      const decoded = jwt.verify(token, secret) as JWTPayload
      return {
        userId: decoded.userId,
        email: decoded.email,
        username: decoded.username,
      }
    } catch {
      return null
    }
  },
}
