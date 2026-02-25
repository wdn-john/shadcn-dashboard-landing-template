import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// POST — create Stripe payment intent for pre-authorization
// Body: { amount, currency, promoCodes, applicationEntryId }
export async function POST(req: Request) {
  const token = (await cookies()).get("_workedin_access_token")?.value
  const body = await req.json()

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/stripe/connect/create-payment-intent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
      },
      body: JSON.stringify(body),
    }
  )

  const raw = await backendRes.text().catch(() => "")
  let parsed: Record<string, unknown> | null = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to create payment intent" },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, data: parsed })
}
