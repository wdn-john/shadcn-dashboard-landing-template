import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const res = await serverFetch(`/admin/identity-verification/${id}/approve`, { method: "POST" })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    return NextResponse.json(data, { status: res.status })
  }
  return NextResponse.json({ ok: true })
}
