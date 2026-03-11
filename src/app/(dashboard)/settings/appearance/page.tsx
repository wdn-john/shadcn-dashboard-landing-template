"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const appearanceFormSchema = z.object({
  theme: z.enum(["light", "dark"]),
  fontFamily: z.string().optional(),
  fontSize: z.string().optional(),
  sidebarWidth: z.string().optional(),
  contentWidth: z.string().optional(),
})

type AppearanceFormValues = z.infer<typeof appearanceFormSchema>

export default function AppearanceSettings() {
  const { t } = useTranslation()
  const form = useForm<AppearanceFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues: {
      theme: "dark",
      fontFamily: "",
      fontSize: "",
      sidebarWidth: "",
      contentWidth: "",
    },
  })

  function onSubmit(data: AppearanceFormValues) {
    console.log("Form submitted:", data)
    // Here you would typically save the data
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">{t("settings.appearance.title")}</h1>
          <p className="text-muted-foreground">
            {t("settings.appearance.customize")}
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Theme Section */}
            <h3 className="text-lg font-medium mb-2">{t("settings.appearance.theme")}</h3>
            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-4"
                    >
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value="light" className="sr-only" />
                          </FormControl>
                          <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
                            <div className="space-y-2">
                              <div className="w-20 h-20 bg-white border rounded-md p-3">
                                <div className="space-y-2">
                                  <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                  <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                                    <div className="h-2 bg-gray-200 rounded flex-1"></div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-300 rounded-full"></div>
                                    <div className="h-2 bg-gray-200 rounded flex-1"></div>
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm font-medium">{t("settings.appearance.light")}</span>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary cursor-pointer">
                          <FormControl>
                            <RadioGroupItem value="dark" className="sr-only" />
                          </FormControl>
                          <div className="rounded-md border-2 border-muted p-4 hover:border-accent transition-colors">
                            <div className="space-y-2">
                              <div className="w-20 h-20 bg-gray-900 border border-gray-700 rounded-md p-3">
                                <div className="space-y-2">
                                  <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                                  <div className="h-2 bg-gray-600 rounded w-1/2"></div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                                    <div className="h-2 bg-gray-600 rounded flex-1"></div>
                                  </div>
                                  <div className="flex space-x-2">
                                    <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
                                    <div className="h-2 bg-gray-600 rounded flex-1"></div>
                                  </div>
                                </div>
                              </div>
                              <span className="text-sm font-medium">{t("settings.appearance.dark")}</span>
                            </div>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fontFamily"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("settings.appearance.fontFamily")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder={t("settings.appearance.selectFont")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="inter">Inter</SelectItem>
                      <SelectItem value="roboto">Roboto</SelectItem>
                      <SelectItem value="system">System Default</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fontSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("settings.appearance.fontSize")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder={t("settings.appearance.selectFontSize")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="small">{t("settings.appearance.small")}</SelectItem>
                      <SelectItem value="medium">{t("settings.appearance.medium")}</SelectItem>
                      <SelectItem value="large">{t("settings.appearance.large")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Layout Section */}
            <FormField
              control={form.control}
              name="sidebarWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("settings.appearance.sidebarWidth")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder={t("settings.appearance.selectSidebarWidth")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="compact">{t("settings.appearance.compact")}</SelectItem>
                      <SelectItem value="comfortable">{t("settings.appearance.comfortable")}</SelectItem>
                      <SelectItem value="spacious">{t("settings.appearance.spacious")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contentWidth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("settings.appearance.contentWidth")}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder={t("settings.appearance.selectContentWidth")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="fixed">{t("settings.appearance.fixed")}</SelectItem>
                      <SelectItem value="fluid">{t("settings.appearance.fluid")}</SelectItem>
                      <SelectItem value="container">{t("settings.appearance.container")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-2 mt-12">
              <Button type="submit" className="cursor-pointer">
                {t("settings.appearance.savePreferences")}
              </Button>
              <Button variant="outline" type="button" className="cursor-pointer">{t("common.cancel")}</Button>
            </div>
          </form>
        </Form>
      </div>
  )
}
