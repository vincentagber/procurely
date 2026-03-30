"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    const token = window.localStorage.getItem("procurely-auth-token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await api.getMe();
      setUser(data.user);
    } catch (error) {
      console.error("Auth error:", error);
      window.localStorage.removeItem("procurely-auth-token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const logout = () => {
    window.localStorage.removeItem("procurely-auth-token");
    setUser(null);
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
