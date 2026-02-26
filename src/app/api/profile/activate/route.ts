import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function POST(req: Request) {
  const { membershipNumber } = await req.json()
  const res = await serverFetch(`/profiles/membership/activate?membershipNumber=${encodeURIComponent(membershipNumber)}`, {
    method: "POST",
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
