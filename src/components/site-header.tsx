"use client"

import * as React from "react"
import { Bell, BellRing } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { CommandSearch, SearchTrigger } from "@/components/command-search"
import { ModeToggle } from "@/components/mode-toggle"
import { useNotificationPreferenceStore } from "@/store/notificationPreferenceStore"
import type { UserRole } from "@/types/auth"

interface SiteHeaderProps {
  role?: UserRole
}

export function SiteHeader({ role }: SiteHeaderProps) {
  const [searchOpen, setSearchOpen] = React.useState(false)
  const notifStyle = useNotificationPreferenceStore((s) => s.notifStyle)
  const toggle = useNotificationPreferenceStore((s) => s.toggle)

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setSearchOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
        <div className="flex w-full items-center gap-1 px-4 py-3 lg:gap-2 lg:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex-1 max-w-sm">
            <SearchTrigger onClick={() => setSearchOpen(true)} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {role === "ROLE_EXPERT" && (
              <Button
                variant="outline"
                size="icon"
                onClick={toggle}
                title={
                  notifStyle === "modal"
                    ? "Switch to toast notifications"
                    : "Switch to popup notifications"
                }
              >
                {notifStyle === "modal" ? (
                  <BellRing className="h-[1.2rem] w-[1.2rem]" />
                ) : (
                  <Bell className="h-[1.2rem] w-[1.2rem]" />
                )}
                <span className="sr-only">
                  {notifStyle === "modal"
                    ? "Switch to toast notifications"
                    : "Switch to popup notifications"}
                </span>
              </Button>
            )}
            <ModeToggle />
          </div>
        </div>
      </header>
      <CommandSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
