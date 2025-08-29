"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Send, Bot, User, Loader2, AlertCircle, Sparkles, CheckCircle, AlertTriangle, Info } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

interface StructuredResponse {
  answer: string;
  newsSummary?: string;
  keyFacts: string[];
  sources?: string[];
  recommendations?: string[];
  confidence: 'high' | 'medium' | 'low';
}

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  structuredResponse?: StructuredResponse
}

export function GlobalChat() {
  const { user, token } = useAuth()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI assistant powered by advanced language models. I can help you with news analysis, answer questions about current events, provide insights on various topics, or engage in thoughtful discussions. How can I assist you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const getConfidenceIcon = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'low':
        return <Info className="w-4 h-4 text-red-500" />
    }
  }

  const getConfidenceColor = (confidence: 'high' | 'medium' | 'low') => {
    switch (confidence) {
      case 'high':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-red-100 text-red-800 border-red-200'
    }
  }

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
      const response = await fetch("/api/chat/global", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
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
        structuredResponse: data.structuredResponse,
      }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      console.error("Global chat error:", err)
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

  const renderStructuredResponse = (structuredResponse: StructuredResponse) => {
    return (
      <div className="mt-4 space-y-4">
        {/* Confidence Badge */}
        <div className="flex items-center gap-2">
          {getConfidenceIcon(structuredResponse.confidence)}
          <Badge 
            variant="outline" 
            className={`text-xs ${getConfidenceColor(structuredResponse.confidence)}`}
          >
            Confidence: {structuredResponse.confidence}
          </Badge>
        </div>

        {/* News Summary */}
        {structuredResponse.newsSummary && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-foreground">News Context:</h4>
            <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
              {structuredResponse.newsSummary}
            </p>
          </div>
        )}

        {/* Key Facts */}
        {structuredResponse.keyFacts && structuredResponse.keyFacts.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-foreground">Key Facts:</h4>
            <ul className="space-y-1">
              {structuredResponse.keyFacts.map((fact, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sources */}
        {structuredResponse.sources && structuredResponse.sources.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-foreground">Sources:</h4>
            <div className="flex flex-wrap gap-1">
              {structuredResponse.sources.map((source, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {source}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recommendations */}
        {structuredResponse.recommendations && structuredResponse.recommendations.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold mb-2 text-foreground">Follow-up Questions:</h4>
            <ul className="space-y-1">
              {structuredResponse.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col h-full max-w-4xl mx-auto">
        <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">AI Chat</h1>
          </div>
          <p className="text-muted-foreground">Ask me anything about news, current events, or general topics</p>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <Alert className="max-w-md">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>Please log in to start chatting with the AI assistant.</AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-accent-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">AI Chat</h1>
        </div>
        <p className="text-muted-foreground">Ask me anything about news, current events, or general topics</p>
        {user && <p className="text-sm text-muted-foreground mt-1">Chatting as {user.username}</p>}
      </div>

      {error && (
        <div className="p-4 border-b border-border">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={`flex gap-4 ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
            {message.sender === "ai" && (
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5 text-accent-foreground" />
              </div>
            )}
            <Card
              className={`max-w-[75%] ${message.sender === "user" ? "bg-accent text-accent-foreground" : "bg-muted/50"}`}
            >
              <CardContent className="p-4">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                {message.structuredResponse && renderStructuredResponse(message.structuredResponse)}
                <p className="text-xs text-muted-foreground mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </CardContent>
            </Card>
            {message.sender === "user" && (
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-accent-foreground" />
            </div>
            <Card className="bg-muted/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="animate-pulse">AI is thinking...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-6 border-t border-border bg-muted/20">
        <div className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me anything..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
            className="flex-1 bg-background"
          />
          <Button
            onClick={handleSendMessage}
            size="icon"
            disabled={isLoading || !inputValue.trim()}
            className="bg-accent hover:bg-accent/90"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          Press Enter to send • AI responses are generated in real-time
        </p>
      </div>
    </div>
  )
}
