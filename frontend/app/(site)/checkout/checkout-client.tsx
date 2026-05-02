"use client";

import { useCart } from "@/components/cart/cart-provider";
import { useAuth } from "@/components/auth/auth-provider";
import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { persistOrderRef, api } from "@/lib/api";
import { usePaymentPolling } from "@/hooks/use-payment-polling";
import { formatCurrency } from "@/lib/format";

export function CheckoutPageClient() {
  const { cart, checkout, clearCart, loading, error: cartError } = useCart();
  const { user, isAuthenticated } = useAuth();
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
    paymentMethod: "card",
  });
  const [paystackLoaded, setPaystackLoaded] = useState(false);
  const [useWallet, setUseWallet] = useState(false);
  const pollingCleanupRef = useRef<(() => void) | null>(null);

  const handlePaymentConfirmed = useCallback((orderNumber: string) => {
    persistOrderRef(orderNumber, cart?.cartToken || "");
    clearCart();
    router.push("/order-confirmation");
  }, [cart?.cartToken, clearCart, router]);

  const handlePaymentTimeout = useCallback((_orderNumber: string, _attempts: number) => {
    setIsProcessing(false);
  }, []);

  const handlePaymentError = useCallback((_error: Error) => {
    setIsProcessing(false);
  }, []);

  const { startPolling, stop: stopPolling } = usePaymentPolling({
    intervalMs: 3000,
    maxAttempts: 30,
    onSuccess: handlePaymentConfirmed,
    onTimeout: handlePaymentTimeout,
    onError: handlePaymentError,
  });

  const pollPaymentStatus = useCallback(async (orderNumber: string, cartToken: string): Promise<boolean> => {
    for (let attempt = 0; attempt < 10; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      try {
        const order = await api.getOrder(orderNumber, cartToken);
        if (order.status === "paid") {
          persistOrderRef(orderNumber, cartToken);
          clearCart();
          router.push("/order-confirmation");
          return true;
        }
      } catch {
        // Continue polling
      }
    }
    return false;
  }, [clearCart, router]);

  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as unknown as Record<string, unknown>).PaystackPop) {
      setPaystackLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
      }));
    }
  }, [isAuthenticated, user]);

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container-shell mx-auto px-4 py-16 text-center">
        {cartError && (
          <div className="mb-8 mx-auto max-w-md rounded-lg bg-rose-50 p-4 text-rose-600 font-medium border border-rose-100 flex items-center gap-3 text-left">
            <span className="text-lg">Warning</span>
            {cartError}
          </div>
        )}
        <h2 className="mb-4 text-2xl font-semibold text-[#13184f]">Your cart is empty</h2>
        <Link href="/" className="rounded bg-[#0b103e] px-6 py-3 text-white transition hover:bg-[#13184f]">Return to Shop</Link>
      </div>
    );
  }

  const total = cart.total;
  const vat = cart.vat;
  const shipping = cart.shippingFee;
  const canUseWallet = isAuthenticated && user && (user.walletBalance || 0) >= total;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const cartTokenSnap = cart.cartToken;
      const paymentMethod = useWallet && canUseWallet ? "wallet" : formData.paymentMethod;

      const order = await checkout({
        customerName: formData.firstName,
        customerEmail: formData.email,
        phone: formData.phone,
        address: `${formData.address}, ${formData.city}`,
        paymentMethod,
      });

      if (!order) {
        setIsProcessing(false);
        return;
      }

      if (paymentMethod === "wallet") {
        persistOrderRef(order.orderNumber, cartTokenSnap);
        clearCart();
        router.push("/order-confirmation");
        return;
      }

      if (paymentMethod === "cod") {
        persistOrderRef(order.orderNumber, cartTokenSnap);
        clearCart();
        router.push("/order-confirmation");
        return;
      }

      if (!paystackLoaded) {
        throw new Error("Payment provider not loaded. Please refresh and try again.");
      }

      const paystack = (window as unknown as Record<string, unknown>).PaystackPop as Record<string, unknown>;
      const handler = (paystack.setup as (options: Record<string, unknown>) => { openIframe: () => void })({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: formData.email,
        amount: order.total, // Backend returns total in kobo, Paystack expects kobo
        currency: 'NGN',
        ref: order.orderNumber,
        callback: function(response: Record<string, string>) {
          (async () => {
            try {
              const verification = await api.confirmPaymentIntent(response.reference);
              if (verification.success) {
                persistOrderRef(order.orderNumber, cartTokenSnap);
                clearCart();
                router.push("/order-confirmation");
              } else {
                const polled = await pollPaymentStatus(order.orderNumber, cartTokenSnap);
                if (!polled) {
                  alert("Payment verification failed. Please contact support if your account was debited.");
                  setIsProcessing(false);
                }
              }
            } catch {
              const polled = await pollPaymentStatus(order.orderNumber, cartTokenSnap);
              if (!polled) {
                setIsProcessing(false);
                alert("Payment confirmation is being processed. You will receive a confirmation email shortly.");
              }
            }
          })();
        },
        onClose: function() {
          setIsProcessing(false);
        }
      });

      handler.openIframe();

    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "An error occurred during checkout";
      alert(message);
      setIsProcessing(false);
    }
  };

  const currentError = cartError;

  return (
    <div className="container-shell mx-auto px-4 pb-20 sm:px-6">
      <h1 className="mb-10 text-4xl font-bold text-[#13184f]">Billing Details</h1>

      {currentError && (
        <div className="mb-8 rounded-lg bg-rose-50 p-4 text-rose-600 font-medium border border-rose-100 flex items-center gap-3">
          <span className="text-lg">Warning</span>
          {currentError}
        </div>
      )}

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
                  <span className="font-semibold">{formatCurrency(item.lineTotal)}</span>
                </div>
              ))}

              <div className="border-y border-slate-200 py-4 space-y-4">
                 <div className="flex justify-between">
                    <span className="font-medium text-[#13184f]">Subtotal:</span>
                    <span className="font-semibold">{formatCurrency(cart.subtotal)}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="font-medium text-[#13184f]">VAT (7.5%):</span>
                    <span className="font-semibold">{formatCurrency(vat)}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="font-medium text-[#13184f]">Shipping:</span>
                    <span className="font-semibold">{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
                 </div>
              </div>

              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>

              <div className="space-y-4 pt-4">
                {canUseWallet && (
                  <label className="flex items-center gap-4 cursor-pointer rounded-lg border border-green-200 bg-green-50 p-3">
                    <input
                      type="radio"
                      name="payment"
                      value="wallet"
                      className="size-5 accent-green-600"
                      checked={useWallet}
                      onChange={() => setUseWallet(true)}
                    />
                    <div>
                      <span className="font-medium">Pay with Wallet</span>
                      <p className="text-xs text-slate-500">Balance: {formatCurrency(user?.walletBalance || 0)}</p>
                    </div>
                  </label>
                )}
                 <label className="flex items-center gap-4 cursor-pointer">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      className="size-5 accent-[#13184f]"
                      checked={formData.paymentMethod === 'card' && !useWallet}
                      onChange={() => { setUseWallet(false); setFormData({...formData, paymentMethod: 'card'}); }}
                    />
                    <span className="font-medium">Card (Paystack)</span>
                 </label>
                 <label className="flex items-center gap-4 cursor-pointer">
                     <input
                       type="radio"
                       name="payment"
                       value="cod"
                       className="size-5 accent-[#13184f]"
                       checked={formData.paymentMethod === 'cod' && !useWallet}
                       onChange={() => { setUseWallet(false); setFormData({...formData, paymentMethod: 'cod'}); }}
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
