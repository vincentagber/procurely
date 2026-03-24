"use client";

import type { ReactNode } from "react";

import { CartDrawer } from "@/components/cart/cart-drawer";
import {
  CartProvider,
  type CartProviderProps,
} from "@/components/cart/cart-provider";
import { QuoteDrawer } from "@/components/quote/quote-drawer";
import { UiProvider } from "@/components/ui/ui-provider";

type ProvidersProps = {
  children: ReactNode;
  cartProviderProps?: Omit<CartProviderProps, "children">;
  withDrawers?: boolean;
};

export function Providers({
  children,
  cartProviderProps,
  withDrawers = true,
}: ProvidersProps) {
  return (
    <UiProvider>
      <CartProvider {...cartProviderProps}>
        {children}
        {withDrawers ? <CartDrawer /> : null}
        {withDrawers ? <QuoteDrawer /> : null}
      </CartProvider>
    </UiProvider>
  );
}
