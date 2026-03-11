"use client"

import {
  Shield,
  BarChart3,
  Database,
  Building2,
  Rocket,
  Settings,
  Zap,
  Package,
  Layout,
  Crown,
  Palette
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function MegaMenu() {
  const { t } = useTranslation()

  const menuSections = [
    {
      key: 'browseProducts',
      title: t("landing.megaMenu.browseProducts"),
      items: [
        {
          key: 'freeBlocks',
          title: t("landing.megaMenu.freeBlocks.title"),
          description: t("landing.megaMenu.freeBlocks.description"),
          icon: Package,
          href: '#free-blocks'
        },
        {
          key: 'premiumTemplates',
          title: t("landing.megaMenu.premiumTemplates.title"),
          description: t("landing.megaMenu.premiumTemplates.description"),
          icon: Crown,
          href: '#premium-templates'
        },
        {
          key: 'adminDashboards',
          title: t("landing.megaMenu.adminDashboards.title"),
          description: t("landing.megaMenu.adminDashboards.description"),
          icon: BarChart3,
          href: '#admin-dashboards'
        },
        {
          key: 'landingPages',
          title: t("landing.megaMenu.landingPages.title"),
          description: t("landing.megaMenu.landingPages.description"),
          icon: Layout,
          href: '#landing-pages'
        }
      ]
    },
    {
      key: 'categories',
      title: t("landing.megaMenu.categories"),
      items: [
        {
          key: 'ecommerce',
          title: t("landing.megaMenu.ecommerce.title"),
          description: t("landing.megaMenu.ecommerce.description"),
          icon: Building2,
          href: '#ecommerce'
        },
        {
          key: 'saasDashboards',
          title: t("landing.megaMenu.saasDashboards.title"),
          description: t("landing.megaMenu.saasDashboards.description"),
          icon: Rocket,
          href: '#saas-dashboards'
        },
        {
          key: 'analytics',
          title: t("landing.megaMenu.analytics.title"),
          description: t("landing.megaMenu.analytics.description"),
          icon: BarChart3,
          href: '#analytics'
        },
        {
          key: 'authentication',
          title: t("landing.megaMenu.authentication.title"),
          description: t("landing.megaMenu.authentication.description"),
          icon: Shield,
          href: '#authentication'
        }
      ]
    },
    {
      key: 'resources',
      title: t("landing.megaMenu.resources"),
      items: [
        {
          key: 'documentation',
          title: t("landing.megaMenu.documentation.title"),
          description: t("landing.megaMenu.documentation.description"),
          icon: Database,
          href: '#docs'
        },
        {
          key: 'componentShowcase',
          title: t("landing.megaMenu.componentShowcase.title"),
          description: t("landing.megaMenu.componentShowcase.description"),
          icon: Palette,
          href: '#showcase'
        },
        {
          key: 'githubRepository',
          title: t("landing.megaMenu.githubRepository.title"),
          description: t("landing.megaMenu.githubRepository.description"),
          icon: Settings,
          href: '#github'
        },
        {
          key: 'designSystem',
          title: t("landing.megaMenu.designSystem.title"),
          description: t("landing.megaMenu.designSystem.description"),
          icon: Zap,
          href: '#design-system'
        }
      ]
    }
  ]

  return (
    <div className="w-[700px] max-w-[95vw] p-4 sm:p-6 lg:p-8 bg-background">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
        {menuSections.map((section) => (
          <div key={section.key} className="space-y-4 lg:space-y-6">
            {/* Section Header */}
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {section.title}
            </h3>

            {/* Section Links */}
            <div className="space-y-3 lg:space-y-4">
              {section.items.map((item) => (
                <a
                  key={item.key}
                  href={item.href}
                  className="group block space-y-1 lg:space-y-2 hover:bg-accent rounded-md p-2 lg:p-3 -mx-2 lg:-mx-3 transition-colors my-0"
                >
                  <div className="flex items-center gap-2 lg:gap-3">
                    <item.icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed ml-6 lg:ml-7">
                    {item.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
