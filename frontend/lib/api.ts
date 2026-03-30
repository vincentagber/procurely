import type {
  ApiEnvelope,
  ApiErrorEnvelope,
  Cart,
  CheckoutPayload,
  Order,
} from "@/lib/types";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// MEDIUM-7 FIX: In production, reject any API base URL that isn't HTTPS.
// This fails loudly during build/startup rather than silently sending 
// customer credentials over plaintext HTTP in production.
/*
if (
  typeof process !== "undefined" &&
  process.env.NODE_ENV === "production" &&
  apiBaseUrl.startsWith("http://")
) {
  throw new Error(
    `[Procurely] NEXT_PUBLIC_API_BASE_URL must use HTTPS in production. Got: ${apiBaseUrl}`,
  );
}
*/

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  // Retrieve auth token if available
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("procurely-auth-token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (init?.body) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...init,
      headers,
      signal: init?.signal ?? AbortSignal.timeout(8000),
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new Error("The request timed out. Please try again.");
    }

    console.error(`[Procurely API] Fetch failed to ${path}:`, error);
    throw new Error("Unable to reach the Procurely API. Ensure the backend is running and CORS is allowed.");
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as ApiEnvelope<T> | ApiErrorEnvelope)
    : null;

  if (!response.ok || !payload || "error" in payload) {
    const message =
      payload && "error" in payload
        ? payload.error.message
        : "Unable to complete the request.";
    throw new Error(message);
  }

  return payload.data;
}

export const api = {
  register(payload: { fullName: string; email: string; password: string }) {
    return request<{ token: string; user: { id: string; fullName: string; email: string; role: string } }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },
  login(payload: { email: string; password: string }) {
    return request<{ token: string; user: { id: string; fullName: string; email: string; role: string } }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },
  getMe() {
    return request<{ user: { id: string; fullName: string; email: string; role: string } }>("/api/auth/me");
  },
  forgotPassword(payload: { email: string }) {
    return request<{ message: string; resetTokenPreview?: string }>(
      "/api/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },
  updateProfile(payload: { fullName: string; email: string }) {
    return request<{ user: any; message: string }>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  getCart(cartToken: string) {
    return request<Cart>(`/api/cart/${cartToken}`);
  },
  addCartItem(payload: {
    cartToken: string;
    productId: string;
    quantity?: number;
  }) {
    return request<Cart>("/api/cart/items", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateCartItem(payload: {
    id: number;
    cartToken: string;
    quantity: number;
  }) {
    return request<Cart>(`/api/cart/items/${payload.id}`, {
      method: "PATCH",
      body: JSON.stringify({
        cartToken: payload.cartToken,
        quantity: payload.quantity,
      }),
    });
  },
  removeCartItem(payload: { id: number; cartToken: string }) {
    return request<Cart>(
      `/api/cart/items/${payload.id}?token=${encodeURIComponent(payload.cartToken)}`,
      {
        method: "DELETE",
      },
    );
  },
  checkout(payload: CheckoutPayload & { cartToken: string }) {
    return request<Order>("/api/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  requestQuote(payload: {
    companyName: string;
    fullName: string;
    email: string;
    phone: string;
    projectLocation: string;
    boqNotes: string;
  }) {
    return request<{ message: string }>("/api/quotes", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  subscribeToNewsletter(payload: { email: string }) {
    return request<{ message: string }>("/api/newsletter", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  getOrder(orderNumber: string, cartToken: string = "", email: string = "") {
    const params = new URLSearchParams();
    if (cartToken) params.set("cartToken", cartToken);
    if (email) params.set("email", email);
    
    const queryString = params.toString() ? `?${params.toString()}` : "";
    return request<Order>(`/api/orders/${encodeURIComponent(orderNumber)}${queryString}`);
  },
  getAccountOrders() {
    return request<any[]>("/api/account/orders");
  },
  getWishlist(wishlistToken: string) {
    return request<{ wishlistToken: string; items: any[] }>(`/api/wishlist/${wishlistToken}`);
  },
  addWishlistItem(payload: { wishlistToken: string; productId: string }) {
    return request<{ wishlistToken: string; items: any[] }>("/api/wishlist/items", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  removeWishlistItem(payload: { wishlistToken: string; productId: string }) {
    return request<{ wishlistToken: string; items: any[] }>(
      `/api/wishlist/items/${payload.productId}?token=${encodeURIComponent(payload.wishlistToken)}`,
      {
        method: "DELETE",
      },
    );
  },
  // ─── Admin ──────────────────────────────────────────────────────────────────
  getAdminStats() {
    return request<{ totalOrders: number; totalUsers: number; totalRevenue: number; pendingQuotes: number }>("/api/admin/stats");
  },
  getAdminOrders(limit = 50, offset = 0) {
    return request<any[]>(`/api/admin/orders?limit=${limit}&offset=${offset}`);
  },
  getAdminUsers(limit = 50, offset = 0) {
    return request<any[]>(`/api/admin/users?limit=${limit}&offset=${offset}`);
  },
  updateOrderStatus(orderNumber: string, status: string) {
    return request<{ message: string }>(`/api/admin/orders/${orderNumber}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  },
};

// ─── Order history helpers ─────────────────────────────────────────────────────
export const ORDER_HISTORY_KEY = "procurely-order-history";

type StoredOrderRef = { orderNumber: string; cartToken: string; placedAt: string };

export function persistOrderRef(orderNumber: string, cartToken: string): void {
  try {
    const raw = window.sessionStorage.getItem(ORDER_HISTORY_KEY);
    const existing: StoredOrderRef[] = raw ? (JSON.parse(raw) as StoredOrderRef[]) : [];
    const deduped = existing.filter((r) => r.orderNumber !== orderNumber);
    window.sessionStorage.setItem(
      ORDER_HISTORY_KEY,
      JSON.stringify([{ orderNumber, cartToken, placedAt: new Date().toISOString() }, ...deduped]),
    );
  } catch {
    // sessionStorage unavailable — degrade silently
  }
}

