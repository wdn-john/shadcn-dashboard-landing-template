import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json() // { email, password, username? }

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/auth/public/signup`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  )

  const raw = await backendRes.text().catch(() => "")
  let parsed: { message?: string; errors?: Record<string, string> } | null = null
  try {
    parsed = JSON.parse(raw)
  } catch {
    // not JSON
  }

  if (!backendRes.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: parsed?.message ?? raw ?? "Registration failed",
        errors: parsed?.errors ?? undefined,
      },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, message: parsed?.message ?? "User registered successfully!" })
}
