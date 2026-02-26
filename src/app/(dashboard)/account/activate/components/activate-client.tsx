"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, BadgeCheck, Info, Loader2 } from "lucide-react"
import { toast } from "sonner"

type Props = {
  accountStatus: string | null
}

// Format raw input as XXXX-XXXX
function formatMembership(raw: string): string {
  const digits = raw.replace(/[^a-zA-Z0-9]/g, "").toUpperCase().slice(0, 8)
  if (digits.length <= 4) return digits
  return `${digits.slice(0, 4)}-${digits.slice(4)}`
}

export function ActivateClient({ accountStatus }: Props) {
  const [value, setValue] = useState("")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const isAlreadyActive = accountStatus === "ACTIVE" || accountStatus === "VERIFIED"
  const formatted = formatMembership(value)
  const rawClean = formatted.replace("-", "")
  const isComplete = rawClean.length === 8

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setValue(e.target.value)
  }

  async function handleActivate() {
    if (!isComplete) return
    setSaving(true)
    try {
      const res = await fetch("/api/profile/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ membershipNumber: formatted }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message ?? "Invalid membership number")
      }
      setSuccess(true)
      toast.success("Account activated successfully!")
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Activation failed")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link href="/account"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activate Account</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Enter your membership number to activate your account.</p>
        </div>
      </div>

      {isAlreadyActive ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <BadgeCheck className="size-10 text-green-500" />
            <p className="font-semibold text-lg">Account is active</p>
            <p className="text-sm text-muted-foreground">Your account is already activated and in good standing.</p>
          </CardContent>
        </Card>
      ) : success ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <BadgeCheck className="size-10 text-green-500" />
            <p className="font-semibold text-lg">Account Activated!</p>
            <p className="text-sm text-muted-foreground">Your account has been successfully activated.</p>
            <Button asChild className="mt-2">
              <Link href="/account">Back to Account</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
            <Info className="size-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              Your membership number was provided when you joined Workedin. It is formatted as <span className="font-mono font-medium">XXXX-XXXX</span>. Contact support if you haven&apos;t received yours.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Membership Number</CardTitle>
              <CardDescription>Enter the 8-character code from your welcome email.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid gap-1.5">
                <Label htmlFor="membership">Membership Number</Label>
                <Input
                  id="membership"
                  placeholder="XXXX-XXXX"
                  value={formatted}
                  onChange={handleChange}
                  className="font-mono text-base tracking-widest max-w-xs"
                  maxLength={9}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  disabled={saving || !isComplete}
                  onClick={handleActivate}
                  className="min-w-28"
                >
                  {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                  Activate
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
