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
  group: "Work" | "Account" | "Admin"
}

export const navByRole: Record<UserRole, NavItem[]> = {
  ROLE_CLIENT: [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
      group: "Work",
    },
    { title: "Requests", href: "/requests", icon: "requests", group: "Work" },
    { title: "Work in Progress", href: "/jobs", icon: "missions", group: "Work" },
    { title: "Messages", href: "/chat", icon: "chat", group: "Work" },
    { title: "Payments", href: "/payments", icon: "payments", group: "Work" },
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
      group: "Work",
    },
    {
      title: "Browse Requests",
      href: "/browse-requests",
      icon: "browse",
      group: "Work",
    },
    {
      title: "My Applications",
      href: "/applications",
      icon: "applications",
      group: "Work",
    },
    { title: "Missions", href: "/missions", icon: "missions", group: "Work" },
    {
      title: "Earnings",
      href: "/earnings",
      icon: "earnings",
      group: "Account",
    },
    { title: "Messages", href: "/chat", icon: "chat", group: "Work" },
    { title: "Account", href: "/account", icon: "profile", group: "Account" },
  ],
  ROLE_ADMIN: [
    // Admin-specific
    { title: "Overview", href: "/dashboard", icon: "dashboard", group: "Admin" },
    { title: "Verifications", href: "/admin/verifications", icon: "verifications", group: "Admin" },
    { title: "Users", href: "/admin/users", icon: "users", group: "Admin" },
    { title: "Promo Codes", href: "/admin/promo-codes", icon: "promo-codes", group: "Admin" },
    // Client view
    { title: "Requests", href: "/requests", icon: "requests", group: "Work" },
    { title: "Work in Progress", href: "/jobs", icon: "missions", group: "Work" },
    // Expert view
    { title: "Browse Requests", href: "/browse-requests", icon: "browse", group: "Work" },
    { title: "My Applications", href: "/applications", icon: "applications", group: "Work" },
    { title: "Missions", href: "/missions", icon: "missions", group: "Work" },
    // Shared
    { title: "Messages", href: "/chat", icon: "chat", group: "Work" },
    { title: "Payments", href: "/payments", icon: "payments", group: "Account" },
    { title: "Earnings", href: "/earnings", icon: "earnings", group: "Account" },
    { title: "Account", href: "/account", icon: "profile", group: "Account" },
    { title: "Settings", href: "/settings/account", icon: "settings", group: "Account" },
  ],
}
