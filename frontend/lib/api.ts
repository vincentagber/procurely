"use client";

import type {
  ApiEnvelope,
  ApiErrorEnvelope,
  Cart,
  CheckoutPayload,
  Order,
} from "@/lib/types";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  const payload = (await response.json()) as ApiEnvelope<T> | ApiErrorEnvelope;

  if (!response.ok || "error" in payload) {
    const message =
      "error" in payload
        ? payload.error.message
        : "Unable to complete the request.";
    throw new Error(message);
  }

  return payload.data;
}

export const api = {
  register(payload: { fullName: string; email: string; password: string }) {
    return request<{ token: string; user: { id: string; fullName: string; email: string } }>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
  },
  login(payload: { email: string; password: string }) {
    return request<{ token: string; user: { id: string; fullName: string; email: string } }>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );
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
};
