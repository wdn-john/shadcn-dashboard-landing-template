"use client"

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'

export function BlogSection() {
  const { t } = useTranslation()

  const blogs = [
    {
      id: 1,
      image: 'https://ui.shadcn.com/placeholder.svg',
      category: t("landing.blog.posts.aiDev.category"),
      title: t("landing.blog.posts.aiDev.title"),
      description: t("landing.blog.posts.aiDev.description"),
    },
    {
      id: 2,
      image: 'https://ui.shadcn.com/placeholder.svg',
      category: t("landing.blog.posts.minimalist.category"),
      title: t("landing.blog.posts.minimalist.title"),
      description: t("landing.blog.posts.minimalist.description"),
    },
    {
      id: 3,
      image: 'https://ui.shadcn.com/placeholder.svg',
      category: t("landing.blog.posts.accessibleUI.category"),
      title: t("landing.blog.posts.accessibleUI.title"),
      description: t("landing.blog.posts.accessibleUI.description"),
    },
  ]

  return (
    <section id="blog" className="py-24 sm:py-32 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">{t("landing.blog.badge")}</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {t("landing.blog.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("landing.blog.subtitle")}
          </p>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {blogs.map(blog => (
            <Card key={blog.id} className="overflow-hidden py-0">
              <CardContent className="px-0">
                <div className="aspect-video">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    width={400}
                    height={225}
                    className="size-full object-cover dark:invert dark:brightness-[0.95]"
                    loading="lazy"
                  />
                </div>
                <div className="space-y-3 p-6">
                  <p className="text-muted-foreground text-xs tracking-widest uppercase">
                    {blog.category}
                  </p>
                  <a
                    href="#"
                    onClick={e => e.preventDefault()}
                    className="cursor-pointer"
                  >
                    <h3 className="text-xl font-bold hover:text-primary transition-colors">{blog.title}</h3>
                  </a>
                  <p className="text-muted-foreground">{blog.description}</p>
                  <a
                    href="#"
                    onClick={e => e.preventDefault()}
                    className="inline-flex items-center gap-2 text-primary hover:underline cursor-pointer"
                  >
                    {t("landing.blog.learnMore")}
                    <ArrowRight className="size-4" />
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
