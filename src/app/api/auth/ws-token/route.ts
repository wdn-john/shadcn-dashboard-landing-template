import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// Returns the access token so the client can open a WebSocket connection.
// The token lives in an HttpOnly cookie — this endpoint bridges the gap.
// Only authenticated requests succeed (token is already validated by the fact
// that it exists and the caller is within a protected route).
export async function GET() {
  const token = (await cookies()).get("_workedin_access_token")?.value
  if (!token) {
    return NextResponse.json({ ok: false, message: "Not authenticated" }, { status: 401 })
  }
  return NextResponse.json({ ok: true, token })
}
