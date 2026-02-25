import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json() // { email }

  // Backend expects email as a query param, not JSON body
  const url = new URL(`${process.env.API_BASE_URL}/auth/public/forgot-password`)
  url.searchParams.set("email", body.email)

  const backendRes = await fetch(url.toString(), { method: "POST" })

  const raw = await backendRes.text().catch(() => "")
  let parsed: { message?: string } | null = null
  try {
    parsed = JSON.parse(raw)
  } catch {
    // not JSON
  }

  if (!backendRes.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed?.message ?? "Failed to send reset email",
      },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, message: parsed?.message ?? "Password reset email sent" })
}
