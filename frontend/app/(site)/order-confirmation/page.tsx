"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";
import { api, ORDER_HISTORY_KEY } from "@/lib/api";
import type { Order } from "@/lib/types";
import { formatCurrency } from "@/lib/format";

export default function OrderConfirmationPage() {
   const { lastOrder } = useCart();
   const [fetchedOrder, setFetchedOrder] = useState<Order | null>(null);
   const [loading, setLoading] = useState(true);

   const fetchLastOrder = useCallback(async () => {
      if (typeof window === "undefined") return;
      try {
         const raw = window.sessionStorage.getItem(ORDER_HISTORY_KEY);
         if (!raw) return;
         const history: Array<{ orderNumber: string; cartToken: string; placedAt: string }> = JSON.parse(raw);
         if (history.length === 0) return;
         const latest = history[0];
         const order = await api.getOrder(latest.orderNumber, latest.cartToken);
         setFetchedOrder(order);
      } catch {
         // Order fetch failed -- will fall back to lastOrder
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      if (!lastOrder) {
         void fetchLastOrder();
      } else {
         setLoading(false);
      }
   }, [lastOrder, fetchLastOrder]);

   const displayOrder = lastOrder || fetchedOrder;

   if (loading) {
      return (
         <div className="bg-[#f6f7fd] min-h-[75vh] flex flex-col items-center justify-center px-4 py-24">
            <div className="animate-pulse bg-slate-200 rounded-2xl w-16 h-16" />
         </div>
      );
   }

   return (
      <div className="bg-[#f6f7fd] min-h-[75vh] flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#1900ff]/5 to-[#ff6f4d]/5 rounded-full blur-3xl pointer-events-none"></div>

         <div className="bg-white rounded-[3rem] p-12 sm:p-20 max-w-2xl w-full text-center shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-slate-100 relative z-10">
            <div className="flex justify-center mb-10">
               <div className="size-28 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-sm shadow-green-100">
                  <CheckCircle2 className="size-14" strokeWidth={2.5} />
               </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#13184f] mb-6 tracking-tight">
               {displayOrder?.paymentMethod === 'card' ? 'Payment Successful!' : 'Order Received!'}
            </h1>
            
            {displayOrder ? (
              <div className="mb-10 space-y-4">
                <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100">
                  <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Order Number</p>
                  <p className="text-2xl font-black text-[#13184f]">{displayOrder.orderNumber}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 p-6 border border-slate-100 text-left">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-4">Order Summary</h3>
                  <div className="space-y-2 text-[#13184f]">
                    {displayOrder.items.map((item) => (
                      <div key={item.productId} className="flex justify-between text-sm">
                        <span>{item.productName} x {item.quantity}</span>
                        <span className="font-semibold">{formatCurrency(item.lineTotal)}</span>
                      </div>
                    ))}
                    <div className="border-t border-slate-200 pt-2 mt-2 space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Subtotal</span>
                        <span>{formatCurrency(displayOrder.subtotal)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">VAT (7.5%)</span>
                        <span>{formatCurrency(displayOrder.vat)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">Shipping</span>
                        <span>{displayOrder.shippingFee === 0 ? "Free" : formatCurrency(displayOrder.shippingFee)}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base pt-2 border-t border-slate-200">
                        <span>Total Paid</span>
                        <span>{formatCurrency(displayOrder.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed px-4">
               {displayOrder 
                 ? `Thank you ${displayOrder.customerName}, your order has been placed securely. A receipt has been sent to ${displayOrder.customerEmail} with the tracking information.`
                 : "Your order has been placed securely. A receipt has been sent to your email with the order details and tracking information."
               }
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link href="/materials" className="w-full sm:w-auto px-10 py-5 bg-[#0b103e] hover:bg-[#1900ff] text-white font-bold rounded-2xl shadow-lg transition hover:-translate-y-1">
                  Continue Shopping
               </Link>
               {displayOrder && (
               <Link href={`/track-order?order=${displayOrder.orderNumber}`} className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 text-slate-600 hover:text-[#13184f] hover:border-[#13184f] font-bold rounded-2xl transition hover:-translate-y-1">
                  Track Order
               </Link>
               )}
               <Link href="/account" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 text-slate-600 hover:text-[#13184f] hover:border-[#13184f] font-bold rounded-2xl transition hover:-translate-y-1">
                  View My Orders
               </Link>
            </div>
         </div>
      </div>
   );
}
