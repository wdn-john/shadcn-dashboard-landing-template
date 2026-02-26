import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function GET() {
  const res = await serverFetch("/promo-codes")
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const body = await req.json()
  const res = await serverFetch("/promo-codes", {
    method: "POST",
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
