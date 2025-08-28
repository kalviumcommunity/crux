"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type AuthState, apiLogin, apiSignup, apiLogout, getCurrentUser, getCurrentToken } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  signup: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  token: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for existing user on mount
    const user = getCurrentUser()
    const userToken = getCurrentToken()
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    })
    setToken(userToken)
  }, [])

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    try {
      const { user, token: userToken } = await apiLogin(email, password)
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
      setToken(userToken)
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const signup = async (username: string, email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    try {
      const { user, token: userToken } = await apiSignup(username, email, password)
      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
      })
      setToken(userToken)
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))
    try {
      await apiLogout()
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
      setToken(null)
    } catch (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
