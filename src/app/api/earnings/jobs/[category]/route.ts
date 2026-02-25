import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// GET — expert earnings job list by category (ALL | CURRENT_MONTH | CURRENT_WEEK)
export async function GET(
  req: Request,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params
  const token = (await cookies()).get("_workedin_access_token")?.value
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") ?? "0"

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/earnings/jobs/${category}?page=${page}`,
    {
      headers: { ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}) },
      cache: "no-store",
    }
  )

  const raw = await backendRes.text().catch(() => "")
  let parsed: unknown = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to fetch earnings" },
      { status: backendRes.status }
    )
  }
  return NextResponse.json({ ok: true, data: parsed })
}
