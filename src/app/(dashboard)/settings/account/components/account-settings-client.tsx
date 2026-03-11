"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
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

type Props = {
  email: string
  signUpMethod: string | null
  createdAt: string | null
  accountStatus: string | null
  role: string | null
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
  const { t } = useTranslation()
  const [saving, setSaving] = useState(false)

  const roleLabel: Record<string, string> = {
    ROLE_CLIENT: t("settings.account.roleClient"),
    ROLE_EXPERT: t("settings.account.roleExpert"),
    ROLE_ADMIN:  t("settings.account.roleAdmin"),
  }

  const passwordSchema = z
    .object({
      oldPassword: z.string().min(1, t("settings.account.oldPasswordRequired")),
      newPassword: z.string().min(8, t("settings.account.newPasswordMin")),
      confirmPassword: z.string().min(1, t("settings.account.confirmPasswordRequired")),
    })
    .refine(d => d.newPassword === d.confirmPassword, {
      message: t("settings.account.passwordsMismatch"),
      path: ["confirmPassword"],
    })

  type PasswordValues = z.infer<typeof passwordSchema>

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
        throw new Error(body?.message ?? t("settings.account.passwordFailed"))
      }
      toast.success(t("settings.account.passwordUpdated"))
      form.reset()
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : t("settings.account.passwordFailed"))
    } finally {
      setSaving(false)
    }
  }

  const isSocialLogin = signUpMethod && signUpMethod.toLowerCase() !== "email"

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("settings.account.title")}</h1>
        <p className="text-muted-foreground mt-1">{t("settings.account.manageSubtitle")}</p>
      </div>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("settings.account.accountInfo")}</CardTitle>
          <CardDescription>{t("settings.account.accountInfoDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Mail className="size-4 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground">{t("settings.account.emailLabel")}</p>
              <p className="text-sm font-medium truncate">{email || "—"}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <User className="size-4 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{t("settings.account.roleLabel")}</p>
              <p className="text-sm font-medium">{role ? (roleLabel[role] ?? role) : "—"}</p>
            </div>
          </div>
          <Separator />
          <div className="flex items-center gap-3">
            <ShieldCheck className="size-4 text-muted-foreground shrink-0" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{t("settings.account.statusLabel")}</p>
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
            <span className="text-muted-foreground">{t("settings.account.memberSince")}</span>
            <span className="font-medium">{fmtDate(createdAt)}</span>
          </div>
          {signUpMethod && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("settings.account.signUpMethod")}</span>
              <span className="font-medium capitalize">{signUpMethod.toLowerCase()}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("settings.account.changePassword")}</CardTitle>
          <CardDescription>
            {isSocialLogin
              ? t("settings.account.socialLoginDesc", { method: signUpMethod?.toLowerCase() })
              : t("settings.account.passwordDesc")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSocialLogin ? (
            <p className="text-sm text-muted-foreground">
              {t("settings.account.socialLoginBody", { method: signUpMethod?.toLowerCase() })}
            </p>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="oldPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("settings.account.oldPassword")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t("settings.account.oldPasswordPlaceholder")} {...field} />
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
                      <FormLabel>{t("settings.account.newPassword")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t("settings.account.newPasswordPlaceholder")} {...field} />
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
                      <FormLabel>{t("settings.account.confirmPassword")}</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder={t("settings.account.confirmPasswordPlaceholder")} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end pt-2">
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                    {t("settings.account.updatePassword")}
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
          <CardTitle className="text-base text-destructive">{t("settings.account.dangerZone")}</CardTitle>
          <CardDescription>{t("settings.account.dangerDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div>
              <p className="text-sm font-medium">{t("settings.account.deleteAccount")}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("settings.account.deleteAccountDesc")}
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => toast.error(t("settings.account.deleteAccountContact"))}
            >
              {t("settings.account.deleteAccount")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
