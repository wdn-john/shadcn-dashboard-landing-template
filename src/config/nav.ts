import { UserRole } from "../types/auth"

export type NavIconKey =
  | "dashboard"
  | "requests"
  | "missions"
  | "chat"
  | "payments"
  | "settings"
  | "browse"
  | "applications"
  | "earnings"
  | "profile"
  | "experts"
  | "disputes"
  | "verifications"
  | "users"
  | "promo-codes"

export type NavItem = {
  title: string
  href: string
  icon: NavIconKey
  group: "Work" | "Account" | "Admin" | "Expert Space" | "Client Space"
}

export const navByRole: Record<UserRole, NavItem[]> = {
  ROLE_CLIENT: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
      group: "Client Space",
    },
    {
      title: "Requests",
      href: "/requests",
      icon: "requests",
      group: "Client Space",
    },
    {
      title: "Applications",
      href: "/applications",
      icon: "applications",
      group: "Client Space",
    },
    {
      title: "Work in Progress",
      href: "/jobs",
      icon: "missions",
      group: "Client Space",
    },
    { title: "Messages", href: "/chat", icon: "chat", group: "Client Space" },
    {
      title: "Payments",
      href: "/payments",
      icon: "payments",
      group: "Client Space",
    },
    {
      title: "Settings",
      href: "/settings/account",
      icon: "settings",
      group: "Account",
    },
  ],
  ROLE_EXPERT: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
      group: "Expert Space",
    },
    {
      title: "Browse Requests",
      href: "/browse-requests",
      icon: "browse",
      group: "Expert Space",
    },
    {
      title: "My Applications",
      href: "/applications",
      icon: "applications",
      group: "Expert Space",
    },
    {
      title: "Missions",
      href: "/missions",
      icon: "missions",
      group: "Expert Space",
    },
    {
      title: "Earnings",
      href: "/earnings",
      icon: "earnings",
      group: "Account",
    },
    { title: "Messages", href: "/chat", icon: "chat", group: "Expert Space" },
    { title: "Account", href: "/account", icon: "profile", group: "Account" },
  ],
  ROLE_ADMIN: [
    // Admin-specific
    {
      title: "Overview",
      href: "/dashboard",
      icon: "dashboard",
      group: "Admin",
    },
    {
      title: "Verifications",
      href: "/admin/verifications",
      icon: "verifications",
      group: "Admin",
    },
    { title: "Users", href: "/admin/users", icon: "users", group: "Admin" },
    {
      title: "Promo Codes",
      href: "/admin/promo-codes",
      icon: "promo-codes",
      group: "Admin",
    },
    // Client view
    {
      title: "Requests",
      href: "/requests",
      icon: "requests",
      group: "Client Space",
    },
    {
      title: "Work in Progress",
      href: "/jobs",
      icon: "missions",
      group: "Client Space",
    },
    // Expert view
    {
      title: "Browse Requests",
      href: "/browse-requests",
      icon: "browse",
      group: "Expert Space",
    },
    {
      title: "My Applications",
      href: "/applications",
      icon: "applications",
      group: "Expert Space",
    },
    {
      title: "Missions",
      href: "/missions",
      icon: "missions",
      group: "Expert Space",
    },
    // Shared
    { title: "Messages", href: "/chat", icon: "chat", group: "Work" },
    {
      title: "Payments",
      href: "/payments",
      icon: "payments",
      group: "Account",
    },
    {
      title: "Earnings",
      href: "/earnings",
      icon: "earnings",
      group: "Account",
    },
    { title: "Account", href: "/account", icon: "profile", group: "Account" },
    {
      title: "Settings",
      href: "/settings/account",
      icon: "settings",
      group: "Account",
    },
  ],
}
