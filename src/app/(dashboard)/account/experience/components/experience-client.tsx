"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Pencil, Trash2, Briefcase, Loader2 } from "lucide-react"
import { format, parseISO } from "date-fns"
import { toast } from "sonner"
import type { Experience } from "../page"

type FormState = {
  title: string
  company: string
  location: string
  description: string
  startDate: string
  endDate: string
  current: boolean
}

const emptyForm: FormState = {
  title: "", company: "", location: "", description: "",
  startDate: "", endDate: "", current: false,
}

function fmtDate(d: string | undefined) {
  if (!d) return ""
  try { return format(parseISO(d), "MMM yyyy") } catch { return d }
}

export function ExperienceClient({ initialExperiences }: { initialExperiences: Experience[] }) {
  const [items, setItems] = useState(initialExperiences)
  const [dialog, setDialog] = useState<"add" | "edit" | "delete" | null>(null)
  const [selected, setSelected] = useState<Experience | null>(null)
  const [form, setForm] = useState<FormState>(emptyForm)
  const [saving, setSaving] = useState(false)

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }))
  }

  function openAdd() {
    setForm(emptyForm)
    setSelected(null)
    setDialog("add")
  }

  function openEdit(item: Experience) {
    setForm({
      title: item.title,
      company: item.company,
      location: item.location ?? "",
      description: item.description ?? "",
      startDate: item.startDate ? item.startDate.slice(0, 10) : "",
      endDate: item.endDate ? item.endDate.slice(0, 10) : "",
      current: item.current,
    })
    setSelected(item)
    setDialog("edit")
  }

  async function handleSave() {
    if (!form.title.trim() || !form.company.trim() || !form.startDate) return
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        company: form.company,
        location: form.location || undefined,
        description: form.description || undefined,
        startDate: form.startDate,
        endDate: form.current ? undefined : (form.endDate || undefined),
        current: form.current,
      }

      if (dialog === "add") {
        const res = await fetch("/api/experiences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) throw new Error()
        const created = Array.isArray(data) ? data[0] : data
        if (created) setItems(prev => [created, ...prev])
        toast.success("Experience added")
      } else if (selected) {
        const res = await fetch(`/api/experiences/${selected.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json().catch(() => null)
        if (!res.ok) throw new Error()
        setItems(prev => prev.map(x => x.id === selected.id ? { ...x, ...data } : x))
        toast.success("Experience updated")
      }
      setDialog(null)
    } catch {
      toast.error("Failed to save experience")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!selected) return
    setSaving(true)
    try {
      const res = await fetch(`/api/experiences/${selected.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setItems(prev => prev.filter(x => x.id !== selected.id))
      toast.success("Experience removed")
      setDialog(null)
    } catch {
      toast.error("Failed to remove experience")
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
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">Experience</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">Your work history and projects.</p>
        </div>
        <Button size="sm" onClick={openAdd}>
          <Plus className="size-4 mr-1.5" /> Add
        </Button>
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <Briefcase className="size-8 text-muted-foreground" />
            <p className="font-medium">No experience yet</p>
            <p className="text-sm text-muted-foreground">Add your work history to strengthen your profile.</p>
            <Button size="sm" onClick={openAdd} className="mt-1">Add Experience</Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            {items.map((item, i) => (
              <div key={item.id}>
                {i > 0 && <Separator />}
                <div className="flex gap-4 px-5 py-4">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-muted shrink-0 mt-0.5">
                    <Briefcase className="size-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.company}</p>
                    {item.location && (
                      <p className="text-xs text-muted-foreground">{item.location}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {fmtDate(item.startDate)} – {item.current ? "Present" : fmtDate(item.endDate)}
                    </p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="size-8" onClick={() => openEdit(item)}>
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="size-8 text-destructive hover:text-destructive"
                      onClick={() => { setSelected(item); setDialog("delete") }}>
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Add / Edit */}
      <Dialog open={dialog === "add" || dialog === "edit"} onOpenChange={open => !open && setDialog(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{dialog === "add" ? "Add Experience" : "Edit Experience"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-1.5">
              <Label>Job Title *</Label>
              <Input placeholder="e.g. Senior IT Consultant" value={form.title} onChange={set("title")} />
            </div>
            <div className="grid gap-1.5">
              <Label>Company *</Label>
              <Input placeholder="Company name" value={form.company} onChange={set("company")} />
            </div>
            <div className="grid gap-1.5">
              <Label>Location</Label>
              <Input placeholder="e.g. Montreal, QC" value={form.location} onChange={set("location")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-1.5">
                <Label>Start Date *</Label>
                <Input type="date" value={form.startDate} onChange={set("startDate")} />
              </div>
              <div className="grid gap-1.5">
                <Label>End Date</Label>
                <Input type="date" value={form.endDate} onChange={set("endDate")} disabled={form.current} />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="current">I currently work here</Label>
              <Switch
                id="current"
                checked={form.current}
                onCheckedChange={v => setForm(f => ({ ...f, current: v, endDate: v ? "" : f.endDate }))}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your responsibilities and achievements..."
                rows={3}
                value={form.description}
                onChange={set("description")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
            <Button disabled={saving || !form.title.trim() || !form.company.trim() || !form.startDate} onClick={handleSave}>
              {saving && <Loader2 className="size-4 mr-2 animate-spin" />}
              {dialog === "add" ? "Add" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete */}
      <Dialog open={dialog === "delete"} onOpenChange={open => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Experience</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remove <strong>{selected?.title}</strong> at <strong>{selected?.company}</strong>? This cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>Cancel</Button>
            <Button variant="destructive" disabled={saving} onClick={handleDelete}>Remove</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
