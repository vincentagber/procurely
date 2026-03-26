"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  startTransition,
} from "react";

import { api } from "@/lib/api";
import type { Product, Wishlist } from "@/lib/types";

type WishlistContextValue = {
  wishlist: Wishlist | null;
  wishlistToken: string | null;
  loading: boolean;
  error: string | null;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const wishlistStorageKey = "procurely-wishlist-token";

function readWishlistToken(): string | null {
  try {
    return window.sessionStorage.getItem(wishlistStorageKey);
  } catch {
    return null;
  }
}

function writeWishlistToken(token: string): void {
  try {
    window.sessionStorage.setItem(wishlistStorageKey, token);
  } catch {
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistToken, setWishlistToken] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function hydrateWishlist(token: string) {
    try {
      setLoading(true);
      const nextWishlist = await api.getWishlist(token);
      startTransition(() => {
        setWishlist(nextWishlist);
      });
    } catch (err) {
      console.error("Failed to hydrate wishlist", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const storedToken = readWishlistToken();
    const nextToken = storedToken || window.crypto.randomUUID();
    writeWishlistToken(nextToken);
    setWishlistToken(nextToken);
    void hydrateWishlist(nextToken);

    const channel = typeof BroadcastChannel !== "undefined"
      ? new BroadcastChannel("procurely-wishlist")
      : null;

    if (channel) {
      channel.onmessage = (event) => {
        if (event.data?.wishlistToken && event.data.wishlistToken !== nextToken) {
          writeWishlistToken(event.data.wishlistToken);
          setWishlistToken(event.data.wishlistToken);
          void hydrateWishlist(event.data.wishlistToken);
        }
      };
      channel.postMessage({ wishlistToken: nextToken });
    }

    return () => {
      channel?.close();
    };
  }, []);

  async function addItem(productId: string) {
    if (!wishlistToken) return;
    try {
      setLoading(true);
      const nextWishlist = await api.addWishlistItem({ wishlistToken, productId });
      setWishlist(nextWishlist);
    } catch (err) {
      setError("Failed to add to wishlist");
    } finally {
      setLoading(false);
    }
  }

  async function removeItem(productId: string) {
    if (!wishlistToken) return;
    try {
      setLoading(true);
      const nextWishlist = await api.removeWishlistItem({ wishlistToken, productId });
      setWishlist(nextWishlist);
    } catch (err) {
      setError("Failed to remove from wishlist");
    } finally {
      setLoading(false);
    }
  }

  function isInWishlist(productId: string) {
    return wishlist?.items.some((p) => p.id === productId) ?? false;
  }

  const value: WishlistContextValue = {
    wishlist,
    wishlistToken,
    loading,
    error,
    addItem,
    removeItem,
    isInWishlist,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider.");
  }
  return context;
}
