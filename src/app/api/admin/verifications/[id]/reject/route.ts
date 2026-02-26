import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const res = await serverFetch(`/admin/identity-verification/${id}/reject`, {
    method: "POST",
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    return NextResponse.json(data, { status: res.status })
  }
  return NextResponse.json({ ok: true })
}
