"use client"

import { useState } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Info, Loader2 } from "lucide-react"
import { toast } from "sonner"

type Props = {
  initialTpsNumber: string
  initialTvqNumber: string
  initialIsTaxRegistered: boolean
}

export function TaxDetailsClient({ initialTpsNumber, initialTvqNumber, initialIsTaxRegistered }: Props) {
  const { t } = useTranslation()
  const [tpsNumber, setTpsNumber] = useState(initialTpsNumber)
  const [tvqNumber, setTvqNumber] = useState(initialTvqNumber)
  const [isEditing, setIsEditing] = useState(!initialIsTaxRegistered)
  const [saving, setSaving] = useState(false)

  const hasExisting = !!(initialTpsNumber || initialTvqNumber)

  async function handleSave() {
    if (!tpsNumber.trim() || !tvqNumber.trim()) {
      toast.error(t("tax.bothRequired"))
      return
    }
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tpsNumber, tvqNumber: tvqNumber, isTaxRegistered: true }),
      })
      if (!res.ok) throw new Error()
      toast.success(t("tax.saved"))
      setIsEditing(false)
    } catch {
      toast.error(t("tax.failed"))
    } finally {
      setSaving(false)
    }
  }

  function handleCancel() {
    setTpsNumber(initialTpsNumber)
    setTvqNumber(initialTvqNumber)
    setIsEditing(false)
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link href="/account"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("tax.title")}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{t("tax.subtitle")}</p>
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-lg border bg-muted/40 p-4">
        <Info className="size-4 text-muted-foreground mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          {t("tax.taxInfo")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("tax.taxRegNumbers")}</CardTitle>
          {hasExisting && !isEditing && (
            <CardDescription>{t("tax.taxRegistered")}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="tps">{t("tax.tpsLabel")}</Label>
            <Input
              id="tps"
              placeholder="e.g. 123456789 RT 0001"
              value={tpsNumber}
              onChange={e => setTpsNumber(e.target.value)}
              readOnly={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
            />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="tvq">{t("tax.tvqLabel")}</Label>
            <Input
              id="tvq"
              placeholder="e.g. 1234567890 TQ 0001"
              value={tvqNumber}
              onChange={e => setTvqNumber(e.target.value)}
              readOnly={!isEditing}
              className={!isEditing ? "bg-muted" : ""}
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            {isEditing ? (
              <>
                {hasExisting && (
                  <Button variant="outline" onClick={handleCancel}>{t("common.cancel")}</Button>
                )}
                <Button disabled={saving || !tpsNumber.trim() || !tvqNumber.trim()} onClick={handleSave}>
                  {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
                  {t("tax.save")}
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>{t("tax.modify")}</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
