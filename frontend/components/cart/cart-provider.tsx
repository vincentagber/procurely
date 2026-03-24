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
  checkout: (payload: CheckoutPayload) => Promise<void>;
  refreshCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);
const cartStorageKey = "procurely-cart-token";

export type CartProviderProps = {
  children: ReactNode;
  hydrateFromApi?: boolean;
  catalog?: Product[];
  initialCart?: Cart | null;
  initialCartToken?: string | null;
  initialLastOrder?: Order | null;
};

function calculateCartTotals(items: Cart["items"]) {
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  const serviceFee = subtotal >= 100000 ? 0 : subtotal > 0 ? 3500 : 0;

  return {
    subtotal,
    serviceFee,
    total: subtotal + serviceFee,
  };
}

function buildCartItem(
  product: Product,
  quantity: number,
  id: number,
  cartToken: string,
) {
  return {
    id,
    cartToken,
    quantity,
    lineTotal: product.price * quantity,
    product,
  };
}

function buildEmptyCart(cartToken: string): Cart {
  return {
    cartToken,
    items: [],
    subtotal: 0,
    serviceFee: 0,
    total: 0,
  };
}

export function CartProvider({
  children,
  hydrateFromApi = true,
  catalog = [],
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
    if (!hydrateFromApi) {
      const nextToken = initialCartToken || "storybook-cart";
      setCartToken(nextToken);
      setCart((current) => current ?? initialCart ?? buildEmptyCart(nextToken));
      return;
    }

    const storedToken = window.localStorage.getItem(cartStorageKey);
    const nextToken = storedToken || window.crypto.randomUUID();
    window.localStorage.setItem(cartStorageKey, nextToken);
    setCartToken(nextToken);
    void hydrateCart(nextToken);
  }, [hydrateFromApi, initialCart, initialCartToken]);

  async function addItem(productId: string, quantity = 1) {
    if (!cartToken) {
      return;
    }

    if (!hydrateFromApi) {
      const product = catalog.find((item) => item.id === productId);

      if (!product) {
        setError("Unable to add item to cart.");
        return;
      }

      startTransition(() => {
        setCart((current) => {
          const base = current ?? buildEmptyCart(cartToken);
          const existing = base.items.find((item) => item.product.id === productId);
          const nextItems = existing
            ? base.items.map((item) =>
                item.id === existing.id
                  ? buildCartItem(product, item.quantity + quantity, item.id, cartToken)
                  : item,
              )
            : [
                ...base.items,
                buildCartItem(
                  product,
                  quantity,
                  Math.max(0, ...base.items.map((item) => item.id)) + 1,
                  cartToken,
                ),
              ];

          return {
            cartToken,
            items: nextItems,
            ...calculateCartTotals(nextItems),
          };
        });
      });
      setError(null);
      openCart();
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

    if (!hydrateFromApi) {
      startTransition(() => {
        setCart((current) => {
          const base = current ?? buildEmptyCart(cartToken);
          const nextItems = base.items.map((item) =>
            item.id === id
              ? buildCartItem(item.product, Math.max(1, quantity), item.id, cartToken)
              : item,
          );

          return {
            cartToken,
            items: nextItems,
            ...calculateCartTotals(nextItems),
          };
        });
      });
      setError(null);
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

    if (!hydrateFromApi) {
      startTransition(() => {
        setCart((current) => {
          const base = current ?? buildEmptyCart(cartToken);
          const nextItems = base.items.filter((item) => item.id !== id);

          return {
            cartToken,
            items: nextItems,
            ...calculateCartTotals(nextItems),
          };
        });
      });
      setError(null);
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

    if (!hydrateFromApi) {
      const activeCart = cart ?? buildEmptyCart(cartToken);

      if (activeCart.items.length === 0) {
        setError("Cart is empty.");
        return;
      }

      const order: Order = {
        orderNumber: `PR-SB-${String(Math.floor(Math.random() * 100000)).padStart(5, "0")}`,
        status: "processing",
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        phone: payload.phone,
        address: payload.address,
        subtotal: activeCart.subtotal,
        serviceFee: activeCart.serviceFee,
        total: activeCart.total,
        createdAt: new Date().toISOString(),
        items: activeCart.items.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          unitPrice: item.product.price,
          quantity: item.quantity,
          lineTotal: item.lineTotal,
        })),
      };

      startTransition(() => {
        setLastOrder(order);
        setCart(buildEmptyCart(cartToken));
      });
      setError(null);
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

    if (!hydrateFromApi) {
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
