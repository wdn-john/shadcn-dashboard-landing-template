import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function POST(req: Request) {
  const body = await req.json()

  const backendRes = await serverFetch("/reviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const raw = await backendRes.text().catch(() => "")
  let parsed: unknown = null
  try { parsed = JSON.parse(raw) } catch { /* not JSON */ }

  if (!backendRes.ok) {
    return NextResponse.json(
      { ok: false, message: (parsed as any)?.message ?? "Failed to submit review" },
      { status: backendRes.status }
    )
  }
  return NextResponse.json({ ok: true, data: parsed })
}
