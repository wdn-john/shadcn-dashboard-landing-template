"use client"

import { useTranslation } from "react-i18next"

type Props = {
  k: string
  values?: Record<string, string | number>
}

/**
 * Inline translation helper for use inside server components.
 * Usage: <T k="requests.title" />
 */
export function T({ k, values }: Props) {
  const { t } = useTranslation()
  return <>{t(k, values)}</>
}
