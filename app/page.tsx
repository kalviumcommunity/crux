import { Navbar } from "@/components/navbar"
import { NewsFeed } from "@/components/news-feed"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Latest News</h1>
              <p className="text-muted-foreground">Stay informed with AI-powered insights</p>
            </div>
            <NewsFeed />
          </div>
        </div>
      </main>
    </div>
  )
}
