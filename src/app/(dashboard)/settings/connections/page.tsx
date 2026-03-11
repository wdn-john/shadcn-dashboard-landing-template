"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Github, Slack, Twitter, Zap, Globe, Database, Apple, Chrome, Facebook, Instagram, Dribbble } from "lucide-react"
import { useState } from "react"
import { useTranslation } from "react-i18next"

export default function ConnectionSettings() {
  const { t } = useTranslation()

  // Controlled state for switches
  const [appleConnected, setAppleConnected] = useState(true)
  const [googleConnected, setGoogleConnected] = useState(false)
  const [githubConnected, setGithubConnected] = useState(true)
  const [slackConnected, setSlackConnected] = useState(false)
  const [zapierConnected, setZapierConnected] = useState(true)
  const [webhooksConnected, setWebhooksConnected] = useState(false)
  const [dbConnected, setDbConnected] = useState(true)

  return (
    <div className="space-y-6 px-4 lg:px-6">
        <div>
          <h1 className="text-3xl font-bold">{t("settings.connections.title")}</h1>
          <p className="text-muted-foreground">
            {t("settings.connections.subtitle")}
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.connections.connectedAccounts")}</CardTitle>
              <CardDescription>
                {t("settings.connections.connectedAccountsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Apple className="h-8 w-8" />
                    <div>
                      <div className="font-medium">Apple</div>
                      <div className="text-sm text-muted-foreground">{t("settings.connections.calendarContacts")}</div>
                    </div>
                  </div>
                  <Switch
                    className="cursor-pointer"
                    checked={appleConnected}
                    onCheckedChange={setAppleConnected}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Chrome className="h-8 w-8" />
                    <div>
                      <div className="font-medium">Google</div>
                      <div className="text-sm text-muted-foreground">{t("settings.connections.calendarContacts")}</div>
                    </div>
                  </div>
                  <Switch
                    className="cursor-pointer"
                    checked={googleConnected}
                    onCheckedChange={setGoogleConnected}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Github className="h-8 w-8" />
                    <div>
                      <div className="font-medium">Github</div>
                      <div className="text-sm text-muted-foreground">{t("settings.connections.githubDesc")}</div>
                    </div>
                  </div>
                  <Switch
                    className="cursor-pointer"
                    checked={githubConnected}
                    onCheckedChange={setGithubConnected}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Slack className="h-8 w-8" />
                    <div>
                      <div className="font-medium">Slack</div>
                      <div className="text-sm text-muted-foreground">{t("settings.connections.slackDesc")}</div>
                    </div>
                  </div>
                  <Switch
                    className="cursor-pointer"
                    checked={slackConnected}
                    onCheckedChange={setSlackConnected}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settings.connections.socialAccounts")}</CardTitle>
              <CardDescription>
                {t("settings.connections.connectedAccountsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Facebook className="h-8 w-8" />
                    <div>
                      <div className="font-medium">
                        Facebook
                        <Badge variant="outline" className="ml-2">{t("settings.connections.notConnected")}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{t("settings.connections.facebookDesc")}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="cursor-pointer">
                    <Globe className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Twitter className="h-8 w-8" />
                    <div>
                      <div className="font-medium">
                        Twitter
                        <Badge variant="secondary" className="ml-2">{t("settings.connections.connected")}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{t("settings.connections.twitterDesc")}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="cursor-pointer text-destructive">
                    <Globe className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Instagram className="h-8 w-8" />
                    <div>
                      <div className="font-medium">
                        Instagram
                        <Badge variant="secondary" className="ml-2">{t("settings.connections.connected")}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{t("settings.connections.instagramDesc")}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="cursor-pointer text-destructive">
                    <Globe className="h-4 w-4" />
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Dribbble className="h-8 w-8" />
                    <div>
                      <div className="font-medium">
                        Dribbble
                        <Badge variant="outline" className="ml-2">{t("settings.connections.notConnected")}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">{t("settings.connections.dribbbleDesc")}</div>
                    </div>
                  </div>
                  <Button variant="outline" size="icon" className="cursor-pointer">
                    <Globe className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.connections.apiIntegrations")}</CardTitle>
              <CardDescription>
                {t("settings.connections.apiIntegrationsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Zap className="h-8 w-8" />
                    <div>
                      <div className="font-medium">Zapier</div>
                      <div className="text-sm text-muted-foreground">{t("settings.connections.zapierDesc")}</div>
                    </div>
                  </div>
                  <Switch
                    className="cursor-pointer"
                    checked={zapierConnected}
                    onCheckedChange={setZapierConnected}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-8 w-8" />
                    <div>
                      <div className="font-medium">Webhooks</div>
                      <div className="text-sm text-muted-foreground">{t("settings.connections.webhooksDesc")}</div>
                    </div>
                  </div>
                  <Switch
                    className="cursor-pointer"
                    checked={webhooksConnected}
                    onCheckedChange={setWebhooksConnected}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Database className="h-8 w-8" />
                    <div>
                      <div className="font-medium">Database Sync</div>
                      <div className="text-sm text-muted-foreground">{t("settings.connections.dbSyncDesc")}</div>
                    </div>
                  </div>
                  <Switch
                    className="cursor-pointer"
                    checked={dbConnected}
                    onCheckedChange={setDbConnected}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("settings.connections.apiKeys")}</CardTitle>
              <CardDescription>
                {t("settings.connections.apiKeysDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="font-medium">{t("settings.connections.productionKey")}</div>
                    <div className="text-sm text-muted-foreground font-mono">sk_live_••••••••••••••••••••••••4234</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      {t("settings.connections.regenerate")}
                    </Button>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      {t("common.copy")}
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <div className="font-medium">{t("settings.connections.developmentKey")}</div>
                    <div className="text-sm text-muted-foreground font-mono">sk_test_••••••••••••••••••••••••5678</div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      {t("settings.connections.regenerate")}
                    </Button>
                    <Button variant="outline" size="sm" className="cursor-pointer">
                      {t("common.copy")}
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="pt-4">
                  <Button variant="outline" className="cursor-pointer">{t("settings.connections.addApiKey")}</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
