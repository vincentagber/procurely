"use client";

import type { ReactNode } from "react";

import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { QuoteDrawer } from "@/components/quote/quote-drawer";
import { UiProvider } from "@/components/ui/ui-provider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <UiProvider>
      <CartProvider>
        {children}
        <CartDrawer />
        <QuoteDrawer />
      </CartProvider>
    </UiProvider>
  );
}
