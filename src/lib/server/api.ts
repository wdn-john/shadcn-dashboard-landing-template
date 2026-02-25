import { cookies } from "next/headers";

/**
 * Authenticated server-side fetch to the Spring Boot backend.
 * Automatically injects the access token cookie from the incoming request.
 */
export async function serverFetch(
  path: string,
  options?: RequestInit
): Promise<Response> {
  const token = (await cookies()).get("_workedin_access_token")?.value;

  return fetch(`${process.env.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Cookie: `_workedin_access_token=${token}` } : {}),
      ...(options?.headers ?? {}),
    },
    cache: "no-store",
  });
}

/**
 * Typed JSON fetch — returns parsed data or null on failure.
 */
export async function serverGet<T>(path: string): Promise<T | null> {
  try {
    const res = await serverFetch(path);
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}
