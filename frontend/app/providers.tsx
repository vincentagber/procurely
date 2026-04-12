"use client";

import type { ReactNode } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { CartDrawer } from "@/components/cart/cart-drawer";
import {
  CartProvider,
  type CartProviderProps,
} from "@/components/cart/cart-provider";
import { QuoteDrawer } from "@/components/quote/quote-drawer";
import { UiProvider } from "@/components/ui/ui-provider";

import { WishlistProvider } from "@/components/wishlist-provider";

import { AuthProvider } from "@/components/auth/auth-provider";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

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
      <AuthProvider>
        <Elements stripe={stripePromise}>
          <CartProvider {...cartProviderProps}>
            <WishlistProvider>
              {children}
              {withDrawers ? <CartDrawer /> : null}
              {withDrawers ? <QuoteDrawer /> : null}
            </WishlistProvider>
          </CartProvider>
        </Elements>
      </AuthProvider>
    </UiProvider>
  );
}
