"use client"

import * as React from "react"
import {
  LayoutPanelLeft,
  LayoutDashboard,
  CheckSquare,
  MessageCircle,
  Settings,
  CreditCard,
  Users,
  AlertTriangle,
  ShieldCheck,
  Briefcase,
  Tag,
} from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { SidebarNotification } from "@/components/sidebar-notification"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { SidebarSetupCard } from "@/components/sidebar-setup-card"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { navByRole, type NavIconKey } from "@/config/nav"
import type { UserRole } from "@/types/auth"
import { useTranslation } from "react-i18next"

export function AppSidebar({
  role,
  user,
  accountStatus,
  ...props
}: {
  role: UserRole | undefined
  user?: { name?: string; email?: string; avatar?: string }
  accountStatus?: string | null
} & React.ComponentProps<typeof Sidebar>) {
  const { t } = useTranslation()
  const items = navByRole[role ?? "ROLE_CLIENT"] ?? navByRole.ROLE_CLIENT

  const iconMap: Record<NavIconKey, React.ElementType> = {
    dashboard: LayoutDashboard,
    requests: Briefcase,
    missions: CheckSquare,
    chat: MessageCircle,
    payments: CreditCard,
    settings: Settings,
    browse: Briefcase,
    applications: CheckSquare,
    earnings: CreditCard,
    profile: Users,
    experts: Users,
    disputes: AlertTriangle,
    verifications: ShieldCheck,
    users: Users,
    "promo-codes": Tag,
  }

  const navTitleMap: Record<string, string> = {
    "Dashboard":         t("nav.dashboard"),
    "Overview":          t("nav.overview"),
    "Requests":          t("nav.requests"),
    "Browse Requests":   t("nav.browseRequests"),
    "Applications":      t("nav.applications"),
    "My Applications":   t("nav.myApplications"),
    "Work in Progress":  t("nav.workInProgress"),
    "Messages":          t("nav.messages"),
    "Payments":          t("nav.payments"),
    "Earnings":          t("nav.earnings"),
    "Missions":          t("nav.missions"),
    "Account":           t("nav.account"),
    "Settings":          t("nav.settings"),
    "Verifications":     t("nav.verifications"),
    "Users":             t("nav.users"),
    "Promo Codes":       t("nav.promoCodes"),
  }

  const groupLabelMap: Record<string, string> = {
    "Client Space": t("sidebar.clientSpace"),
    "Expert Space": t("sidebar.expertSpace"),
    "Admin":        t("sidebar.admin"),
    "Work":         t("sidebar.work"),
    "Account":      t("sidebar.account"),
  }

  const groups = items.reduce<Record<string, any[]>>((acc, item) => {
    acc[item.group] = acc[item.group] ?? []
    const Icon = iconMap[item.icon]
    acc[item.group].push({
      title: navTitleMap[item.title] ?? item.title,
      url: item.href,
      icon: Icon,
    })
    return acc
  }, {})

  const navGroups = Object.entries(groups).map(([label, groupItems]) => ({
    label: groupLabelMap[label] ?? label,
    items: groupItems,
  }))

  const displayUser = {
    name: user?.name ?? "Workedin User",
    email: user?.email ?? "",
    avatar: user?.avatar ?? "",
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <img
                    src="/logo/logo-black.svg"
                    alt="Workedin"
                    className="hidden h-auto w-auto dark:hidden sm:inline"
                    style={{ maxHeight: "1.5rem" }}
                  />
                  <img
                    src="/logo/logo-light.svg"
                    alt="Workedin"
                    className="hidden h-auto w-auto sm:dark:inline"
                    style={{ maxHeight: "1.5rem" }}
                  />
                  <span className="truncate text-xs">
                    {t("sidebar.tagline")}
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <NavMain key={group.label} label={group.label} items={group.items} />
        ))}
      </SidebarContent>

      <SidebarSetupCard accountStatus={accountStatus ?? null} role={role} />
      <SidebarFooter>
        <NavUser user={displayUser} />
      </SidebarFooter>
    </Sidebar>
  )
}
