"use client";

import { createContext, useContext, useEffect, useState, useRef, ReactNode } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  roles: string[];
  permissions: string[];
  walletBalance: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: (force?: boolean) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session is considered fresh for 5 minutes — avoids spamming auth/me on every route change
const SESSION_TTL_MS = 5 * 60 * 1000;

export function AuthProvider({ 
  children, 
  initialUser = null 
}: { 
  children: ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const lastRefreshed = useRef<number>(initialUser ? Date.now() : 0);
  const router = useRouter();

  const refreshUser = async (force = false) => {
    const isStale = Date.now() - lastRefreshed.current > SESSION_TTL_MS;

    // Skip the network call if we have a fresh session and no force flag
    if (!force && !isStale && user !== null) {
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
      lastRefreshed.current = Date.now();
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On mount: only fetch if SSR gave us nothing AND we have a token hint
    const hasTokenHint = typeof window !== "undefined" && !!window.localStorage.getItem("procurely-auth-token");
    
    if (!initialUser && hasTokenHint) {
      refreshUser(true);
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = async () => {
    setLoading(true);
    try {
      await api.logout();
    } catch (e) {
      console.warn("Server-side logout failed:", e);
    }
    lastRefreshed.current = 0;
    setUser(null);
    setLoading(false);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
