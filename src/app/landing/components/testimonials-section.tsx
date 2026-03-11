"use client"

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'

export function TestimonialsSection() {
  const { t } = useTranslation()

  const testimonials = [
    {
      name: 'Alexandra Mitchell',
      role: t("landing.testimonials.items.person1.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-1',
      quote: t("landing.testimonials.items.person1.quote"),
    },
    {
      name: 'James Thompson',
      role: t("landing.testimonials.items.person2.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-1',
      quote: t("landing.testimonials.items.person2.quote"),
    },
    {
      name: 'Priya Sharma',
      role: t("landing.testimonials.items.person3.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-2',
      quote: t("landing.testimonials.items.person3.quote"),
    },
    {
      name: 'Robert Kim',
      role: t("landing.testimonials.items.person4.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-2',
      quote: t("landing.testimonials.items.person4.quote"),
    },
    {
      name: 'Maria Santos',
      role: t("landing.testimonials.items.person5.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-3',
      quote: t("landing.testimonials.items.person5.quote"),
    },
    {
      name: 'Thomas Anderson',
      role: t("landing.testimonials.items.person6.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-3',
      quote: t("landing.testimonials.items.person6.quote"),
    },
    {
      name: 'Lisa Chang',
      role: t("landing.testimonials.items.person7.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-4',
      quote: t("landing.testimonials.items.person7.quote"),
    },
    {
      name: 'Michael Foster',
      role: t("landing.testimonials.items.person8.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-4',
      quote: t("landing.testimonials.items.person8.quote"),
    },
    {
      name: 'Sophie Laurent',
      role: t("landing.testimonials.items.person9.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-5',
      quote: t("landing.testimonials.items.person9.quote"),
    },
    {
      name: 'Daniel Wilson',
      role: t("landing.testimonials.items.person10.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-5',
      quote: t("landing.testimonials.items.person10.quote"),
    },
    {
      name: 'Natasha Petrov',
      role: t("landing.testimonials.items.person11.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=female-6',
      quote: t("landing.testimonials.items.person11.quote"),
    },
    {
      name: 'Carlos Rivera',
      role: t("landing.testimonials.items.person12.role"),
      image: 'https://notion-avatars.netlify.app/api/avatar?preset=male-6',
      quote: t("landing.testimonials.items.person12.quote"),
    },
  ]

  return (
    <section id="testimonials" className="py-24 sm:py-32">
      <div className="container mx-auto px-8 sm:px-6">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <Badge variant="outline" className="mb-4">{t("landing.testimonials.badge")}</Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            {t("landing.testimonials.title")}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("landing.testimonials.description")}
          </p>
        </div>

        {/* Testimonials Masonry Grid */}
        <div className="columns-1 gap-4 md:columns-2 md:gap-6 lg:columns-3 lg:gap-4">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="mb-6 break-inside-avoid shadow-none lg:mb-4">
              <CardContent>
                <div className="flex items-start gap-4">
                  <Avatar className="bg-muted size-12 shrink-0">
                    <AvatarImage
                      alt={testimonial.name}
                      src={testimonial.image}
                      loading="lazy"
                      width="120"
                      height="120"
                    />
                    <AvatarFallback>
                      {testimonial.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <a href="#" onClick={e => e.preventDefault()} className="cursor-pointer">
                      <h3 className="font-medium hover:text-primary transition-colors">{testimonial.name}</h3>
                    </a>
                    <span className="text-muted-foreground block text-sm tracking-wide">
                      {testimonial.role}
                    </span>
                  </div>
                </div>

                <blockquote className="mt-4">
                  <p className="text-sm leading-relaxed text-balance">{testimonial.quote}</p>
                </blockquote>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
