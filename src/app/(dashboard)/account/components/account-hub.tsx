"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Briefcase,
  Award,
  Receipt,
  ShieldCheck,
  KeyRound,
  LogOut,
  ChevronRight,
  BadgeCheck,
} from "lucide-react"
import { toast } from "sonner"

type Props = {
  fullName: string | null
  firstName: string | null
  email: string | null
  avatarUrl: string | null
  title: string | null
  accountStatus: string | null
  userType: string | null
}

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  ACTIVE:                  "outline",
  VERIFIED:                "outline",
  PENDING_ID_VERIFICATION: "default",
  UNVERIFIED:              "secondary",
}

const statusLabel: Record<string, string> = {
  ACTIVE:                  "Active",
  VERIFIED:                "Verified",
  PENDING_ID_VERIFICATION: "Pending ID",
  UNVERIFIED:              "Unverified",
}

type NavTile = {
  icon: React.ElementType
  label: string
  description: string
  href: string
}

const expertTiles: NavTile[] = [
  { icon: User,       label: "Edit Profile",          description: "Name, photo, title, address",      href: "/profile" },
  { icon: Award,      label: "Skills & Certifications", description: "Manage your expertise",           href: "/account/skills" },
  { icon: Briefcase,  label: "Experience",             description: "Work history and projects",        href: "/account/experience" },
  { icon: Receipt,    label: "Tax Details",            description: "TPS/TVQ registration numbers",     href: "/account/tax" },
  { icon: BadgeCheck, label: "Activate Account",       description: "Enter your membership number",     href: "/account/activate" },
]

export function AccountHub({ fullName, firstName, email, avatarUrl, title, accountStatus, userType }: Props) {
  const router = useRouter()
  const initials = (fullName ?? "").split(" ").map(p => p[0]).join("").slice(0, 2).toUpperCase() || "?"

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/auth/sign-in")
    } catch {
      toast.error("Failed to sign out")
    }
  }

  const status = accountStatus as string | null
  const tiles = userType === "expert" ? expertTiles : [
    { icon: User, label: "Edit Profile", description: "Name, photo, address", href: "/profile" },
    { icon: Receipt, label: "Tax Details", description: "TPS/TVQ numbers", href: "/account/tax" },
  ]

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account</h1>
      </div>

      {/* Profile Card */}
      <Card>
        <CardContent className="flex items-center gap-4 pt-6">
          <Avatar className="size-16 shrink-0">
            <AvatarImage src={avatarUrl ?? undefined} alt={fullName ?? ""} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-lg truncate">{fullName ?? "—"}</p>
            {title && <p className="text-sm text-muted-foreground truncate">{title}</p>}
            {email && <p className="text-sm text-muted-foreground truncate">{email}</p>}
            {status && (
              <div className="mt-1.5">
                <Badge variant={statusVariant[status] ?? "secondary"}>
                  {statusLabel[status] ?? status}
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile & Expertise */}
      <Card>
        <CardContent className="p-0">
          {tiles.map((tile, i) => (
            <div key={tile.href}>
              {i > 0 && <Separator />}
              <Link href={tile.href} className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors">
                <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0">
                  <tile.icon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{tile.label}</p>
                  <p className="text-xs text-muted-foreground">{tile.description}</p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground shrink-0" />
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardContent className="p-0">
          <Link href="/settings/account" className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0">
              <KeyRound className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Security</p>
              <p className="text-xs text-muted-foreground">Password and account settings</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground shrink-0" />
          </Link>
          <Separator />
          <Link href="/admin/verifications" className="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors">
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0">
              <ShieldCheck className="size-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Identity Verification</p>
              <p className="text-xs text-muted-foreground">Verify your identity to unlock all features</p>
            </div>
            <ChevronRight className="size-4 text-muted-foreground shrink-0" />
          </Link>
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Button
        variant="outline"
        className="text-destructive border-destructive/20 hover:bg-destructive/5 w-full"
        onClick={handleLogout}
      >
        <LogOut className="size-4 mr-2" />
        Sign Out
      </Button>
    </div>
  )
}
