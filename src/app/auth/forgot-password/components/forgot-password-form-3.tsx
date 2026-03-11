"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/logo"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export function ForgotPasswordForm3({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const { t } = useTranslation()

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })

    const data = await res.json().catch(() => ({}))
    setLoading(false)

    if (!res.ok || !data.ok) {
      setError(data.message ?? "Failed to send reset email. Please try again.")
      return
    }

    setSent(true)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={onSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex justify-center mb-2">
                <Link href="/" className="flex items-center gap-2 font-medium">
                  <Logo />
                </Link>
              </div>
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">{t("auth.forgotPassword.title")}</h1>
                <p className="text-muted-foreground text-balance">
                  {t("auth.forgotPassword.subtitle")}
                </p>
              </div>

              {sent ? (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-center text-green-600 bg-green-50 dark:bg-green-950/20 rounded-md px-3 py-3">
                    {t("auth.forgotPassword.sentMessage", { email })}
                  </p>
                  <p className="text-center text-sm text-muted-foreground">
                    {t("auth.forgotPassword.didntReceive")}{" "}
                    <button
                      type="button"
                      className="underline underline-offset-4 hover:text-primary"
                      onClick={() => setSent(false)}
                    >
                      {t("auth.forgotPassword.tryAgain")}
                    </button>
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid gap-3">
                    <Label htmlFor="email">{t("common.email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-600 bg-red-50 dark:bg-red-950/20 rounded-md px-3 py-2">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? t("auth.forgotPassword.sending") : t("auth.forgotPassword.sendLink")}
                  </Button>
                </>
              )}

              <div className="text-center text-sm">
                {t("auth.forgotPassword.rememberPassword")}{" "}
                <Link
                  href="/auth/sign-in"
                  className="underline underline-offset-4"
                >
                  {t("auth.forgotPassword.backToSignIn")}
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <Image
              src="https://ui.shadcn.com/placeholder.svg"
              alt="Image"
              fill
              className="object-cover dark:brightness-[0.95] dark:invert"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t("auth.forgotPassword.needHelp")} <a href="#">{t("auth.forgotPassword.contactSupport")}</a>
      </div>
    </div>
  )
}
