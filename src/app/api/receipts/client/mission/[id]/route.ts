import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  const res = await fetch(
    `${process.env.API_BASE_URL}/receipts/client/mission/${id}`,
    {
      headers: { ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}) },
      cache: "no-store",
    }
  )

  const raw = await res.text().catch(() => "[]")
  let parsed: unknown = []
  try { parsed = JSON.parse(raw) } catch { /* empty */ }

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to load receipt" },
      { status: res.status }
    )
  }

  return NextResponse.json({ ok: true, data: parsed })
}
