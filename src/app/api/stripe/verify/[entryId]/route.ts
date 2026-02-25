import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ entryId: string }> }
) {
  const { entryId } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/stripe/payment/${entryId}/verify`,
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
      { ok: false, message: (parsed as any)?.message ?? "Payment verification failed" },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, data: parsed })
}
