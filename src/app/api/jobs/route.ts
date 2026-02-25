import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// GET — client's jobs (work in progress) list
export async function GET(req: Request) {
  const token = (await cookies()).get("_workedin_access_token")?.value
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") ?? "0"

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/jobs/current-user?page=${page}`,
    {
      headers: { ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}) },
      cache: "no-store",
    }
  )

  const raw = await backendRes.text().catch(() => "")
  let parsed: unknown = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to fetch jobs" },
      { status: backendRes.status }
    )
  }
  return NextResponse.json({ ok: true, data: parsed })
}
