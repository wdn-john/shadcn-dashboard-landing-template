import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { UpgradeToProButton } from "@/components/upgrade-to-pro-button"
import { getSession } from "@/lib/server/getSession"
import type { UserRole } from "@/types/auth"
import { Session } from "@/types/Session"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  console.log("User Role", session.user)
  const rawRole = (session as Session)?.user?.role.roleName;
  const role: UserRole =
    rawRole === "ROLE_CLIENT" ||
    rawRole === "ROLE_EXPERT" ||
    rawRole === "ROLE_ADMIN"
      ? rawRole
      : rawRole === "CLIENT"
      ? "ROLE_CLIENT"
      : rawRole === "EXPERT"
      ? "ROLE_EXPERT"
      : rawRole === "ADMIN"
      ? "ROLE_ADMIN"
      : "ROLE_CLIENT"

  const sidebarUser = {
    name: (session as any)?.user?.name ?? "Workedin User",
    email: (session as any)?.user?.email ?? "",
    avatar: (session as any)?.user?.avatarUrl ?? "",
  }

  // Temporary sidebar UI config (server-safe). You can later replace this with a persisted user preference.
  const config = {
    side: "left" as const,
    variant: "inset" as const,
    collapsible: "icon" as const,
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "16rem",
          "--sidebar-width-icon": "3rem",
          "--header-height": "calc(var(--spacing) * 14)",
        } as React.CSSProperties
      }
      className=""
    >
      {config.side === "left" ? (
        <>
          <AppSidebar
            user={sidebarUser}
            role={role}
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                </div>
              </div>
            </div>
            <SiteFooter />
          </SidebarInset>
        </>
      ) : (
        <>
          <SidebarInset>
            <SiteHeader />
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                  {children}
                </div>
              </div>
            </div>
            <SiteFooter />
          </SidebarInset>
          <AppSidebar
            user={sidebarUser}
            role={role}
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
        </>
      )}

      <UpgradeToProButton />
    </SidebarProvider>
  )
}
