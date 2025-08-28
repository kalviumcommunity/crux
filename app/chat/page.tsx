import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { GlobalChat } from "@/components/global-chat"

export const metadata: Metadata = {
  title: "AI Chat - CruX",
  description: "Chat with AI about news, current events, and any topic you're interested in",
}

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 h-[calc(100vh-4rem)]">
        <GlobalChat />
      </main>
    </div>
  )
}
