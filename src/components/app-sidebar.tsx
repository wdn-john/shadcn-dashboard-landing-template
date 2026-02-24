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
} from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"
import { SidebarNotification } from "@/components/sidebar-notification"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
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

export function AppSidebar({ role, user, ...props }: { role: UserRole; user?: { name?: string; email?: string; avatar?: string } } & React.ComponentProps<typeof Sidebar>) {
  const items = navByRole[role] ?? navByRole.ROLE_CLIENT;

  const iconMap: Record<NavIconKey, React.ElementType> = {
    dashboard: LayoutDashboard,
    requests: LayoutPanelLeft,
    missions: CheckSquare,
    chat: MessageCircle,
    payments: CreditCard,
    settings: Settings,
    browse: LayoutPanelLeft,
    applications: CheckSquare,
    earnings: CreditCard,
    profile: Users,
    experts: Users,
    disputes: AlertTriangle,
  };

  const groups = items.reduce<Record<string, any[]>>((acc, item) => {
    acc[item.group] = acc[item.group] ?? [];
    const Icon = iconMap[item.icon];
    acc[item.group].push({ title: item.title, url: item.href, icon: Icon });
    return acc;
  }, {});

  const navGroups = Object.entries(groups).map(([label, groupItems]) => ({
    label,
    items: groupItems,
  }));

  const displayUser = {
    name: user?.name ?? "Workedin User",
    email: user?.email ?? "",
    avatar: user?.avatar ?? "",
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Logo size={24} className="text-current" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Workedin</span>
                  <span className="truncate text-xs">Secure IT Marketplace</span>
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

      <SidebarFooter>
        <SidebarNotification />
        <NavUser user={displayUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
