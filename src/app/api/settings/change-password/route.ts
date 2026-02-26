import { NextResponse } from "next/server"
import { serverFetch } from "@/lib/server/api"

export async function POST(req: Request) {
  const body = await req.json()
  const res = await serverFetch("/auth/public/reset-password-in-app", {
    method: "POST",
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => null)
  if (!res.ok) return NextResponse.json(data, { status: res.status })
  return NextResponse.json(data)
}
