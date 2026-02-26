import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const res = await serverFetch(`/certifications/${id}`, { method: "DELETE" })
  if (!res.ok) {
    const data = await res.json().catch(() => null)
    return NextResponse.json(data, { status: res.status })
  }
  return NextResponse.json({ ok: true })
}
