import type {
  ApiEnvelope,
  ApiErrorEnvelope,
  Cart,
  CheckoutPayload,
  Order,
} from "@/lib/types";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
// Normalize: Remove trailing slash to avoid double-slash when concatenated with paths
const apiBaseUrl = rawBaseUrl.replace(/\/$/, "");

if (
  typeof process !== "undefined" &&
  process.env.NODE_ENV === "production" &&
  apiBaseUrl.startsWith("http://") &&
  !apiBaseUrl.includes("localhost") &&
  !apiBaseUrl.includes("127.0.0.1")
) {
  throw new Error(
    `[Procurely Security Exception] Critical: NEXT_PUBLIC_API_BASE_URL must use HTTPS in production. Plaintext HTTP is prohibited. Current: ${apiBaseUrl}`,
  );
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  // Add Authorization header if token exists in localStorage
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem("procurely-auth-token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (init?.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    const url = `${apiBaseUrl}${path}`;
    response = await fetch(url, {
      ...init,
      headers,
      credentials: "include", // Required for Cookie-based Auth
      signal: init?.signal ?? AbortSignal.timeout(15000), // Increased to 15s for enterprise stability
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "TimeoutError") {
      throw new Error("The request timed out. Please try again.");
    }

    console.error(`[Procurely API] Fetch failed to ${apiBaseUrl}${path}:`, error);
    throw new Error(`Unable to reach the Procurely API at ${apiBaseUrl}. Ensure the backend is running and CORS is allowed.`);
  }

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json")
    ? ((await response.json()) as ApiEnvelope<T> | ApiErrorEnvelope)
    : null;

  if (!response.ok || !payload || "error" in payload) {
    console.warn(`[Procurely API] Request to ${path} failed with status ${response.status}:`, payload);
    
    const message =
      payload && "error" in payload
        ? payload.error.message
        : `Request failed with status ${response.status}.`;
    throw new Error(message);
  }

  return payload.data;
}

export const api = {
  register(payload: { fullName: string; email: string; password: string }) {
    return request<{ token: string; user: { id: string; fullName: string; email: string; roles: string[]; permissions: string[]; walletBalance: number } }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },
  login(payload: { email: string; password: string }) {
    return request<{ token: string; user: { id: string; fullName: string; email: string; roles: string[]; permissions: string[]; walletBalance: number } }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },
  getMe() {
    return request<{ user: { id: string; fullName: string; email: string; roles: string[]; permissions: string[]; walletBalance: number } }>("/api/auth/me");
  },
  logout() {
    return request<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },
  getNotifications() {
    return request<Array<{ id: number; type: string; title: string; message?: string; data?: any; created_at: string }>>("/api/notifications");
  },
  markNotificationRead(id: number) {
    return request<{ message: string }>(`/api/notifications/${id}/read`, {
      method: "PATCH",
    });
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
   updateProfile(payload: { fullName: string; email: string; phone?: string; whatsapp?: string }) {
    return request<{ user: any; message: string }>("/api/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  getCompanyInfo() {
    return request<any>("/api/account/company");
  },
  updateCompany(payload: any) {
    return request<{ message: string }>("/api/account/company", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
  },
  getAddresses() {
    return request<any[]>("/api/account/addresses");
  },
  addAddress(payload: any) {
    return request<any>("/api/account/addresses", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  deleteAddress(id: number) {
    return request<{ message: string }>(`/api/account/addresses/${id}`, {
      method: "DELETE",
    });
  },
  getPaymentMethods() {
    return request<any[]>("/api/account/payment-methods");
  },
  getCart(cartToken: string) {
    return request<Cart>(`/api/cart/${cartToken}`);
  },
  mergeCart(payload: { sourceToken: string; destinationToken: string }) {
    return request<Cart>("/api/cart/merge", {
      method: "POST",
      body: JSON.stringify(payload),
    });
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
  createPaymentIntent(orderNumber: string, amount: number) {
    return request<{ client_secret: string; payment_intent_id: string }>("/api/payments/create-intent", {
      method: "POST",
      body: JSON.stringify({ orderNumber, amount }),
    });
  },
  confirmPaymentIntent(paymentIntentId: string) {
    return request<{ success: boolean }>("/api/payments/confirm-intent", {
      method: "POST",
      body: JSON.stringify({ paymentIntentId }),
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
  submitBoq(formData: FormData) {
    return request<{ message: string }>("/api/quotes", {
      method: "POST",
      body: formData,
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
  fundWallet(payload: { amount: number }) {
    return request<{ authorization_url: string; reference: string }>("/api/wallet/fund", {
      method: "POST",
      body: JSON.stringify(payload),
    });
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
  getAdminProducts() {
    return request<any[]>("/api/admin/products");
  },
  createAdminProduct(payload: any) {
    return request<any>("/api/admin/products", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateAdminProduct(id: string, payload: any) {
    return request<any>(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteAdminProduct(id: string) {
    return request<{ message: string }>(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
  },
  deleteAdminUser(uuid: string) {
    return request<{ message: string }>(`/api/admin/users/${encodeURIComponent(uuid)}`, {
      method: "DELETE",
    });
  },
};

// ─── Order history helpers ─────────────────────────────────────────────────────
export const ORDER_HISTORY_KEY = "procurely-order-history";

type StoredOrderRef = { orderNumber: string; cartToken: string; placedAt: string };

export function persistOrderRef(orderNumber: string, cartToken: string): void {
  if (typeof window === "undefined") return;
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

