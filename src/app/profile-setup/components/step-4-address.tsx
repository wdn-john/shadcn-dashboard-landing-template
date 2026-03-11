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

const PROVINCES = [
  { value: "AB", label: "Alberta" },
  { value: "BC", label: "British Columbia" },
  { value: "MB", label: "Manitoba" },
  { value: "NB", label: "New Brunswick" },
  { value: "NL", label: "Newfoundland and Labrador" },
  { value: "NT", label: "Northwest Territories" },
  { value: "NS", label: "Nova Scotia" },
  { value: "NU", label: "Nunavut" },
  { value: "ON", label: "Ontario" },
  { value: "PE", label: "Prince Edward Island" },
  { value: "QC", label: "Quebec" },
  { value: "SK", label: "Saskatchewan" },
  { value: "YT", label: "Yukon" },
]

const schema = z.object({
  streetAddress: z.string().min(5, "Enter a valid street address"),
  city: z.string().min(2, "Enter a valid city"),
  postalCode: z
    .string()
    .min(1, "Required")
    .regex(/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/, "Enter a valid Canadian postal code (e.g. H3Z 2Y7)"),
  province: z.string().min(1, "Select a province"),
})

type FormValues = z.infer<typeof schema>

export function Step4Address() {
  const { t } = useTranslation()
  const { identity, setIdentity, nextStep, prevStep } = useProfileSetupStore()

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: identity,
  })

  function formatPostalCode(value: string) {
    const clean = value.replace(/\s/g, "").toUpperCase().slice(0, 6)
    return clean.length > 3 ? `${clean.slice(0, 3)} ${clean.slice(3)}` : clean
  }

  function onSubmit(data: FormValues) {
    setIdentity(data)
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="streetAddress">{t("profileSetup.step4.streetAddress")}</Label>
        <Input id="streetAddress" placeholder={t("profileSetup.step4.streetPlaceholder")} {...register("streetAddress")} />
        {errors.streetAddress && <p className="text-xs text-destructive">{errors.streetAddress.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">{t("profileSetup.step4.city")}</Label>
          <Input id="city" placeholder={t("profileSetup.step4.cityPlaceholder")} {...register("city")} />
          {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="postalCode">{t("profileSetup.step4.postalCode")}</Label>
          <Input
            id="postalCode"
            placeholder={t("profileSetup.step4.postalPlaceholder")}
            {...register("postalCode")}
            onChange={(e) => setValue("postalCode", formatPostalCode(e.target.value), { shouldValidate: true })}
          />
          {errors.postalCode && <p className="text-xs text-destructive">{errors.postalCode.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("profileSetup.step4.province")}</Label>
        <Select defaultValue={identity.province} onValueChange={(v) => setValue("province", v)}>
          <SelectTrigger>
            <SelectValue placeholder={t("profileSetup.step4.selectProvince")} />
          </SelectTrigger>
          <SelectContent>
            {PROVINCES.map((p) => (
              <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.province && <p className="text-xs text-destructive">{errors.province.message}</p>}
      </div>

      <div className="flex justify-between pt-2">
        <Button type="button" variant="outline" onClick={prevStep}>{t("profileSetup.step4.back")}</Button>
        <Button type="submit">{t("profileSetup.step4.continue")}</Button>
      </div>
    </form>
  )
}
