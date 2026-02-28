import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST(req: Request) {
  const token = (await cookies()).get("_workedin_access_token")?.value
  const body = await req.json()

  const res = await fetch(
    `${process.env.API_BASE_URL}/identity-verification/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
      },
      body: JSON.stringify(body),
    }
  )

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    return NextResponse.json({ ok: false, ...data }, { status: res.status })
  }

  return NextResponse.json({ ok: true })
}
