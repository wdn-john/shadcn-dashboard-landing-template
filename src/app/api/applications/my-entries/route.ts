import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") ?? "0"
  const size = searchParams.get("size") ?? "20"
  const res = await serverFetch(`/applications/my-application-entries?page=${page}&size=${size}&sort=id,desc`)
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
