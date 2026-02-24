import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const body = await req.json() // { email, password } (or whatever your backend expects)

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/auth/public/signing`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // No credentials needed here (server-to-server)
    }
  )

  if (!backendRes.ok) {
    // backend might not return JSON, so keep it simple
    const raw = await backendRes.text().catch(() => "")
    let parsed: any = null

    try {
      parsed = JSON.parse(raw) // handles {"message":"...","errors":{}}
    } catch {
      // not JSON, leave parsed null
    }

    return NextResponse.json(
      {
        ok: false,
        message: parsed?.message ?? raw ?? "Sign-in failed",
        errors: parsed?.errors ?? undefined,
        raw,
      },
      { status: backendRes.status }
    )
  }

  const res = NextResponse.json({ ok: true })

  // Forward all Set-Cookie headers from backend to browser (supports multiple cookies)
  const setCookies = (backendRes.headers as any).getSetCookie?.() ?? []

  if (setCookies.length > 0) {
    for (const cookie of setCookies) {
      res.headers.append("Set-Cookie", cookie)
    }
  } else {
    const singleCookie = backendRes.headers.get("set-cookie")
    if (singleCookie) {
      res.headers.set("Set-Cookie", singleCookie)
    }
  }

  return res
}
