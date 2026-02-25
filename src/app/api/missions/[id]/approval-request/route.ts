import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// PATCH — request client approval (all steps completed)
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  const backendRes = await fetch(`${process.env.API_BASE_URL}/missions/${id}/approval-request`, {
    method: "PATCH",
    headers: { ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}) },
  })

  const raw = await backendRes.text().catch(() => "")
  let parsed: unknown = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to request approval" },
      { status: backendRes.status }
    )
  }
  return NextResponse.json({ ok: true, data: parsed })
}
