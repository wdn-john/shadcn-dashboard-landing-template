"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, X, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { SkillItem, CertItem } from "../page"

type Props = {
  initialSkills: SkillItem[]
  initialCerts: CertItem[]
}

function TagList({
  items,
  onRemove,
  removing,
}: {
  items: { id: string; name: string }[]
  onRemove: (id: string) => void
  removing: string | null
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(item => (
        <Badge key={item.id} variant="secondary" className="gap-1.5 pr-1.5 py-1 text-sm">
          {item.name}
          <button
            type="button"
            className="rounded-full hover:bg-muted-foreground/20 p-0.5 transition-colors"
            disabled={removing === item.id}
            onClick={() => onRemove(item.id)}
          >
            {removing === item.id
              ? <Loader2 className="size-3 animate-spin" />
              : <X className="size-3" />}
          </button>
        </Badge>
      ))}
    </div>
  )
}

function AddInput({
  placeholder,
  onAdd,
  adding,
}: {
  placeholder: string
  onAdd: (name: string) => void
  adding: boolean
}) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setValue("")
    inputRef.current?.focus()
  }

  return (
    <div className="flex gap-2 mt-3">
      <Input
        ref={inputRef}
        placeholder={placeholder}
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === "Enter" && submit()}
        className="max-w-xs"
      />
      <Button size="sm" variant="outline" disabled={adding || !value.trim()} onClick={submit}>
        {adding ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
      </Button>
    </div>
  )
}

export function SkillsClient({ initialSkills, initialCerts }: Props) {
  const { t } = useTranslation()
  const [skills, setSkills] = useState(initialSkills)
  const [certs, setCerts]   = useState(initialCerts)
  const [addingSkill, setAddingSkill] = useState(false)
  const [addingCert, setAddingCert]   = useState(false)
  const [removingSkill, setRemovingSkill] = useState<string | null>(null)
  const [removingCert, setRemovingCert]   = useState<string | null>(null)

  async function addSkill(name: string) {
    setAddingSkill(true)
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error()
      const created = Array.isArray(data) ? data[0] : data
      if (created) setSkills(prev => [...prev, created])
      toast.success(t("skills.skillAdded"))
    } catch {
      toast.error(t("skills.skillAddFailed"))
    } finally {
      setAddingSkill(false)
    }
  }

  async function removeSkill(id: string) {
    setRemovingSkill(id)
    try {
      const res = await fetch(`/api/skills/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setSkills(prev => prev.filter(s => s.id !== id))
      toast.success(t("skills.skillRemoved"))
    } catch {
      toast.error(t("skills.skillRemoveFailed"))
    } finally {
      setRemovingSkill(null)
    }
  }

  async function addCert(name: string) {
    setAddingCert(true)
    try {
      const res = await fetch("/api/certifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      const data = await res.json().catch(() => null)
      if (!res.ok) throw new Error()
      const created = Array.isArray(data) ? data[0] : data
      if (created) setCerts(prev => [...prev, created])
      toast.success(t("skills.certAdded"))
    } catch {
      toast.error(t("skills.certAddFailed"))
    } finally {
      setAddingCert(false)
    }
  }

  async function removeCert(id: string) {
    setRemovingCert(id)
    try {
      const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      setCerts(prev => prev.filter(c => c.id !== id))
      toast.success(t("skills.certRemoved"))
    } catch {
      toast.error(t("skills.certRemoveFailed"))
    } finally {
      setRemovingCert(null)
    }
  }

  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="-ml-2">
          <Link href="/account"><ArrowLeft className="size-4" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t("skills.title")}</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">{t("skills.subtitle")}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("skills.skillsSection")}</CardTitle>
          <CardDescription>{skills.length} {t("skills.skillsSection").toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          {skills.length > 0
            ? <TagList items={skills} onRemove={removeSkill} removing={removingSkill} />
            : <p className="text-sm text-muted-foreground">{t("skills.noSkills")}</p>
          }
          <AddInput placeholder={t("skills.skillPlaceholder")} onAdd={addSkill} adding={addingSkill} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("skills.certificationsSection")}</CardTitle>
          <CardDescription>{certs.length} {t("skills.certificationsSection").toLowerCase()}</CardDescription>
        </CardHeader>
        <CardContent>
          {certs.length > 0
            ? <TagList items={certs} onRemove={removeCert} removing={removingCert} />
            : <p className="text-sm text-muted-foreground">{t("skills.noCerts")}</p>
          }
          <AddInput placeholder={t("skills.certPlaceholder")} onAdd={addCert} adding={addingCert} />
        </CardContent>
      </Card>
    </div>
  )
}
