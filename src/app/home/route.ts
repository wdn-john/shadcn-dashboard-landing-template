import { NextRequest, NextResponse } from "next/server"

/**
 * OAuth2 callback handler.
 *
 * The Spring backend redirects here after a successful social login:
 *   GET /home?access_token=...&refresh_token=...&email=...&roles=...
 *
 * In production the backend already sets the _workedin_access_token HttpOnly
 * cookie (domain=.workedin.ca), but in local dev the backend runs on a
 * different port so the cookie is unreachable from the Next.js origin.
 * We therefore always re-set the cookies from the URL params so both
 * environments work identically.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  const accessToken = searchParams.get("access_token")
  const refreshToken = searchParams.get("refresh_token")

  if (!accessToken) {
    return NextResponse.redirect(`${origin}/auth/sign-in`)
  }

  const response = NextResponse.redirect(`${origin}/dashboard`)
  const isProd = process.env.NODE_ENV === "production"

  // Access token — backend uses 15-minute expiry; we keep it alive for 1 hour
  // so minor clock skew doesn't immediately log the user out. The session check
  // (/auth/session) will catch any actually expired token.
  response.cookies.set("_workedin_access_token", accessToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  })

  if (refreshToken) {
    response.cookies.set("_workedin_refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days (matches backend refresh token lifetime)
    })
  }

  return response
}
