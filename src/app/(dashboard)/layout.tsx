import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { SocketInitializer } from "@/components/socket-initializer"
import { StaleTokenLogout } from "@/components/stale-token-logout"
import { getSession } from "@/lib/server/getSession"
import type { UserRole } from "@/types/auth"
import { Session } from "@/types/Session"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  console.log("Session in DashboardLayout:", session)

  if (!session.isAuthenticated) {
    redirect("/auth/sign-in")
  }

  if (!session.profile?.profileSetupComplete) {
    redirect("/profile-setup")
  }

  const rawRole = (session as Session)?.user?.role.roleName
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

  const p = session.profile
  const u = session.user
  const sidebarUser = {
    name:
      p?.fullName ??
      (p?.firstName && p?.lastName
        ? `${p.firstName} ${p.lastName}`
        : undefined) ??
      p?.firstName ??
      u?.email ??
      "Workedin User",
    email: u?.email ?? "",
    avatar: p?.avatarUrl ?? "",
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
            accountStatus={p?.accountStatus ?? null}
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
          <SidebarInset>
            <SiteHeader role={role} />
            <SocketInitializer role={role} />
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
            <SiteHeader role={role} />
            <SocketInitializer role={role} />
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
            accountStatus={p?.accountStatus ?? null}
            variant={config.variant}
            collapsible={config.collapsible}
            side={config.side}
          />
        </>
      )}
    </SidebarProvider>
  )
}
