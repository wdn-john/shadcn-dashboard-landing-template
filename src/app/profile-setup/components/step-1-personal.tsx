"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProfileSetupStore } from "@/store/profileSetupStore"
import { useTranslation } from "react-i18next"

const schema = z.object({
  firstName: z.string().min(2, "Min 2 characters").max(100),
  lastName: z.string().min(2, "Min 2 characters").max(100),
  preferredName: z.string().optional(),
  dateOfBirth: z.string().min(1, "Required").refine((val) => {
    const age = (Date.now() - new Date(val).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    return age >= 18
  }, "You must be at least 18 years old"),
  phone: z.string().min(10, "Enter a valid phone number"),
  language: z.enum(["en", "fr"]),
  title: z.string().min(2, "Min 2 characters").max(100),
  organizationName: z.string().optional(),
  organizationEmployees: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export function Step1Personal() {
  const { t } = useTranslation()
  const { personal, setPersonal, nextStep } = useProfileSetupStore()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...personal,
      language: personal.language ?? "en",
    },
  })

  const orgName = watch("organizationName")

  function onSubmit(data: FormValues) {
    setPersonal({
      ...data,
      preferredName: data.preferredName ?? "",
      organizationName: data.organizationName ?? "",
      organizationEmployees: data.organizationEmployees ?? "",
    })
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("profileSetup.step1.firstName")}</Label>
          <Input id="firstName" {...register("firstName")} />
          {errors.firstName && <p className="text-xs text-destructive">{errors.firstName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t("profileSetup.step1.lastName")}</Label>
          <Input id="lastName" {...register("lastName")} />
          {errors.lastName && <p className="text-xs text-destructive">{errors.lastName.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferredName">{t("profileSetup.step1.preferredName")}</Label>
        <Input id="preferredName" {...register("preferredName")} placeholder={t("profileSetup.step1.preferredNameHint")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">{t("profileSetup.step1.dob")}</Label>
          <Input id="dateOfBirth" type="date" {...register("dateOfBirth")} />
          {errors.dateOfBirth && <p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">{t("profileSetup.step1.phone")}</Label>
          <Input id="phone" type="tel" placeholder={t("profileSetup.step1.phonePlaceholder")} {...register("phone")} />
          {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">{t("profileSetup.step1.jobTitle")}</Label>
          <Input id="title" placeholder={t("profileSetup.step1.jobTitlePlaceholder")} {...register("title")} />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-2">
          <Label>{t("profileSetup.step1.preferredLanguage")}</Label>
          <Select
            defaultValue={personal.language ?? "en"}
            onValueChange={(v) => setValue("language", v as "en" | "fr")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">{t("profileSetup.step1.english")}</SelectItem>
              <SelectItem value="fr">{t("profileSetup.step1.french")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="organizationName">{t("profileSetup.step1.organization")}</Label>
        <Input id="organizationName" placeholder={t("profileSetup.step1.organizationPlaceholder")} {...register("organizationName")} />
      </div>

      {orgName && (
        <div className="space-y-2">
          <Label htmlFor="organizationEmployees">{t("profileSetup.step1.employees")}</Label>
          <Input
            id="organizationEmployees"
            type="number"
            min="1"
            placeholder={t("profileSetup.step1.employeesPlaceholder")}
            {...register("organizationEmployees")}
          />
          {errors.organizationEmployees && (
            <p className="text-xs text-destructive">{errors.organizationEmployees.message}</p>
          )}
        </div>
      )}

      <div className="flex justify-end pt-2">
        <Button type="submit">{t("profileSetup.step1.continue")}</Button>
      </div>
    </form>
  )
}
