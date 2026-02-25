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
    { title: "Profile", href: "/profile", icon: "profile", group: "Account" },
  ],
  ROLE_ADMIN: [
    {
      title: "Overview",
      href: "/dashboard",
      icon: "dashboard",
      group: "Admin",
    },
    { title: "Experts", href: "/experts", icon: "experts", group: "Admin" },
    { title: "Requests", href: "/requests", icon: "requests", group: "Admin" },
    { title: "Disputes", href: "/disputes", icon: "disputes", group: "Admin" },
    { title: "Payments", href: "/payments", icon: "payments", group: "Admin" },
    {
      title: "Settings",
      href: "/settings/account",
      icon: "settings",
      group: "Account",
    },
  ],
}
