"use client"

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { CardDecorator } from '@/components/ui/card-decorator'
import { Github, Code, Palette, Layout, Crown } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function AboutSection() {
  const { t } = useTranslation()

  const values = [
    {
      icon: Code,
      title: t("landing.about.values.developerFirst.title"),
      description: t("landing.about.values.developerFirst.desc"),
    },
    {
      icon: Palette,
      title: t("landing.about.values.designExcellence.title"),
      description: t("landing.about.values.designExcellence.desc"),
    },
    {
      icon: Layout,
      title: t("landing.about.values.productionReady.title"),
      description: t("landing.about.values.productionReady.desc"),
    },
    {
      icon: Crown,
      title: t("landing.about.values.premiumQuality.title"),
      description: t("landing.about.values.premiumQuality.desc"),
    },
  ]

  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-4xl text-center mb-16">
          <Badge variant="outline" className="mb-4">
            {t("landing.about.badge")}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">
            {t("landing.about.title")}
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            {t("landing.about.description")}
          </p>
        </div>

        {/* Modern Values Grid with Enhanced Design */}
        <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-4 mb-12">
          {values.map((value, index) => (
            <Card key={index} className='group shadow-xs py-2'>
              <CardContent className='p-8'>
                <div className='flex flex-col items-center text-center'>
                  <CardDecorator>
                    <value.icon className='h-6 w-6' aria-hidden />
                  </CardDecorator>
                  <h3 className='mt-6 font-medium text-balance'>{value.title}</h3>
                  <p className='text-muted-foreground mt-3 text-sm'>{value.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-muted-foreground">{t("landing.about.madeWithLove")}</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="cursor-pointer" asChild>
              <a href="https://github.com/silicondeck/shadcn-dashboard-landing-template" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                {t("landing.about.starOnGithub")}
              </a>
            </Button>
            <Button size="lg" variant="outline" className="cursor-pointer" asChild>
              <a href="https://discord.com/invite/XEQhPc9a6p" target="_blank" rel="noopener noreferrer">
                {t("landing.about.joinDiscord")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
