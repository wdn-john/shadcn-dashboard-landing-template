"use client"

import { useEffect } from "react"
import { I18nextProvider } from "react-i18next"
import i18n from "@/i18n/config"

const LANGUAGE_KEY = "app_language"

// Tracks whether the one-time client-side hydration setup has run.
// Module-level so it resets when the module is re-evaluated (fresh page load or HMR
// of this specific file), but persists across re-renders within a session.
let clientSetupDone = false

export function I18nProvider({
  children,
  initialLang = "en",
}: {
  children: React.ReactNode
  initialLang?: string
}) {
  // Apply the server-determined language synchronously during the render phase.
  //
  // WHY render phase (not useEffect/useLayoutEffect):
  // useEffect/useLayoutEffect run AFTER React commits to the DOM, which is too late
  // to prevent the hydration comparison. The language must match BEFORE React compares
  // server HTML vs client render output.
  //
  // Server: called on every render (safe — Node.js is single-threaded; each React SSR
  //   render is synchronous, so concurrent requests don't race on the singleton).
  // Client: called only once per module-evaluation session (guarded by clientSetupDone)
  //   to avoid reverting the language after the user changes it mid-session.
  if (typeof window === "undefined") {
    // Server: always apply initialLang so the pre-rendered HTML uses the correct language
    if (i18n.language !== initialLang) {
      void i18n.changeLanguage(initialLang)
    }
  } else if (!clientSetupDone) {
    // Client: apply initialLang only on the very first render (hydration pass)
    clientSetupDone = true
    if (i18n.language !== initialLang) {
      void i18n.changeLanguage(initialLang)
    }
  }

  useEffect(() => {
    // After hydration, localStorage takes precedence over the cookie
    // (allows overriding the preference without a page reload)
    const saved = localStorage.getItem(LANGUAGE_KEY)
    const effective = saved ?? initialLang
    void i18n.changeLanguage(effective)
    // Keep the cookie in sync so the server uses the same language on the next load
    document.cookie = `${LANGUAGE_KEY}=${effective};path=/;max-age=31536000;SameSite=Lax`
  }, [initialLang])

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      document.documentElement.lang = lng
    }
    i18n.on("languageChanged", handleLanguageChange)
    return () => i18n.off("languageChanged", handleLanguageChange)
  }, [])

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
}
