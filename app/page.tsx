"use client";

import { NewsFeed } from "@/components/news-feed";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import SidebarContent from "@/components/sidebar-content";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar>
        <div className="flex h-screen">
          <SidebarBody className="justify-between gap-10">
            <SidebarContent />
          </SidebarBody>
          <div className="flex-1 overflow-auto">
            <main className="p-6">
              <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">
                      Latest News
                    </h1>
                    <p className="text-muted-foreground">
                      Stay informed with AI-powered insights
                    </p>
                  </div>
                  <NewsFeed />
                </div>
              </div>
            </main>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
