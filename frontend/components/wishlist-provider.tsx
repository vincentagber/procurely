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
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(wishlistStorageKey);
  } catch {
    return null;
  }
}

function writeWishlistToken(token: string): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(wishlistStorageKey, token);
  } catch {
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistToken, setWishlistToken] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function hydrateWishlist(token: string) {
    try {
      setLoading(true);
      // Attempt to load from storage first for instant UI response
      if (typeof window !== "undefined") {
        const cached = window.localStorage.getItem(`wishlist_cache_${token}`);
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setWishlist(parsed);
          } catch {}
        }
      }

      const nextWishlist = await api.getWishlist(token);
      
      // Update cache
      if (typeof window !== "undefined") {
        window.localStorage.setItem(`wishlist_cache_${token}`, JSON.stringify(nextWishlist));
      }
      
      startTransition(() => {
        setWishlist(nextWishlist);
      });
    } catch (err) {
      console.warn("Failed to hydrate wishlist from API, using cache if available", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;

    const storedToken = readWishlistToken();
    const nextToken = storedToken || (typeof window !== "undefined" && window.crypto ? window.crypto.randomUUID() : Math.random().toString(36).substring(2));
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
    loading: mounted ? loading : false,
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
