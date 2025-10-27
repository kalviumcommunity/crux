"use client";

import { SidebarLink } from "@/components/ui/sidebar";
import { Home, MessageCircle, Newspaper, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import { motion } from "motion/react";

export default function SidebarContent() {
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const pathname = usePathname();
  const { open } = useSidebar();

  const links = [
    {
      label: "Home",
      href: "/",
      icon: <Home />,
    },
    {
      label: "AI Chat",
      href: "/chat",
      icon: <MessageCircle />,
    },
    {
      label: "News Feed",
      href: "/",
      icon: <Newspaper />,
    },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col gap-2 px-1">
        {links.map((link) => (
          <div
            key={`${link.href}-${link.label}`}
            className={cn(
              pathname === link.href && "bg-neutral-200/70 dark:bg-neutral-700/50 rounded-md",
            )}
          >
            <SidebarLink link={link} />
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 px-1">
        {isAuthenticated && user ? (
          <div className="flex items-center gap-3 px-2 py-2 rounded-md bg-neutral-200/60 dark:bg-neutral-700/50">
            <div className="h-9 w-9 rounded-full bg-neutral-300 dark:bg-neutral-600 flex items-center justify-center text-neutral-800 dark:text-neutral-100">
              <User />
            </div>

            {/* Username / email only visible when sidebar is expanded */}
            {open && (
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{user.username}</div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</div>
              </div>
            )}

            <div className="ml-auto flex items-center gap-2">
              {/* Logout icon always visible; label only when open */}
              <button
                className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
                onClick={() => logout()}
                aria-label="Logout"
              >
                <div className="h-6 w-6 flex items-center justify-center text-red-600">
                  <LogOut />
                </div>
                {open && <span className="text-sm">Logout</span>}
              </button>
            </div>
          </div>
        ) : (
          <div className="px-2 text-sm text-neutral-600 dark:text-neutral-300">
            {open ? (
              <p>
                <a className="underline" href="/auth/login">Login</a> to access AI chat.
              </p>
            ) : (
              /* When collapsed show only a small login icon that links to login */
              <a href="/auth/login" aria-label="Login" className="block p-1 rounded-md bg-neutral-200/60 dark:bg-neutral-700/50">
                <User />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}