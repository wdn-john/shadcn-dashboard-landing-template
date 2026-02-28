import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// POST — create or retrieve a private chat room with a specific user
export async function POST(
  req: Request,
  { params }: { params: Promise<{ recipientId: string }> }
) {
  const { recipientId } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  const body = await req.json().catch(() => ({}))

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/chat-rooms/private/${recipientId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  )

  const raw = await backendRes.text().catch(() => "")
  let parsed: Record<string, unknown> | null = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to create chat room" },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, data: parsed })
}
