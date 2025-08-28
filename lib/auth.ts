// Authentication utilities and types
export interface User {
  id: string
  username: string
  email: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export const apiLogin = async (email: string, password: string): Promise<{ user: User; token: string }> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Login failed")
  }

  const data = await response.json()

  // Store in localStorage for persistence
  localStorage.setItem("crux_user", JSON.stringify(data.user))
  localStorage.setItem("crux_token", data.token)

  return { user: data.user, token: data.token }
}

export const apiSignup = async (
  username: string,
  email: string,
  password: string,
): Promise<{ user: User; token: string }> => {
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.error || "Signup failed")
  }

  const data = await response.json()

  // Store in localStorage for persistence
  localStorage.setItem("crux_user", JSON.stringify(data.user))
  localStorage.setItem("crux_token", data.token)

  return { user: data.user, token: data.token }
}

export const apiLogout = async (): Promise<void> => {
  localStorage.removeItem("crux_user")
  localStorage.removeItem("crux_token")
}

export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("crux_user")
  const token = localStorage.getItem("crux_token")

  if (userStr && token) {
    try {
      return JSON.parse(userStr)
    } catch {
      return null
    }
  }

  return null
}

export const getCurrentToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("crux_token")
}
