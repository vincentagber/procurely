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
import type { Cart, CheckoutPayload, Order } from "@/lib/types";
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
  checkout: (payload: CheckoutPayload) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);
const cartStorageKey = "procurely-cart-token";

export function CartProvider({ children }: { children: ReactNode }) {
  const { openCart } = useUi();
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartToken, setCartToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

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
    const storedToken = window.localStorage.getItem(cartStorageKey);
    const nextToken = storedToken || window.crypto.randomUUID();
    window.localStorage.setItem(cartStorageKey, nextToken);
    setCartToken(nextToken);
    void hydrateCart(nextToken);
  }, []);

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

  async function checkout(payload: CheckoutPayload) {
    if (!cartToken) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const order = await api.checkout({ ...payload, cartToken });
      startTransition(() => {
        setLastOrder(order);
        setCart({
          cartToken,
          items: [],
          subtotal: 0,
          serviceFee: 0,
          total: 0,
        });
      });
    } catch (nextError) {
      setError(
        nextError instanceof Error
          ? nextError.message
          : "Unable to complete checkout.",
      );
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

  const value: CartContextValue = {
    cart,
    cartToken,
    loading,
    error,
    lastOrder,
    addItem,
    updateItemQuantity,
    removeItem,
    checkout,
    refreshCart,
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
