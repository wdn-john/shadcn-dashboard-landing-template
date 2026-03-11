"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProfileSetupStore, ExperienceLevel } from "@/store/profileSetupStore"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

const PROFESSIONS = [
  { value: "networking", label: "Networking & Infrastructure" },
  { value: "webdev", label: "Web & Software Development" },
  { value: "design", label: "UX/UI Design" },
  { value: "cybersecurity", label: "Cybersecurity" },
]

const CATEGORIES: Record<string, string[]> = {
  networking: ["Network Administration", "Cloud Infrastructure", "DevOps", "Systems Administration"],
  webdev: ["Frontend Development", "Backend Development", "Full Stack", "Mobile Development", "Database Administration"],
  design: ["UX Research", "UI Design", "Product Design", "Graphic Design"],
  cybersecurity: ["Penetration Testing", "Security Auditing", "Incident Response", "Compliance & Risk"],
}

const EXPERIENCE_LEVELS: ExperienceLevel[] = ["Junior", "Mid", "Senior", "Expert"]

const expertSchema = z.object({
  profession: z.string().min(1, "Select a profession"),
  category: z.string().min(1, "Select a category"),
  experienceLevel: z.enum(["Junior", "Mid", "Senior", "Expert"]),
  yearsExperience: z.number().min(0).max(50),
  hourlyRate: z.string().optional(),
})

type ExpertForm = z.infer<typeof expertSchema>

