"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";

import { TextField, TextAreaField } from "@/components/forms/form-field";
import { useCart } from "@/components/cart/cart-provider";
import { useUi } from "@/components/ui/ui-provider";
import { formatCurrency } from "@/lib/format";

export function CartDrawer() {
  const { cartOpen, closeCart } = useUi();
  const { cart, loading, error, updateItemQuantity, removeItem, checkout, lastOrder } =
    useCart();
  const [checkoutForm, setCheckoutForm] = useState({
    customerName: "",
    customerEmail: "",
    phone: "",
    address: "",
  });

  return (
    <AnimatePresence>
      {cartOpen ? (
        <>
          <motion.button
            aria-label="Close cart"
            className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            aria-label="Cart drawer"
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[460px] flex-col overflow-y-auto bg-white px-5 pb-6 pt-5 shadow-2xl md:px-6"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--color-brand-accent)]">
                  Procurement cart
                </p>
                <h2 className="text-2xl font-semibold text-[var(--color-brand-navy)]">
                  Review your order
                </h2>
              </div>
              <button
                className="inline-flex size-11 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:text-slate-900"
                onClick={closeCart}
                type="button"
              >
                <X className="size-5" />
              </button>
            </div>

            {lastOrder ? (
              <div className="mb-6 rounded-[24px] border border-emerald-100 bg-emerald-50 p-5 text-emerald-950">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                  Order placed
                </p>
                <h3 className="mt-2 text-xl font-semibold">{lastOrder.orderNumber}</h3>
                <p className="mt-2 text-sm text-emerald-800">
                  We have received your procurement request and your order is now
                  processing.
                </p>
              </div>
            ) : null}

            {error ? (
              <div className="mb-5 rounded-[18px] border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {cart && cart.items.length > 0 ? (
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <article
                    className="rounded-[24px] border border-slate-100 bg-[var(--color-surface-soft)] p-4"
                    key={item.id}
                  >
                    <div className="flex gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        alt={item.product.name}
                        className="size-24 rounded-[18px] bg-white object-cover p-2"
                        src={item.product.image}
                      />
                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="text-xs text-slate-500">{item.product.category}</p>
                        <h3 className="line-clamp-2 text-base font-semibold text-[var(--color-brand-navy)]">
                          {item.product.name}
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          {item.product.shortDescription}
                        </p>
                        <div className="mt-auto flex items-center justify-between pt-4">
                          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white">
                            <button
                              className="inline-flex size-10 items-center justify-center text-slate-500 transition hover:text-slate-900"
                              onClick={() =>
                                void updateItemQuantity(
                                  item.id,
                                  Math.max(1, item.quantity - 1),
                                )
                              }
                              type="button"
                            >
                              <Minus className="size-4" />
                            </button>
                            <span className="min-w-8 text-center text-sm font-semibold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              className="inline-flex size-10 items-center justify-center text-slate-500 transition hover:text-slate-900"
                              onClick={() =>
                                void updateItemQuantity(item.id, item.quantity + 1)
                              }
                              type="button"
                            >
                              <Plus className="size-4" />
                            </button>
                          </div>
                          <div className="flex items-center gap-3">
                            <p className="text-sm font-semibold text-[var(--color-brand-navy)]">
                              {formatCurrency(item.lineTotal, item.product.currency)}
                            </p>
                            <button
                              className="inline-flex size-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
                              onClick={() => void removeItem(item.id)}
                              type="button"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-[var(--color-surface-soft)] px-6 py-12 text-center">
                <ShoppingBag className="size-10 text-[var(--color-brand-blue)]" />
                <h3 className="mt-4 text-xl font-semibold text-[var(--color-brand-navy)]">
                  Your cart is empty
                </h3>
                <p className="mt-2 max-w-sm text-sm text-slate-500">
                  Add a few core materials and return here to complete your
                  procurement checkout.
                </p>
              </div>
            )}

            <div className="mt-6 rounded-[28px] border border-slate-100 bg-[var(--color-surface-soft)] p-5">
              <div className="space-y-3 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(cart?.subtotal ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Service fee</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(cart?.serviceFee ?? 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-semibold text-[var(--color-brand-navy)]">
                  <span>Total</span>
                  <span>{formatCurrency(cart?.total ?? 0)}</span>
                </div>
              </div>

              <form
                className="mt-5 space-y-3"
                onSubmit={(event) => {
                  event.preventDefault();
                  void checkout(checkoutForm);
                }}
              >
                <TextField
                  onChange={(event) =>
                    setCheckoutForm((current) => ({
                      ...current,
                      customerName: event.target.value,
                    }))
                  }
                  placeholder="Customer name"
                  required
                  value={checkoutForm.customerName}
                />
                <TextField
                  onChange={(event) =>
                    setCheckoutForm((current) => ({
                      ...current,
                      customerEmail: event.target.value,
                    }))
                  }
                  placeholder="Customer email"
                  required
                  type="email"
                  value={checkoutForm.customerEmail}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <TextField
                    onChange={(event) =>
                      setCheckoutForm((current) => ({
                        ...current,
                        phone: event.target.value,
                      }))
                    }
                    placeholder="Phone"
                    required
                    value={checkoutForm.phone}
                  />
                  <TextAreaField
                    className="sm:col-span-1"
                    onChange={(event) =>
                      setCheckoutForm((current) => ({
                        ...current,
                        address: event.target.value,
                      }))
                    }
                    placeholder="Delivery address"
                    required
                    rows={2}
                    value={checkoutForm.address}
                  />
                </div>
                <button
                  className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[var(--color-brand-blue)] text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(25,0,255,0.28)] disabled:opacity-60"
                  disabled={loading || !cart || cart.items.length === 0}
                  type="submit"
                >
                  {loading ? "Processing..." : "Checkout"}
                </button>
              </form>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
