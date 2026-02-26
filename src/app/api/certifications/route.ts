import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function GET() {
  const res = await serverFetch("/certifications")
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const payload = Array.isArray(body) ? body : [body]
  const res = await serverFetch("/certifications", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
