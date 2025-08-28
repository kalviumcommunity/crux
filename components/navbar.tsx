"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MessageSquare, Newspaper, User, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-accent-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-primary-foreground font-bold text-xl">CruX</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="flex items-center space-x-2 text-primary-foreground hover:text-accent transition-colors"
            >
              <Newspaper className="w-4 h-4" />
              <span>Feed</span>
            </Link>
            <Link
              href="/chat"
              className="flex items-center space-x-2 text-primary-foreground hover:text-accent transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-accent">
                    <User className="w-4 h-4 mr-2" />
                    {user?.username}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm" className="text-primary-foreground hover:text-accent">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
