import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function GET() {
  const res = await serverFetch("/admin/stats")
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
