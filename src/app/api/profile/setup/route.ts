import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const token = (await cookies()).get("_workedin_access_token")?.value
  const body = await req.json()

  const backendRes = await fetch(`${process.env.API_BASE_URL}/profiles/profile-setup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
    },
    body: JSON.stringify(body),
  })

  const raw = await backendRes.text().catch(() => "")
  let parsed: Record<string, unknown> | null = null
  try {
    parsed = JSON.parse(raw)
  } catch {
    // not JSON
  }

  if (!backendRes.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: (parsed as any)?.message ?? raw ?? "Profile setup failed",
        errors: (parsed as any)?.errors ?? undefined,
      },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, data: parsed })
}
