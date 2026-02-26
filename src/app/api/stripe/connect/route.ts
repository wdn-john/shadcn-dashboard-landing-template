import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// POST — start Stripe Connect onboarding for expert
// Body: { firstName, lastName }
export async function POST(req: Request) {
  const token = (await cookies()).get("_workedin_access_token")?.value
  const body = await req.json()

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/stripe/connect/onboard`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
      },
      body: JSON.stringify({ ...body, platform: "WEB" }),
    }
  )

  const raw = await backendRes.text().catch(() => "")
  let parsed: Record<string, unknown> | null = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to start Stripe onboarding" },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, data: parsed })
}

// GET — check Stripe Connect account status
export async function GET() {
  const token = (await cookies()).get("_workedin_access_token")?.value

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/stripe/connect/status`,
    {
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
      { ok: false, message: (parsed as any)?.message ?? "Failed to check Stripe status" },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, data: parsed })
}
