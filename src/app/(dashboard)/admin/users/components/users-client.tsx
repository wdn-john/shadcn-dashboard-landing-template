"use client"

import { useState } from "react"
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

const statusLabel: Record<AccountStatus, string> = {
  UNVERIFIED:               "Unverified",
  PENDING_ID_VERIFICATION:  "Pending ID",
  VERIFIED:                 "Verified",
  ACTIVE:                   "Active",
}

type Props = {
  initialProfiles: ProfileItem[]
}

export function UsersClient({ initialProfiles }: Props) {
  const [profiles, setProfiles] = useState(initialProfiles)
  const [search, setSearch] = useState("")
  const [updating, setUpdating] = useState<string | null>(null)

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
      toast.success("Account status updated")
    } catch {
      toast.error("Failed to update status")
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

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Users</h1>
        <p className="text-muted-foreground mt-1">{profiles.length} registered profiles</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search by name, email or membership..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {[
        { label: "Experts", items: experts },
        { label: "Clients", items: clients },
        ...(others.length > 0 ? [{ label: "Other", items: others }] : []),
      ].map(({ label, items }) => (
        <Card key={label}>
          <CardHeader>
            <CardTitle className="text-base">{label}</CardTitle>
            <CardDescription>{items.length} user{items.length !== 1 ? "s" : ""}</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground px-6 py-8 text-center">No {label.toLowerCase()} found</p>
            ) : (
              <div className="divide-y">
                {items.map(profile => (
                  <UserRow
                    key={profile.id}
                    profile={profile}
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
  updating,
  onStatusChange,
}: {
  profile: ProfileItem
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
            {ACCOUNT_STATUSES.map(s => (
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
