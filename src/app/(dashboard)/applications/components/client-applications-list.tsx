"use client"

import Link from "next/link"
import { useTranslation } from "react-i18next"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, Clock, ArrowRight, FileText } from "lucide-react"
import type { ClientApplication } from "../page"

function statusVariant(s: string): "default" | "secondary" | "outline" | "destructive" {
  switch (s?.toLowerCase()) {
    case "open": return "default"
    case "assigned": return "secondary"
    case "closed": return "outline"
    default: return "secondary"
  }
}

export function ClientApplicationsList({
  applications,
}: {
  applications: ClientApplication[]
}) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-col gap-6 px-4 lg:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("applications.title")}</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          {applications.length > 0
            ? t(applications.length === 1 ? "applications.requestWithApplicants" : "applications.requestsWithApplicants", { n: applications.length })
            : t("applications.noClientApplicationsHint")}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
          <FileText className="size-12 text-muted-foreground/40" />
          <p className="font-semibold">{t("applications.noApplications")}</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            {t("applications.noClientApplicationsHint")}
          </p>
          <Button variant="outline" size="sm" asChild className="mt-2">
            <Link href="/requests">{t("applications.viewMyRequests")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {applications.map((app) => (
            <Card key={app.id} className="flex flex-col hover:shadow-sm transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <Badge variant={statusVariant(app.status)} className="text-xs shrink-0">
                    {app.status}
                  </Badge>
                  {app.applicants > 0 && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-primary">
                      <Users className="size-3" />
                      {t(app.applicants === 1 ? "applications.applicant" : "applications.applicants_count", { n: app.applicants })}
                    </span>
                  )}
                </div>
                <CardTitle className="text-base font-semibold leading-snug line-clamp-2 mt-1">
                  {app.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="flex-1 pb-2">
                {app.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {app.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-3 gap-y-1.5 mt-3 text-xs text-muted-foreground">
                  {app.priceRange && (
                    <span className="font-semibold text-foreground">{app.priceRange}</span>
                  )}
                  {app.daysLeft > 0 && (
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {t(app.daysLeft === 1 ? "applications.daysLeft" : "applications.daysLeftMany", { n: app.daysLeft })}
                    </span>
                  )}
                  {app.postedAgo && (
                    <span className="text-muted-foreground">{app.postedAgo}</span>
                  )}
                </div>
              </CardContent>

              <CardFooter className="pt-3 border-t">
                <Button size="sm" asChild className="w-full gap-1">
                  <Link href={`/applications/${app.id}/applicants`}>
                    {t("applications.viewApplicants")} <ArrowRight className="size-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
