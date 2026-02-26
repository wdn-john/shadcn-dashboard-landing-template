import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const AUTH_COOKIE = "_workedin_access_token"

// Routes that require authentication
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/requests",
  "/browse-requests",
  "/missions",
  "/jobs",
  "/chat",
  "/payments",
  "/applications",
  "/earnings",
  "/profile",
  "/settings",
  "/experts",
  "/disputes",
  "/profile-setup",
]

// Auth routes — authenticated users should not see these
const AUTH_PREFIXES = ["/auth/"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(AUTH_COOKIE)?.value

  // Legacy redirects
  if (pathname === "/login") {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url))
  }
  if (pathname === "/register") {
    return NextResponse.redirect(new URL("/auth/sign-up", request.url))
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  const isAuthPage = AUTH_PREFIXES.some((p) => pathname.startsWith(p))

  // Unauthenticated user trying to access a protected route → sign-in
  if (isProtected && !token) {
    const signInUrl = new URL("/auth/sign-in", request.url)
    signInUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Authenticated user trying to access auth pages → dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
