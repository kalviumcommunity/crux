"use client";

import { GlobalChat } from "@/components/global-chat";
import { Sidebar, SidebarBody } from "@/components/ui/sidebar";
import SidebarContent from "@/components/sidebar-content";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar>
        <div className="flex h-screen">
          <SidebarBody className="justify-between gap-10">
            <SidebarContent />
          </SidebarBody>
          <div className="flex-1 overflow-auto">
            <main className="p-6 h-[calc(100vh-0rem)]">
              <GlobalChat />
            </main>
          </div>
        </div>
      </Sidebar>
    </div>
  );
}
