"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Loader2, Mail, ShieldCheck, User } from "lucide-react"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"

const passwordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(8, "Must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine(d => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type PasswordValues = z.infer<typeof passwordSchema>

type Props = {
  email: string
  signUpMethod: string | null
  createdAt: string | null
  accountStatus: string | null
  role: string | null
}

const roleLabel: Record<string, string> = {
  ROLE_CLIENT: "Client",
  ROLE_EXPERT: "Expert",
  ROLE_ADMIN:  "Admin",
}

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  ACTIVE:                  "outline",
  VERIFIED:                "outline",
  PENDING_ID_VERIFICATION: "default",
  UNVERIFIED:              "secondary",
}

function fmtDate(d: string | null) {
  if (!d) return "—"
  try { return format(parseISO(d), "MMMM d, yyyy") } catch { return d }
}

export function AccountSettingsClient({ email, signUpMethod, createdAt, accountStatus, role }: Props) {
  const [saving, setSaving] = useState(false)

  const form = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  })

  async function onSubmit(data: PasswordValues) {
    setSaving(true)
    try {
      const res = await fetch("/api/settings/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword: data.oldPassword, newPassword: data.newPassword }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => null)
        throw new Error(body?.message ?? "Failed to change password")
      }
      toast.success("Password changed successfully")
      form.reset()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to change password")
    } finally {
      setSaving(false)
    }
  }

  const isSocialLogin = signUpMethod && signUpMethod.toLowerCase() !== "email"

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and security.</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Information</CardTitle>
          <CardDescription>Your account details and current status.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Mail className="size-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium truncate">{email || "—"}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <User className="size-4 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium">{role ? (roleLabel[role] ?? role) : "—"}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-4 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Account Status</p>
              <div className="mt-0.5">
                {accountStatus ? (
                  <Badge variant={statusVariant[accountStatus] ?? "secondary"}>
                    {accountStatus.replace(/_/g, " ")}
                  </Badge>
                ) : (
                  <p className="text-sm font-medium">—</p>
                )}
              </div>
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Member since</span>
            <span className="font-medium">{fmtDate(createdAt)}</span>
          </div>
          {signUpMethod && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Sign-up method</span>
              <span className="font-medium capitalize">{signUpMethod.toLowerCase()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change Password</CardTitle>
          <CardDescription>
            {isSocialLogin
              ? `You signed up with ${signUpMethod?.toLowerCase()}. Password changes are not available for social logins.`
              : "Keep your account secure with a strong password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSocialLogin ? (
            <p className="text-sm text-muted-foreground">
              To change your password, please use your {signUpMethod?.toLowerCase()} account settings.
            </p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Current Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter current password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="At least 8 characters" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Repeat new password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                    Update Password
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible and destructive actions.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Permanently delete your account and all associated data.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast.error("Please contact support to delete your account.")}
            >
              Delete Account
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
