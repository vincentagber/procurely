"use client";

import { useCart } from "@/components/cart/cart-provider";
import { ChevronUp, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function CartPageClient() {
  const { cart, updateItemQuantity, removeItem } = useCart();
  const [coupon, setCoupon] = useState('');

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-shell mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold text-[#13184f] mb-4">Your cart is empty</h2>
        <Link href="/" className="rounded bg-[#1900ff] px-6 py-3 text-white">Return to Shop</Link>
      </div>
    );
  }

  return (
    <div className="container-shell mx-auto px-4 pb-20 sm:px-6">
      <div className="mb-2 hidden grid-cols-12 rounded-xl bg-white px-8 py-4 text-xs tracking-wider uppercase font-bold text-[#13184f] shadow-sm lg:grid border border-slate-100">
        <div className="col-span-6">Product</div>
        <div className="col-span-2 text-center">Price</div>
        <div className="col-span-2 text-center">Quantity</div>
        <div className="col-span-2 text-right">Subtotal</div>
      </div>

      <div className="space-y-4">
        {cart.items.map(item => (
          <div key={item.id} className="grid grid-cols-1 items-center gap-4 rounded-xl border border-slate-100 bg-white p-6 shadow-[0_8px_30px_rgb(0,0,0,0.03)] lg:grid-cols-12 lg:px-8">
            <div className="col-span-6 flex items-center gap-4">
              <div className="relative flex size-24 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 p-2">
                <button 
                  onClick={() => removeItem(item.id)} 
                  className="absolute -left-2 -top-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white shadow hover:bg-red-600 focus:outline-none"
                  aria-label="Remove item"
                >
                  <span className="text-sm font-bold leading-none">&times;</span>
                </button>
                <img src={item.product.image} alt={item.product.name} className="max-h-full max-w-full object-contain" />
              </div>
              <h3 className="text-base font-semibold text-[#13184f]">{item.product.name}</h3>
            </div>
            <div className="col-span-2 text-center text-[#13184f] font-medium lg:block">
               {item.product.currency === 'NGN' ? 'N' : ''}{item.product.price.toLocaleString()}
            </div>
            <div className="col-span-2 flex justify-center">
               <div className="flex w-[80px] items-center justify-between rounded border border-slate-300 px-3 py-2 text-[#13184f]">
                 <span className="font-semibold">{item.quantity.toString().padStart(2, '0')}</span>
                 <div className="flex flex-col gap-1 text-slate-400">
                    <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="hover:text-slate-700">
                       <ChevronUp className="size-3" />
                    </button>
                    <button onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))} className="hover:text-slate-700">
                       <ChevronDown className="size-3" />
                    </button>
                 </div>
               </div>
            </div>
            <div className="col-span-2 text-right text-base font-bold text-[#13184f]">
               {item.product.currency === 'NGN' ? 'N' : ''}{item.lineTotal.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row">
         <Link href="/" className="inline-flex rounded border border-[#13184f] bg-transparent px-8 py-3 text-sm font-semibold text-[#13184f] hover:bg-slate-50">
            Return To Shop
         </Link>
         <button className="inline-flex rounded border border-[#13184f] bg-transparent px-8 py-3 text-sm font-semibold text-[#13184f] hover:bg-slate-50">
            Update Cart
         </button>
      </div>

      <div className="mt-16 grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
         <div className="flex max-w-md flex-col gap-4 sm:flex-row">
            <input 
               type="text" 
               placeholder="Coupon Code" 
               className="w-full rounded border border-slate-300 px-4 py-3 text-[#13184f] outline-none focus:border-[#13184f]"
               value={coupon}
               onChange={(e) => setCoupon(e.target.value)}
            />
            <button className="whitespace-nowrap rounded bg-[#0b103e] px-8 py-3 font-semibold text-white transition hover:bg-[#13184f]">
               Apply Coupon
            </button>
         </div>

         <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="mb-6 text-xl font-bold text-[#13184f]">Cart Total</h3>
            <div className="space-y-4 text-[#13184f]">
               <div className="flex justify-between border-b border-slate-100 pb-4 text-sm font-semibold">
                  <span>Subtotal:</span>
                  <span>{cart.items[0]?.product.currency === 'NGN' ? 'N' : '$'}{cart.subtotal.toLocaleString()}</span>
               </div>
               <div className="flex justify-between border-b border-slate-100 pb-4 text-sm font-semibold">
                  <span>Shipping:</span>
                  <span>Free</span>
               </div>
               <div className="flex justify-between pb-4 font-bold">
                  <span>Total:</span>
                  <span>{cart.items[0]?.product.currency === 'NGN' ? 'N' : '$'}{cart.subtotal.toLocaleString()}</span>
               </div>
            </div>
            <Link href="/checkout" className="mt-4 flex w-full justify-center rounded bg-[#0b103e] py-4 font-semibold text-white transition hover:bg-[#13184f] shadow-md hover:shadow-lg">
               Process to checkout
            </Link>
         </div>
      </div>
    </div>
  );
}
