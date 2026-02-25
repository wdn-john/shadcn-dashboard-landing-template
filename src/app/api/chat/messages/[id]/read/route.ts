import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// PATCH — mark a message as read
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/chat-rooms/messages/${id}/read`,
    {
      method: "PATCH",
      headers: { ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}) },
    }
  )

  if (!backendRes.ok) {
    return NextResponse.json({ ok: false }, { status: backendRes.status })
  }
  return NextResponse.json({ ok: true })
}
