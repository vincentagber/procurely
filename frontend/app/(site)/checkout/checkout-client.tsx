"use client";

import { useCart } from "@/components/cart/cart-provider";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { persistOrderRef } from "@/lib/api";

export function CheckoutPageClient() {
  const { cart, checkout, clearCart, loading } = useCart();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    companyName: "",
    address: "",
    apartment: "",
    city: "",
    phone: "",
    email: "",
    saveInfo: true,
    paymentMethod: "bank",
  });

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-shell mx-auto px-4 py-16 text-center">
        <h2 className="mb-4 text-2xl font-semibold text-[#13184f]">Your cart is empty</h2>
        <Link href="/" className="rounded bg-[#0b103e] px-6 py-3 text-white transition hover:bg-[#13184f]">Return to Shop</Link>
      </div>
    );
  }

  const isNgn = cart.items[0]?.product.currency === 'NGN';
  const total = cart.total;
  const vat = cart.vat;
  const shipping = cart.shippingFee;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const cartTokenSnap = cart.cartToken;
      
      // 1. Create the order
      const order = await checkout({
        customerName: formData.firstName,
        customerEmail: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}`,
        paymentMethod: formData.paymentMethod,
      });

      if (!order) {
        throw new Error("Failed to create order");
      }

      // 2. Decide if we need Paystack
      // Only use Paystack for 'card' or if explicitly requested. 
      // For now, if user selects 'bank' or 'cod', we might skip the iframe and just go to confirmation.
      if (formData.paymentMethod === 'cod' || formData.paymentMethod === 'bank') {
        persistOrderRef(order.orderNumber, cartTokenSnap);
        clearCart();
        router.push("/order-confirmation");
        return;
      }

      // 3. Initialize Paystack (for card payments)
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: formData.email,
        amount: order.total * 100, // Paystack expects amount in kobo/cents
        currency: isNgn ? 'NGN' : 'USD',
        ref: order.orderNumber,
        callback: function(response: any) {
          // 4. Payment successful, redirect to confirmation
          persistOrderRef(order.orderNumber, cartTokenSnap);
          clearCart();
          router.push("/order-confirmation");
        },
        onClose: function() {
          setIsProcessing(false);
          alert('Transaction was not completed, window closed.');
        }
      });

      handler.openIframe();

    } catch (err: any) {
      alert(err.message || "An error occurred during checkout");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container-shell mx-auto px-4 pb-20 sm:px-6">
      <h1 className="mb-10 text-4xl font-bold text-[#13184f]">Billing Details</h1>

      <form onSubmit={handleCheckout} className="grid grid-cols-1 gap-16 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-7">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-500">First Name*</label>
              <input required type="text" className="w-full rounded bg-slate-50 border border-slate-200 px-4 py-4 outline-none transition focus:border-slate-400 focus:bg-white" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-500">Company Name</label>
              <input type="text" className="w-full rounded bg-slate-50 border border-slate-200 px-4 py-4 outline-none transition focus:border-slate-400 focus:bg-white" value={formData.companyName} onChange={(e) => setFormData({...formData, companyName: e.target.value})} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-500">Street Address*</label>
              <input required type="text" className="w-full rounded bg-slate-50 border border-slate-200 px-4 py-4 outline-none transition focus:border-slate-400 focus:bg-white" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-500">Apartment, floor, etc. (optional)</label>
              <input type="text" className="w-full rounded bg-slate-50 border border-slate-200 px-4 py-4 outline-none transition focus:border-slate-400 focus:bg-white" value={formData.apartment} onChange={(e) => setFormData({...formData, apartment: e.target.value})} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-500">Town/City*</label>
              <input required type="text" className="w-full rounded bg-slate-50 border border-slate-200 px-4 py-4 outline-none transition focus:border-slate-400 focus:bg-white" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-500">Phone Number*</label>
              <input required type="tel" className="w-full rounded bg-slate-50 border border-slate-200 px-4 py-4 outline-none transition focus:border-slate-400 focus:bg-white" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-500">Email Address*</label>
              <input required type="email" className="w-full rounded bg-slate-50 border border-slate-200 px-4 py-4 outline-none transition focus:border-slate-400 focus:bg-white" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <label className="flex items-center gap-3 cursor-pointer mt-4">
              <input type="checkbox" className="size-5 rounded border-slate-300 bg-white checked:bg-[#e43f3f] accent-[#db4444]" checked={formData.saveInfo} onChange={(e) => setFormData({...formData, saveInfo: e.target.checked})} />
              <span className="font-semibold text-[#13184f]">Save this information for faster check-out next time</span>
            </label>
          </div>
        </div>

        <div className="lg:col-span-5">
           <div className="space-y-6 text-[#13184f]">
              {cart.items.map(item => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="flex size-14 shrink-0 items-center justify-center rounded border border-slate-100 bg-white p-1 shadow-sm">
                       <img src={item.product.image} className="max-h-full max-w-full object-contain" alt={item.product.name} />
                     </div>
                     <span className="font-medium">{item.product.name}</span>
                  </div>
                  <span className="font-semibold">₦{item.lineTotal.toLocaleString()}</span>
                </div>
              ))}

              <div className="border-y border-slate-200 py-4 space-y-4">
                 <div className="flex justify-between">
                    <span className="font-medium text-[#13184f]">Subtotal:</span>
                    <span className="font-semibold">₦{cart.subtotal.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="font-medium text-[#13184f]">VAT:</span>
                    <span className="font-semibold">₦{vat.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="font-medium text-[#13184f]">Shipping:</span>
                    <span className="font-semibold">₦{shipping.toLocaleString()}</span>
                 </div>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>₦{total.toLocaleString()}</span>
              </div>

              <div className="space-y-4 pt-4">
                 <label className="flex items-center gap-4 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="bank" 
                      className="size-5 accent-[#13184f]" 
                      checked={formData.paymentMethod === 'bank'}
                      onChange={() => setFormData({...formData, paymentMethod: 'bank'})}
                    />
                    <span className="font-medium">Bank</span>
                 </label>
                 <label className="flex items-center gap-4 cursor-pointer">
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      className="size-5 accent-[#13184f]" 
                      checked={formData.paymentMethod === 'cod'}
                      onChange={() => setFormData({...formData, paymentMethod: 'cod'})}
                    />
                    <span className="font-medium">Cash on delivery</span>
                 </label>
              </div>

              <div className="flex gap-4 pt-6">
                 <input type="text" placeholder="Coupon Code" className="w-full rounded border border-slate-300 px-4 py-3 outline-none" />
                 <button type="button" className="whitespace-nowrap rounded bg-[#0b103e] px-8 py-3 font-semibold text-white hover:bg-[#13184f]">
                    Apply Coupon
                 </button>
              </div>

              <button disabled={loading || isProcessing} type="submit" className="mt-6 w-[200px] disabled:opacity-75 disabled:cursor-not-allowed rounded bg-[#0b103e] px-10 py-4 font-semibold text-white shadow-md hover:shadow-lg transition hover:bg-[#13184f]">
                 {(loading || isProcessing) ? "Processing..." : "Place Order"}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}
