"use client"

import { useEffect } from "react"

/**
 * Rendered when the backend rejects our cookie (401/403 — e.g. after a DB reset).
 * Uses a hard browser navigation to GET /api/auth/logout, which only clears the
 * local HttpOnly cookie via Set-Cookie (no backend call needed) and redirects to
 * sign-in. window.location is used instead of router.replace to guarantee a real
 * HTTP request — the only reliable way to delete an HttpOnly cookie client-side.
 */
export function StaleTokenLogout() {
  useEffect(() => {
    window.location.replace("/api/auth/logout")
  }, [])

  return null
}
