import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// GET — get mission progress
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  const backendRes = await fetch(`${process.env.API_BASE_URL}/missions/${id}/progress`, {
    headers: { ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}) },
    cache: "no-store",
  })

  const raw = await backendRes.text().catch(() => "")
  let parsed: unknown = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to fetch progress" },
      { status: backendRes.status }
    )
  }
  return NextResponse.json({ ok: true, data: parsed })
}

// PATCH — update step progress (multipart FormData passthrough)
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  // Forward the multipart FormData as-is
  const formData = await req.formData()

  const backendRes = await fetch(`${process.env.API_BASE_URL}/missions/${id}/progress`, {
    method: "PATCH",
    headers: { ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}) },
    body: formData,
  })

  const raw = await backendRes.text().catch(() => "")
  let parsed: unknown = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to update step" },
      { status: backendRes.status }
    )
  }
  return NextResponse.json({ ok: true, data: parsed })
}