export function Step3Expertise() {
  const { t } = useTranslation()
  const { accountType, expertise, setExpertise, nextStep, prevStep } = useProfileSetupStore()
  const isExpert = accountType === "expert"

  const [skillInput, setSkillInput] = useState("")
  const [certInput, setCertInput] = useState("")
  const [softwareInput, setSoftwareInput] = useState("")
  const [skills, setSkills] = useState<string[]>(expertise.skills)
  const [certifications, setCertifications] = useState<string[]>(expertise.certifications)
  const [softwares, setSoftwares] = useState<string[]>(expertise.frequentlyUsedSoftwares)
  const [selectedProfession, setSelectedProfession] = useState(expertise.profession)

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<ExpertForm>({
    resolver: zodResolver(expertSchema),
    defaultValues: {
      profession: expertise.profession,
      category: expertise.category,
      experienceLevel: expertise.experienceLevel,
      yearsExperience: expertise.yearsExperience,
      hourlyRate: expertise.hourlyRate,
    },
  })

  function addTag(
    input: string,
    setInput: (v: string) => void,
    list: string[],
    setList: (v: string[]) => void
  ) {
    const val = input.trim()
    if (val && !list.includes(val)) setList([...list, val])
    setInput("")
  }

  function removeTag(list: string[], setList: (v: string[]) => void, item: string) {
    setList(list.filter((s) => s !== item))
  }

  function onSubmit(data: ExpertForm) {
    if (isExpert && skills.length < 3) return
    setExpertise({
      ...data,
      skills,
      certifications,
      frequentlyUsedSoftwares: softwares,
    })
    nextStep()
  }

  function onClientContinue() {
    setExpertise({ frequentlyUsedSoftwares: softwares })
    nextStep()
  }

  return (
    <div className="space-y-5">
      {isExpert ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("profileSetup.step3.profession")}</Label>
              <Select
                defaultValue={expertise.profession}
                onValueChange={(v) => {
                  setValue("profession", v)
                  setValue("category", "")
                  setSelectedProfession(v)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("profileSetup.step3.selectProfession")} />
                </SelectTrigger>
                <SelectContent>
                  {PROFESSIONS.map((p) => (
                    <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.profession && <p className="text-xs text-destructive">{errors.profession.message}</p>}
            </div>

            <div className="space-y-2">
              <Label>{t("profileSetup.step3.category")}</Label>
              <Select
                defaultValue={expertise.category}
                onValueChange={(v) => setValue("category", v)}
                disabled={!selectedProfession}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("profileSetup.step3.selectCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {(CATEGORIES[selectedProfession] ?? []).map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("profileSetup.step3.skills")} <span className="text-muted-foreground text-xs">{t("profileSetup.step3.skillsMin")}</span></Label>
            <div className="flex gap-2">
              <Input
                placeholder={t("profileSetup.step3.skillsPlaceholder")}
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(skillInput, setSkillInput, skills, setSkills)
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => addTag(skillInput, setSkillInput, skills, setSkills)}>
                {t("profileSetup.step3.add")}
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {skills.map((s) => (
                  <Badge key={s} variant="secondary" className="gap-1">
                    {s}
                    <button type="button" onClick={() => removeTag(skills, setSkills, s)}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
            {skills.length < 3 && (
              <p className="text-xs text-muted-foreground">{t("profileSetup.step3.moreRequired", { n: 3 - skills.length })}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>{t("profileSetup.step3.certifications")} <span className="text-muted-foreground">{t("profileSetup.step3.optional")}</span></Label>
            <div className="flex gap-2">
              <Input
                placeholder={t("profileSetup.step3.certsPlaceholder")}
                value={certInput}
                onChange={(e) => setCertInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addTag(certInput, setCertInput, certifications, setCertifications)
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={() => addTag(certInput, setCertInput, certifications, setCertifications)}>
                {t("profileSetup.step3.add")}
              </Button>
            </div>
            {certifications.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {certifications.map((c) => (
                  <Badge key={c} variant="secondary" className="gap-1">
                    {c}
                    <button type="button" onClick={() => removeTag(certifications, setCertifications, c)}>
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("profileSetup.step3.experienceLevel")}</Label>
              <div className="grid grid-cols-2 gap-2">
                {EXPERIENCE_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setValue("experienceLevel", lvl)}
                    className={cn(
                      "rounded-lg border-2 px-3 py-2 text-sm font-medium transition-all",
                      watch("experienceLevel") === lvl
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsExperience">{t("profileSetup.step3.yearsExperience")}</Label>
              <Input
                id="yearsExperience"
                type="number"
                min="0"
                max="50"
                {...register("yearsExperience", { valueAsNumber: true })}
              />
              {errors.yearsExperience && <p className="text-xs text-destructive">{errors.yearsExperience.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hourlyRate">{t("profileSetup.step3.hourlyRate")} <span className="text-muted-foreground">{t("profileSetup.step3.optional")}</span></Label>
            <Input id="hourlyRate" type="number" min="0" placeholder={t("profileSetup.step3.hourlyRatePlaceholder")} {...register("hourlyRate")} />
          </div>

          <TagSection
            label={t("profileSetup.step3.toolsSoftware")}
            optionalLabel={t("profileSetup.step3.optional")}
            input={softwareInput}
            setInput={setSoftwareInput}
            list={softwares}
            setList={setSoftwares}
            placeholder={t("profileSetup.step3.toolsPlaceholder")}
            addLabel={t("profileSetup.step3.add")}
          />

          <div className="flex justify-between pt-2">
            <Button type="button" variant="outline" onClick={prevStep}>{t("profileSetup.step3.back")}</Button>
            <Button type="submit" disabled={isExpert && skills.length < 3}>{t("profileSetup.step3.continue")}</Button>
          </div>
        </form>
      ) : (
        <div className="space-y-5">
          <TagSection
            label={t("profileSetup.step3.toolsSoftwareClient")}
            optionalLabel={t("profileSetup.step3.optional")}
            input={softwareInput}
            setInput={setSoftwareInput}
            list={softwares}
            setList={setSoftwares}
            placeholder={t("profileSetup.step3.toolsClientPlaceholder")}
            addLabel={t("profileSetup.step3.add")}
          />
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={prevStep}>{t("profileSetup.step3.back")}</Button>
            <Button onClick={onClientContinue}>{t("profileSetup.step3.continue")}</Button>
          </div>
        </div>
      )}
    </div>
  )
}

function TagSection({
  label,
  optionalLabel,
  input,
  setInput,
  list,
  setList,
  placeholder,
  addLabel,
}: {
  label: string
  optionalLabel: string
  input: string
  setInput: (v: string) => void
  list: string[]
  setList: (v: string[]) => void
  placeholder: string
  addLabel: string
}) {
  return (
    <div className="space-y-2">
      <Label>{label} <span className="text-muted-foreground">{optionalLabel}</span></Label>
      <div className="flex gap-2">
        <Input
          placeholder={placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault()
              const val = input.trim()
              if (val && !list.includes(val)) setList([...list, val])
              setInput("")
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const val = input.trim()
            if (val && !list.includes(val)) setList([...list, val])
            setInput("")
          }}
        >
          {addLabel}
        </Button>
      </div>
      {list.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {list.map((s) => (
            <Badge key={s} variant="secondary" className="gap-1">
              {s}
              <button type="button" onClick={() => setList(list.filter((x) => x !== s))}>
                <X className="size-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
