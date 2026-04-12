"use client";

import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart/cart-drawer";
import {
  CartProvider,
  type CartProviderProps,
} from "@/components/cart/cart-provider";
import { QuoteDrawer } from "@/components/quote/quote-drawer";
import { UiProvider } from "@/components/ui/ui-provider";

import { WishlistProvider } from "@/components/wishlist-provider";

import { AuthProvider } from "@/components/auth/auth-provider";



type ProvidersProps = {
  children: ReactNode;
  cartProviderProps?: Omit<CartProviderProps, "children">;
  withDrawers?: boolean;
  initialUser?: any;
};

export function Providers({
  children,
  cartProviderProps,
  withDrawers = true,
  initialUser = null,
}: ProvidersProps) {
  return (
    <UiProvider>
      <AuthProvider initialUser={initialUser}>
        <CartProvider {...cartProviderProps}>
          <WishlistProvider>
            {children}
            {withDrawers ? <CartDrawer /> : null}
            {withDrawers ? <QuoteDrawer /> : null}
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </UiProvider>
  );
}
