import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// GET — get job progress (client view)
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  const backendRes = await fetch(`${process.env.API_BASE_URL}/jobs/${id}/progress`, {
    headers: { ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}) },
    cache: "no-store",
  })

  const raw = await backendRes.text().catch(() => "")
  let parsed: unknown = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to fetch job progress" },
      { status: backendRes.status }
    )
  }
  return NextResponse.json({ ok: true, data: parsed })
}
