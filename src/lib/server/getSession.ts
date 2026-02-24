import { cookies } from "next/headers";
import type { Session } from "@/types/Session";

export async function getSession(): Promise<Session> {
  const token = (await cookies()).get("_workedin_access_token")?.value;

  if (!token) return { isAuthenticated: false };

  const res = await fetch(`${process.env.API_BASE_URL}/auth/session`, {
    method: "GET",
    headers: {
      Cookie: `_workedin_access_token=${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return { isAuthenticated: false };

  return (await res.json()) as Session;
}