import { NextResponse } from "next/server"
import { cookies } from "next/headers"

export async function POST() {
  const token = (await cookies()).get("_workedin_access_token")?.value

  // Call backend logout to invalidate the refresh token server-side
  try {
    await fetch(`${process.env.API_BASE_URL}/auth/public/logout`, {
      method: "POST",
      headers: token ? { Cookie: `_workedin_access_token=${token}` } : {},
    })
  } catch {
    // Proceed with local cookie clear even if backend call fails
  }

  const res = NextResponse.json({ ok: true })

  // Clear the access token cookie by setting it to expire immediately
  res.cookies.set("_workedin_access_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })

  return res
}
