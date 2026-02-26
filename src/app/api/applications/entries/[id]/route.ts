import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// GET — fetch full applicant entry details
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  const backendRes = await fetch(`${process.env.API_BASE_URL}/applications/entries/${id}`, {
    headers: {
      ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
    },
    cache: "no-store",
  })

  const raw = await backendRes.text().catch(() => "")
  let parsed: Record<string, unknown> | null = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to fetch entry" },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, data: parsed })
}

// DELETE — withdraw application entry
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  const backendRes = await fetch(`${process.env.API_BASE_URL}/applications/entries/${id}`, {
    method: "DELETE",
    headers: {
      ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
    },
  })

  if (!backendRes.ok) {
    const raw = await backendRes.text().catch(() => "")
    let parsed: Record<string, unknown> | null = null
    try { parsed = JSON.parse(raw) } catch { /* not JSON */ }
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to withdraw" },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true })
}
