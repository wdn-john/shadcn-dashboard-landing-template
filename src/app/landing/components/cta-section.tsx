"use client"

import { ArrowRight, TrendingUp, Package, Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useTranslation } from 'react-i18next'

export function CTASection() {
  const { t } = useTranslation()

  return (
    <section className='py-16 lg:py-24 bg-muted/80'>
      <div className='container mx-auto px-4 lg:px-8'>
        <div className='mx-auto max-w-4xl'>
          <div className='text-center'>
            <div className='space-y-8'>
              {/* Badge and Stats */}
              <div className='flex flex-col items-center gap-4'>
                <Badge variant='outline' className='flex items-center gap-2'>
                  <TrendingUp className='size-3' />
                  {t("landing.cta.badge")}
                </Badge>

                <div className='text-muted-foreground flex items-center gap-4 text-sm'>
                  <span className='flex items-center gap-1'>
                    <div className='size-2 rounded-full bg-green-500' />
                    {t("landing.cta.blocks")}
                  </span>
                  <Separator orientation='vertical' className='!h-4' />
                  <span>{t("landing.cta.downloads")}</span>
                  <Separator orientation='vertical' className='!h-4' />
                  <span>{t("landing.cta.rating")}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className='space-y-6'>
                <h1 className='text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl'>
                  {t("landing.cta.title")}
                </h1>

                <p className='text-muted-foreground mx-auto max-w-2xl text-balance lg:text-xl'>
                  {t("landing.cta.description")}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className='flex flex-col justify-center gap-4 sm:flex-row sm:gap-6'>
                <Button size='lg' className='cursor-pointer px-8 py-6 text-lg font-medium' asChild>
                  <a href='https://shadcnstore.com/blocks' target='_blank' rel='noopener noreferrer'>
                    <Package className='me-2 size-5' />
                    {t("landing.cta.browseComponents")}
                  </a>
                </Button>
                <Button variant='outline' size='lg' className='cursor-pointer px-8 py-6 text-lg font-medium group' asChild>
                  <a href='https://github.com/silicondeck/shadcn-dashboard-landing-template' target='_blank' rel='noopener noreferrer'>
                    <Github className='me-2 size-5' />
                    {t("landing.cta.viewGithub")}
                    <ArrowRight className='ms-2 size-4 transition-transform group-hover:translate-x-1' />
                  </a>
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className='text-muted-foreground flex flex-wrap items-center justify-center gap-6 text-sm'>
                <div className='flex items-center gap-2'>
                    <div className='size-2 rounded-full bg-green-600 dark:bg-green-400 me-1' />
                  <span>{t("landing.cta.freeNote")}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='size-2 rounded-full bg-blue-600 dark:bg-blue-400 me-1' />
                  <span>{t("landing.cta.licenseNote")}</span>
                </div>
                <div className='flex items-center gap-2'>
                    <div className='size-2 rounded-full bg-purple-600 dark:bg-purple-400 me-1' />
                  <span>{t("landing.cta.updatesNote")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
