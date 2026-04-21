"use client";

import Link from "next/link";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/cart-provider";

export default function OrderConfirmationPage() {
   const { lastOrder } = useCart();

   return (
      <div className="bg-[#f6f7fd] min-h-[75vh] flex flex-col items-center justify-center px-4 py-24 relative overflow-hidden">
         {/* Confetti / background flair */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-[#1900ff]/5 to-[#ff6f4d]/5 rounded-full blur-3xl pointer-events-none"></div>

         <div className="bg-white rounded-[3rem] p-12 sm:p-20 max-w-2xl w-full text-center shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-slate-100 relative z-10">
            <div className="flex justify-center mb-10">
               <div className="size-28 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-sm shadow-green-100">
                  <CheckCircle2 className="size-14" strokeWidth={2.5} />
               </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold text-[#13184f] mb-6 tracking-tight">
               {lastOrder?.paymentMethod === 'card' ? 'Payment Successful!' : 'Order Received!'}
            </h1>
            
            {lastOrder ? (
              <div className="mb-10 rounded-2xl bg-slate-50 p-6 border border-slate-100">
                <p className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-2">Order Number</p>
                <p className="text-2xl font-black text-[#13184f]">{lastOrder.orderNumber}</p>
              </div>
            ) : null}

            <p className="text-lg text-slate-500 font-medium mb-12 leading-relaxed px-4">
               {lastOrder 
                 ? `Thank you ${lastOrder.customerName}, your order has been placed securely. A receipt has been sent to ${lastOrder.customerEmail} with the tracking information.`
                 : "Your order has been placed securely. A receipt has been sent to your email with the order details and tracking information."
               }
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
               <Link href="/materials" className="w-full sm:w-auto px-10 py-5 bg-[#0b103e] hover:bg-[#1900ff] text-white font-bold rounded-2xl shadow-lg transition hover:-translate-y-1">
                  Continue Shopping
               </Link>
               <Link href="/account" className="w-full sm:w-auto px-10 py-5 bg-white border-2 border-slate-200 text-slate-600 hover:text-[#13184f] hover:border-[#13184f] font-bold rounded-2xl transition hover:-translate-y-1">
                  View My Orders
               </Link>
            </div>
         </div>
      </div>
   );
}
