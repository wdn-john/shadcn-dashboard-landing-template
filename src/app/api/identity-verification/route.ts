import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function GET() {
  const token = (await cookies()).get("_workedin_access_token")?.value

  const res = await fetch(
    `${process.env.API_BASE_URL}/identity-verification/status`,
    {
      headers: {
        ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
      },
    }
  )

  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    return NextResponse.json({ ok: false, ...data }, { status: res.status })
  }

  return NextResponse.json({ ok: true, ...data })
}
