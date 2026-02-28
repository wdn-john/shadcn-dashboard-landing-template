export async function fetchWsToken(): Promise<string | null> {
  try {
    const res = await fetch("/api/auth/ws-token")
    if (!res.ok) return null
    const json = await res.json()
    return json.token ?? null
  } catch {
    return null
  }
}
