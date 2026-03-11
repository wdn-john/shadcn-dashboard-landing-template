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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"
import type { PromoCode } from "../page"

type Props = {
  initialCodes: PromoCode[]
}

type FormState = {
  code: string
  discountValue: string
}

const emptyForm: FormState = { code: "", discountValue: "" }

export function PromoCodesClient({ initialCodes }: Props) {
  const { t } = useTranslation()
  const [codes, setCodes] = useState(initialCodes)
  const [dialog, setDialog] = useState<"create" | "edit" | "delete" | null>(null)
  const [selected, setSelected] = useState<PromoCode | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  function openCreate() {
    setForm(emptyForm)
    setSelected(null)
    setDialog("create")
  }

  function openEdit(code: PromoCode) {
    setForm({ code: code.code, discountValue: String(code.discountValue) })
    setSelected(code)
    setDialog("edit")
  }

  function openDelete(code: PromoCode) {
    setSelected(code)
    setDialog("delete")
  }

  async function handleCreate() {
    if (!form.code.trim() || !form.discountValue) return
    setSaving(true)
    try {
      const res = await fetch("/api/admin/promo-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.code.trim().toUpperCase(), discountValue: parseFloat(form.discountValue), used: false }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        toast.error(typeof data === "string" ? data : t("admin.promoCodes.createFailed"))
        return
      }
      setCodes(prev => [data, ...prev])
      toast.success(t("admin.promoCodes.created"))
      setDialog(null)
    } catch {
      toast.error(t("admin.promoCodes.createFailed"))
    } finally {
      setSaving(false)
    }
  }

  async function handleEdit() {
    if (!selected || !form.code.trim() || !form.discountValue) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/promo-codes/${selected.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: form.code.trim().toUpperCase(), discountValue: parseFloat(form.discountValue), used: selected.used }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) {
        toast.error(t("admin.promoCodes.updateFailed"))
        return
      }
      setCodes(prev => prev.map(c => c.id === selected.id ? data : c))
      toast.success(t("admin.promoCodes.updated"))
      setDialog(null)
    } catch {
      toast.error(t("admin.promoCodes.updateFailed"))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/promo-codes/${selected.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setCodes(prev => prev.filter(c => c.id !== selected.id))
      toast.success(t("admin.promoCodes.deleted"))
      setDialog(null)
    } catch {
      toast.error(t("admin.promoCodes.deleteFailed"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("admin.promoCodes.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("admin.promoCodes.codeCount", { n: codes.length })}</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="size-4 mr-2" />
          {t("admin.promoCodes.newCode")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("admin.promoCodes.allCodes")}</CardTitle>
          <CardDescription>{t("admin.promoCodes.allCodesDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {codes.length === 0 ? (
            <p className="text-sm text-muted-foreground px-6 py-8 text-center">{t("admin.promoCodes.noCodes")}</p>
          ) : (
            <div className="divide-y">
              {codes.map(code => (
                <div key={code.id} className="flex items-center gap-4 px-6 py-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-mono font-semibold text-sm">{code.code}</p>
                    <p className="text-xs text-muted-foreground">
                      {t("admin.promoCodes.discountPercent", { n: code.discountValue })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge variant={code.used ? "secondary" : "outline"}>
                      {code.used ? t("admin.promoCodes.used") : t("admin.promoCodes.available")}
                    </Badge>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={() => openEdit(code)}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => openDelete(code)}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialog === "create" || dialog === "edit"}
        onOpenChange={open => !open && setDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog === "create" ? t("admin.promoCodes.createTitle") : t("admin.promoCodes.editTitle")}</DialogTitle>
            <DialogDescription>
              {dialog === "create" ? t("admin.promoCodes.createDesc") : t("admin.promoCodes.editDesc")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label htmlFor="code">{t("admin.promoCodes.code")}</Label>
              <Input
                id="code"
                placeholder={t("admin.promoCodes.codePlaceholder")}
                value={form.code}
                onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="discount">{t("admin.promoCodes.discountLabel")}</Label>
              <Input
                id="discount"
                type="number"
                min={1}
                max={100}
                placeholder={t("admin.promoCodes.discountPlaceholder")}
                value={form.discountValue}
                onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>{t("common.cancel")}</Button>
            <Button
              disabled={saving || !form.code.trim() || !form.discountValue}
              onClick={dialog === "create" ? handleCreate : handleEdit}
            >
              {dialog === "create" ? t("common.add") : t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={dialog === "delete"} onOpenChange={open => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("admin.promoCodes.deleteTitle")}</DialogTitle>
            <DialogDescription>
              {t("admin.promoCodes.deleteConfirm", { code: selected?.code ?? "" })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>{t("common.cancel")}</Button>
            <Button variant="destructive" disabled={saving} onClick={handleDelete}>
              {t("common.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
