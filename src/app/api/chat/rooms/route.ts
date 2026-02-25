import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// GET — list of chatrooms for the current user
export async function GET() {
  const token = (await cookies()).get("_workedin_access_token")?.value

  const backendRes = await fetch(`${process.env.API_BASE_URL}/chat-rooms/my-chat-rooms`, {
    headers: { ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}) },
    cache: "no-store",
  })

  const raw = await backendRes.text().catch(() => "")
  let parsed: unknown = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to fetch chatrooms" },
      { status: backendRes.status }
    )
  }
  return NextResponse.json({ ok: true, data: parsed })
}
