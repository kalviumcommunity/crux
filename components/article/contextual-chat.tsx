"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Loader2, MessageSquare, AlertCircle } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
}

interface Article {
  id: string
  title: string
  description: string
  content: string
  author: string
  publishedAt: string
  urlToImage: string
  url: string
  source: {
    id: string
    name: string
  }
}

interface ContextualChatProps {
  article: Article
}

export function ContextualChat({ article }: ContextualChatProps) {
  const { user, token } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `I've read the article "${article.title}". I can help you understand the key points, answer questions about the content, or discuss the implications. What would you like to know?`,
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    if (!user || !token) {
      setError("Please log in to use the chat feature")
      return
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentQuery = inputValue
    setInputValue("")
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/chat/contextual", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          articleId: article.id,
          userQuery: currentQuery,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to get AI response")
      }

      const data = await response.json()

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Chat error:", err)
      setError(err instanceof Error ? err.message : "Failed to get AI response")

      // Add error message to chat
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your request right now. Please try again.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-accent" />
            Article Chat
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex items-center justify-center">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Please log in to chat about this article.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-accent" />
          Article Chat
        </CardTitle>
        <p className="text-sm text-muted-foreground">Ask questions about this article</p>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {error && (
          <div className="px-4 pb-2">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "ai" && (
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.sender === "user" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.content}
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-accent-foreground" />
                </div>
                <div className="bg-muted text-muted-foreground p-3 rounded-lg text-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing article and generating response...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about this article..."
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} size="icon" disabled={isLoading || !inputValue.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
