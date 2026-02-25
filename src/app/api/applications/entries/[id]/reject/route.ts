import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// PATCH — reject an applicant
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/applications/entries/${id}/reject`,
    {
      method: "PATCH",
      headers: {
        ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
      },
    }
  )

  const raw = await backendRes.text().catch(() => "")
  let parsed: Record<string, unknown> | null = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to reject applicant" },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true })
}
