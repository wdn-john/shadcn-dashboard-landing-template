import { NextResponse } from "next/server"
import { cookies } from "next/headers"

// POST — create a service request (multipart/form-data proxy)
export async function POST(req: Request) {
  const token = (await cookies()).get("_workedin_access_token")?.value

  // Parse incoming FormData and forward as-is
  const formData = await req.formData()

  const backendRes = await fetch(
    `${process.env.API_BASE_URL}/service-requests`,
    {
      method: "POST",
      headers: {
        // Do NOT set Content-Type — fetch sets it automatically with the correct boundary
        ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
      },
      body: formData,
    }
  )

  const raw = await backendRes.text().catch(() => "")
  let parsed: Record<string, unknown> | null = null
  try {
    parsed = JSON.parse(raw)
  } catch {
    // not JSON
  }

  if (!backendRes.ok) {
    return NextResponse.json(
      {
        ok: false,
        message: (parsed as any)?.message ?? raw ?? "Failed to create request",
        errors: (parsed as any)?.errors ?? undefined,
      },
      { status: backendRes.status }
    )
  }

  return NextResponse.json({ ok: true, data: parsed })
}
