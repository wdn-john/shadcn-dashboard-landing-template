import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function GET() {
  const res = await serverFetch("/experiences")
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  // Backend accepts List<ExperienceDto>
  const payload = Array.isArray(body) ? body : [body]
  const res = await serverFetch("/experiences", {
    method: "POST",
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
