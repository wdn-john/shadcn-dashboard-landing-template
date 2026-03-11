"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search } from "lucide-react"
import { toast } from "sonner"
import type { ProfileItem } from "../page"

const ACCOUNT_STATUSES = ["UNVERIFIED", "PENDING_ID_VERIFICATION", "VERIFIED", "ACTIVE"] as const
type AccountStatus = typeof ACCOUNT_STATUSES[number]

const statusVariant: Record<AccountStatus, "default" | "secondary" | "outline" | "destructive"> = {
  UNVERIFIED:               "secondary",
  PENDING_ID_VERIFICATION:  "default",
  VERIFIED:                 "outline",
  ACTIVE:                   "outline",
}

type Props = {
  initialProfiles: ProfileItem[]
}

export function UsersClient({ initialProfiles }: Props) {
  const { t } = useTranslation()
  const [profiles, setProfiles] = useState(initialProfiles)
  const [search, setSearch] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)

  const statusLabel: Record<AccountStatus, string> = {
    UNVERIFIED:               t("account.status.UNVERIFIED"),
    PENDING_ID_VERIFICATION:  t("account.status.PENDING"),
    VERIFIED:                 t("account.status.VERIFIED"),
    ACTIVE:                   t("account.status.ACTIVE"),
  }

  async function handleStatusChange(id: string, accountStatus: AccountStatus) {
    setUpdating(id)
    try {
      const res = await fetch(`/api/admin/users/${id}/account-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountStatus }),
      })
      if (!res.ok) throw new Error()
      setProfiles(prev =>
        prev.map(p => p.id === id ? { ...p, accountStatus } : p)
      )
      toast.success(t("admin.users.statusUpdated"))
    } catch {
      toast.error(t("admin.users.statusFailed"))
    } finally {
      setUpdating(null)
    }
  }

  const filtered = profiles.filter(p => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      p.fullName?.toLowerCase().includes(q) ||
      p.user?.email?.toLowerCase().includes(q) ||
      p.membershipNumber?.toLowerCase().includes(q)
    )
  })

  const experts = filtered.filter(p => p.userType === "expert")
  const clients = filtered.filter(p => p.userType === "client")
  const others  = filtered.filter(p => !p.userType)

  const groups = [
    { label: t("admin.users.experts"), items: experts },
    { label: t("admin.users.clients"), items: clients },
    ...(others.length > 0 ? [{ label: t("admin.users.other"), items: others }] : []),
  ]

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("admin.users.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("admin.users.registeredProfiles", { n: profiles.length })}</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder={t("admin.users.searchPlaceholder")}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {groups.map(({ label, items }) => (
        <Card key={label}>
          <CardHeader>
            <CardTitle className="text-base">{label}</CardTitle>
            <CardDescription>{t("admin.users.userCount", { n: items.length })}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground px-6 py-8 text-center">{t("common.noResults")}</p>
            ) : (
              <div className="divide-y">
                {items.map(profile => (
                  <UserRow
                    key={profile.id}
                    profile={profile}
                    statusLabel={statusLabel}
                    updating={updating === profile.id}
                    onStatusChange={(status) => handleStatusChange(profile.id, status)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function UserRow({
  profile,
  statusLabel,
  updating,
  onStatusChange,
}: {
  profile: ProfileItem
  statusLabel: Record<AccountStatus, string>
  updating: boolean
  onStatusChange: (status: AccountStatus) => void
}) {
  const status = (profile.accountStatus as AccountStatus) ?? "UNVERIFIED"
  const badge = statusVariant[status] ?? "secondary"
  const label = statusLabel[status] ?? status

  return (
    <div className="flex items-center gap-4 px-6 py-4">
      <Avatar className="size-9 shrink-0">
        <AvatarImage src={profile.avatarUrl ?? undefined} alt={profile.fullName} />
        <AvatarFallback>{profile.fullName?.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{profile.fullName ?? "—"}</p>
        <p className="text-xs text-muted-foreground truncate">{profile.user?.email ?? "—"}</p>
        {profile.membershipNumber && (
          <p className="text-xs text-muted-foreground font-mono">{profile.membershipNumber}</p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <Badge variant={badge} className="hidden sm:flex">{label}</Badge>
        <Select
          value={status}
          onValueChange={(v) => onStatusChange(v as AccountStatus)}
          disabled={updating}
        >
          <SelectTrigger className="w-44 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {(["UNVERIFIED", "PENDING_ID_VERIFICATION", "VERIFIED", "ACTIVE"] as AccountStatus[]).map(s => (
              <SelectItem key={s} value={s} className="text-xs">
                {statusLabel[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
