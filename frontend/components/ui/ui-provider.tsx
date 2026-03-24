"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type UiContextValue = {
  cartOpen: boolean;
  quoteOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  openQuote: () => void;
  closeQuote: () => void;
};

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  const value: UiContextValue = {
    cartOpen,
    quoteOpen,
    openCart: () => setCartOpen(true),
    closeCart: () => setCartOpen(false),
    openQuote: () => setQuoteOpen(true),
    closeQuote: () => setQuoteOpen(false),
  };

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const context = useContext(UiContext);

  if (!context) {
    throw new Error("useUi must be used within UiProvider.");
  }

  return context;
}
