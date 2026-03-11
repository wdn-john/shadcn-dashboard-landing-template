import { cookies } from "next/headers"
import type { Session } from "@/types/Session"

export async function getSession(): Promise<Session> {
  const cookieStore = await cookies()
  const token = cookieStore.get("_workedin_access_token")?.value

  if (!token) return { isAuthenticated: false }

  const res = await fetch(`${process.env.API_BASE_URL}/auth/session`, {
    method: "GET",
    headers: {
      Cookie: `_workedin_access_token=${token}`,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    console.log(
      "Stale token detected, clearing cookie and treating as unauthenticated",
      res.status
    )
    if (res.status === 401 || res.status === 403) {
      // Cookie exists but the backend rejected it (e.g. after a DB reset).
      // Signal staleToken — the layout will render a client component that
      // navigates the browser to the GET logout handler, which clears the
      // HttpOnly cookie via Set-Cookie and redirects to sign-in.
      return { isAuthenticated: false }
    }

    return { isAuthenticated: false }
  }

  const data = await res.json()

  // Backend returns { user, profile } — we merge isAuthenticated into it
  return { ...data, isAuthenticated: true } as Session
}
