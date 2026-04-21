"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { api } from "@/lib/api";
import type { Cart, CheckoutPayload, Order, Product } from "@/lib/types";
import { useUi } from "@/components/ui/ui-provider";

type CartContextValue = {
  cart: Cart | null;
  cartToken: string | null;
  loading: boolean;
  error: string | null;
  lastOrder: Order | null;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (id: number, quantity: number) => Promise<void>;
  removeItem: (id: number) => Promise<void>;
  checkout: (payload: CheckoutPayload) => Promise<Order | undefined>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

// Cart tokens are stored in sessionStorage to limit XSS exposure cross-session.
const cartStorageKey = "procurely-cart-token";

function readCartToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(cartStorageKey);
  } catch {
    return null;
  }
}

function writeCartToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(cartStorageKey, token);
  } catch {
    // Storage quota exceeded or private browsing restriction — degrade silently.
  }
}

export type CartProviderProps = {
  children: ReactNode;
  initialCart?: Cart | null;
  initialCartToken?: string | null;
  initialLastOrder?: Order | null;
};

function buildEmptyCart(cartToken: string): Cart {
  return {
    cartToken,
    items: [],
    subtotal: 0,
    vat: 0,
    shippingFee: 0,
    serviceFee: 0,
    total: 0,
  };
}

export function CartProvider({
  children,
  initialCart = null,
  initialCartToken = null,
  initialLastOrder = null,
}: CartProviderProps) {
  const { openCart } = useUi();
  const [cartToken, setCartToken] = useState<string | null>(initialCartToken);
  const [cart, setCart] = useState<Cart | null>(
    initialCartToken ? initialCart ?? buildEmptyCart(initialCartToken) : initialCart,
  );
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(initialLastOrder);

  async function hydrateCart(token: string) {
    try {
      setLoading(true);
      setError(null);
      const nextCart = await api.getCart(token);
      startTransition(() => {
        setCart(nextCart);
      });
    } catch (nextError) {
      setError(
        nextError instanceof Error ? nextError.message : "Unable to load cart.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    // MEDIUM-11: Use sessionStorage (see above). Generate a new UUID if none exists.
    const storedToken = readCartToken();
    const nextToken = storedToken || (typeof window !== "undefined" && window.crypto ? window.crypto.randomUUID() : Math.random().toString(36).substring(2));
    writeCartToken(nextToken);
    setCartToken(nextToken);
    void hydrateCart(nextToken);

    // Cross-tab sync: when another tab writes a new cart token (e.g. after a
    // page refresh that generates a fresh session), pick it up here.
    const channel = typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel("procurely-cart")
      : null;

    if (channel) {
      channel.onmessage = (event: MessageEvent<{ cartToken: string }>) => {
        if (typeof event.data?.cartToken === "string" && event.data.cartToken !== nextToken) {
          writeCartToken(event.data.cartToken);
          setCartToken(event.data.cartToken);
          void hydrateCart(event.data.cartToken);
        }
      };
      // Announce this tab's token so other tabs can sync.
      channel.postMessage({ cartToken: nextToken });
    }

    return () => {
      channel?.close();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCart, initialCartToken]);

  async function addItem(productId: string, quantity = 1) {
    if (!cartToken) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const nextCart = await api.addCartItem({ cartToken, productId, quantity });
      startTransition(() => {
        setCart(nextCart);
      });
      openCart();
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to add item to cart.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function updateItemQuantity(id: number, quantity: number) {
    if (!cartToken) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const nextCart = await api.updateCartItem({ id, cartToken, quantity });
      startTransition(() => {
        setCart(nextCart);
      });
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to update cart item.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(id: number) {
    if (!cartToken) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const nextCart = await api.removeCartItem({ id, cartToken });
      startTransition(() => {
        setCart(nextCart);
      });
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to remove cart item.",
      );
    } finally {
      setLoading(false);
    }
  }

  async function checkout(payload: CheckoutPayload): Promise<Order | undefined> {
    if (!cartToken) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const order = await api.checkout({ ...payload, cartToken });
      startTransition(() => {
        setLastOrder(order);
      });
      return order;
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to complete checkout.",
      );
      return;
    } finally {
      setLoading(false);
    }
  }

  async function refreshCart() {
    if (!cartToken) {
      return;
    }

    await hydrateCart(cartToken);
  }

  function clearCart() {
    if (!cartToken) return;
    setCart(buildEmptyCart(cartToken));
  }

  const value: CartContextValue = {
    cart,
    cartToken,
    loading: mounted ? loading : false,
    error,
    lastOrder,
    addItem,
    updateItemQuantity,
    removeItem,
    checkout,
    refreshCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider.");
  }

  return context;
}
