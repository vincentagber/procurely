import { cookies } from "next/headers";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function getServerUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("procurely_auth_token")?.value;

  if (!token) return null;

  try {
    const response = await fetch(`${apiBaseUrl}/api/auth/me`, {
      headers: {
        "Cookie": `procurely_auth_token=${token}`,
      },
      next: { revalidate: 0 } // Don't cache auth checks
    });

    if (!response.ok) return null;

    const payload = await response.json();
    return payload.data?.user ?? null;
  } catch (error) {
    console.error("[SSR Auth] Failed to fetch user:", error);
    return null;
  }
}
