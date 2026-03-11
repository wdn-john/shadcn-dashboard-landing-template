"use client"

import { useTranslation } from "react-i18next"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const LANGUAGE_KEY = "app_language"

const languages = [
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
]

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const handleChange = (code: string) => {
    void i18n.changeLanguage(code)
    localStorage.setItem(LANGUAGE_KEY, code)
    // Also set a cookie so the server renders in the correct language on next load
    document.cookie = `${LANGUAGE_KEY}=${code};path=/;max-age=31536000;SameSite=Lax`
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-1 cursor-pointer px-2">
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium uppercase">{i18n.language.slice(0, 2)}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleChange(lang.code)}
            className={`cursor-pointer ${i18n.language.startsWith(lang.code) ? "font-semibold" : ""}`}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
