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
import { NotificationProvider } from "@/components/notifications/notification-provider";

type ProvidersProps = {
  children: ReactNode;
  withDrawers?: boolean;
  initialUser?: any;
};

export function Providers({
  children,
  withDrawers = true,
  initialUser = null,
}: ProvidersProps) {
  return (
    <UiProvider>
      <AuthProvider initialUser={initialUser}>
        <NotificationProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              {withDrawers ? <CartDrawer /> : null}
              {withDrawers ? <QuoteDrawer /> : null}
            </WishlistProvider>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </UiProvider>
  );
}
