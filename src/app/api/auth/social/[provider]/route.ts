import { NextRequest, NextResponse } from "next/server"

const ALLOWED_PROVIDERS = ["google", "facebook", "apple"]

/**
 * Initiates social OAuth login by redirecting to the Spring backend's
 * OAuth2 authorization endpoint.
 *
 * The backend's AuthController.oauthLogin stores the post-auth redirect
 * destination in the session (based on platform), then Spring Security
 * redirects the browser to the provider's OAuth consent page.
 *
 * After the user authenticates, the backend redirects to:
 *   {frontendUrl}/home?access_token=...&refresh_token=...
 *
 * That URL is handled by src/app/home/route.ts.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params

  if (!ALLOWED_PROVIDERS.includes(provider)) {
    return NextResponse.json({ error: "Invalid provider" }, { status: 400 })
  }

  // API_BASE_URL already includes /api/v1 (e.g. http://localhost:8080/api/v1)
  const apiBase = (process.env.API_BASE_URL ?? "").replace(/\/$/, "")

  // platform=WEB tells the backend to use platformConfig.getFrontendUrl()+"/home"
  // as the post-auth redirect destination (stored in HTTP session)
  const oauthUrl = `${apiBase}/auth/login/${provider}?platform=WEB`

  return NextResponse.redirect(oauthUrl)
}
