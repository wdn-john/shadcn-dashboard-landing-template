import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await req.json()
  const res = await serverFetch(`/admin/profiles/${id}/account-status`, {
    method: "PATCH",
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
