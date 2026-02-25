import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/promo-codes/code/${code}`,
    {
      headers: {
        ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
      },
      cache: "no-store",
    }
  )

  const raw = await backendRes.text().catch(() => "")
  let parsed: Record<string, unknown> | null = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Invalid promo code" },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, data: parsed })
}
