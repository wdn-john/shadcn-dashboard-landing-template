import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json() // { token, newPassword }

  // Backend expects both as query params
  const url = new URL(`${process.env.API_BASE_URL}/auth/public/reset-password`)
  url.searchParams.set("token", body.token)
  url.searchParams.set("newPassword", body.newPassword)

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
        message: parsed?.message ?? "Failed to reset password",
      },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, message: parsed?.message ?? "Password reset successful" })
}
