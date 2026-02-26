import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const res = await serverFetch(`/applications/entry-details/${id}`)
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
