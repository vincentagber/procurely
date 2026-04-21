"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { useUi } from "@/components/ui/ui-provider";

export function CartDrawer() {
  const { cartOpen, closeCart } = useUi();
  const { cart, updateItemQuantity, removeItem } = useCart();

  return (
    <AnimatePresence>
      {cartOpen ? (
        <>
          <motion.button
            aria-label="Close cart"
            className="fixed inset-0 z-[100] bg-slate-950/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />
          <motion.aside
            aria-label="Cart drawer"
            className="fixed right-0 top-0 z-[110] flex h-full w-full max-w-[420px] flex-col overflow-y-auto bg-white px-6 pb-6 pt-8 shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-bold text-[#13184f]">Cart</h2>
                <span className="text-xl font-semibold text-[#13184f]">{cart?.items.length || 0}</span>
              </div>
              <button
                className="inline-flex size-10 items-center justify-center text-slate-400 hover:text-slate-600 transition"
                onClick={closeCart}
                type="button"
              >
                <X className="size-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {cart && cart.items.length > 0 ? (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <article
                      className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
                      key={item.id}
                    >
                      <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 p-2">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          alt={item.product.name}
                          className="max-h-full max-w-full object-contain"
                          src={item.product.image}
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between">
                          <h3 className="line-clamp-2 text-sm font-medium text-[#13184f]">
                            {item.product.name}
                          </h3>
                          <button
                            className="ml-2 text-slate-400 hover:text-rose-500 transition"
                            onClick={() => void removeItem(item.id)}
                            type="button"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded border border-slate-200">
                            <button
                              className="px-2 py-1 text-slate-500 hover:text-slate-900"
                              onClick={() => void updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                            >
                              <Minus className="size-3" />
                            </button>
                            <span className="w-8 flex justify-center text-sm font-medium text-[#13184f]">
                              {item.quantity}
                            </span>
                            <button
                              className="px-2 py-1 text-slate-500 hover:text-slate-900"
                              onClick={() => void updateItemQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="size-3" />
                            </button>
                          </div>
                          <span className="text-sm font-bold text-[#13184f]">
                            ₦{item.lineTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="mb-4 size-12 text-slate-300" />
                  <p className="font-semibold text-[#13184f]">Your cart is empty</p>
                </div>
              )}
            </div>

            {cart && cart.items.length > 0 && (
              <div className="mt-auto pt-6">
                <div className="mb-6 flex items-center justify-between text-lg font-bold text-[#446d4e]">
                  <span className="text-[#ff6f4d]">Subtotal</span>
                  <span>₦{cart.subtotal.toLocaleString()}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="flex items-center justify-center rounded-lg bg-[#0b103e] py-3 text-sm font-semibold text-white transition hover:bg-[#13184f]"
                  >
                    View Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="flex items-center justify-center rounded-lg bg-[#ffccbb] py-3 text-sm font-semibold text-[#13184f] transition hover:bg-[#ffbba5]"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
