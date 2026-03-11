"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent,CardHeader, CardDescription, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload } from "lucide-react"
import { useRef, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Logo } from "@/components/logo"
import { useTranslation } from "react-i18next"

type UserFormValues = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  website?: string
  location?: string
  role?: string
  bio?: string
  company?: string
  timezone?: string
  language?: string
}

export default function UserSettingsPage() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [useDefaultIcon, setUseDefaultIcon] = useState(true)

  const userFormSchema = z.object({
    firstName: z.string().min(1, t("settings.user.firstNameRequired")),
    lastName: z.string().min(1, t("settings.user.lastNameRequired")),
    email: z.string().email(t("settings.user.invalidEmail")),
    phone: z.string().optional(),
    website: z.string().optional(),
    location: z.string().optional(),
    role: z.string().optional(),
    bio: z.string().optional(),
    company: z.string().optional(),
    timezone: z.string().optional(),
    language: z.string().optional(),
  })

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      website: "",
      location: "",
      role: "",
      bio: "",
      company: "",
      timezone: "",
      language: "",
    },
  })

  function onSubmit(data: UserFormValues) {
    console.log("Form submitted:", data)
    // Here you would typically save the data
  }

  const handleFileUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
        setUseDefaultIcon(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleReset = () => {
    setProfileImage(null)
    setUseDefaultIcon(true)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="px-4 lg:px-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle>{t("settings.user.title")}</CardTitle>
                <CardDescription>{t("settings.user.subtitle")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
            {/* Profile Picture Section */}
            <div className="flex items-center gap-6 ">
              {useDefaultIcon ? (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg">
                  < Logo size={56} />
                </div>
              ) : (
                <Avatar className="h-20 w-20 rounded-lg">
                  <AvatarImage src={profileImage || undefined} />
                  <AvatarFallback>SS</AvatarFallback>
                </Avatar>
              )}
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleFileUpload}
                    className="cursor-pointer"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {t("settings.user.uploadPhoto")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="cursor-pointer"
                  >
                    {t("common.reset")}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("settings.user.photoHint")}
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/gif,image/png"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            <Separator className="mb-10" />
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.firstName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("settings.user.firstNamePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.lastName")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("settings.user.lastNamePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.email")}</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder={t("settings.user.emailPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Company */}
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.company")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("settings.user.companyPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Number */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.phoneNumber")}</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder={t("settings.user.phonePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Location */}
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.location")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("settings.user.locationPlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Website */}
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.website")}</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder={t("settings.user.websitePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Language */}
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.language")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("settings.user.selectLanguage")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="english">{t("languages.english")}</SelectItem>
                        <SelectItem value="spanish">{t("languages.spanish")}</SelectItem>
                        <SelectItem value="french">{t("languages.french")}</SelectItem>
                        <SelectItem value="german">{t("languages.german")}</SelectItem>
                        <SelectItem value="italian">{t("languages.italian")}</SelectItem>
                        <SelectItem value="portuguese">{t("languages.portuguese")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.role")}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("settings.user.rolePlaceholder")} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Timezone */}
              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("common.timezone")}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder={t("settings.user.selectTimezone")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pst">PST (Pacific Standard Time)</SelectItem>
                        <SelectItem value="est">EST (Eastern Standard Time)</SelectItem>
                        <SelectItem value="cst">CST (Central Standard Time)</SelectItem>
                        <SelectItem value="mst">MST (Mountain Standard Time)</SelectItem>
                        <SelectItem value="utc">UTC (Coordinated Universal Time)</SelectItem>
                        <SelectItem value="cet">CET (Central European Time)</SelectItem>
                        <SelectItem value="jst">JST (Japan Standard Time)</SelectItem>
                        <SelectItem value="aest">AEST (Australian Eastern Standard Time)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Bio - Full Width */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("common.bio")}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t("settings.user.bioPlaceholder")}
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-start gap-3">
              <Button type="submit" className="cursor-pointer">
                {t("common.saveChanges")}
              </Button>
              <Button variant="outline" type="button" className="cursor-pointer">
                {t("common.cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
          </form>
        </Form>
      </div>
  )
}
