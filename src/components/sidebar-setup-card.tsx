"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShieldAlert, CreditCard, X } from "lucide-react"
import type { UserRole } from "@/types/auth"
import { useTranslation } from "react-i18next"

interface Props {
  accountStatus: string | null
  role?: UserRole
}

export function SidebarSetupCard({ accountStatus, role }: Props) {
  const [stripeConnected, setStripeConnected] = useState<boolean | null>(null)
  const [dismissed, setDismissed] = useState(false)
  const { t } = useTranslation()

  const isExpert = role === "ROLE_EXPERT"
  const isVerified = accountStatus === "VERIFIED" || accountStatus === "ACTIVE"

  useEffect(() => {
    if (!isExpert) return
    fetch("/api/stripe/connect")
      .then((r) => r.json())
      .then((d) => {
        setStripeConnected(
          (d as { connected?: boolean; status?: string }).connected === true ||
          (d as { status?: string }).status === "CONNECTED"
        )
      })
      .catch(() => setStripeConnected(false))
  }, [isExpert])

  if (!isExpert || dismissed) return null

  const needsVerification = !isVerified
  // Only show Stripe row once we know it's not connected
  const needsStripe = stripeConnected === false

  if (!needsVerification && !needsStripe) return null

  return (
    <div className="mx-2 mb-2 rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-800/40 dark:bg-amber-950/20 p-3">
      <div className="flex items-start justify-between gap-2 mb-2.5">
        <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 leading-tight">
          {t("sidebarSetup.title")}
        </p>
        <button
          onClick={() => setDismissed(true)}
          className="text-amber-600 hover:text-amber-900 dark:text-amber-400 dark:hover:text-amber-200 shrink-0 mt-px"
          aria-label={t("sidebarSetup.dismiss")}
        >
          <X className="size-3" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {needsVerification && (
          <Link
            href="/account/status"
            className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 hover:underline"
          >
            <ShieldAlert className="size-3.5 shrink-0" />
            {t("sidebarSetup.verifyIdentity")}
          </Link>
        )}

        {needsStripe && (
          <button
            className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-200 hover:underline text-left"
            onClick={() => {
              fetch("/api/stripe/connect", { method: "POST" })
                .then((r) => r.json())
                .then((d) => {
                  if ((d as { url?: string }).url) {
                    window.open((d as { url: string }).url, "_blank")
                  }
                })
                .catch(() => {})
            }}
          >
            <CreditCard className="size-3.5 shrink-0" />
            {t("sidebarSetup.setupStripe")}
          </button>
        )}
      </div>
    </div>
  )
}
