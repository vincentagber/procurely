"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { TextField } from "@/components/forms/form-field";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth/auth-provider";

export function LoginForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="w-full max-w-[320px] space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          setLoading(true);
          setError(null);
          setMessage(null);
          const response = await api.login(form);
          window.localStorage.setItem("procurely-auth-token", response.token);
          
          // Architecture Sync: Merge guest cart into user cart if we have a token
          const guestToken = window.sessionStorage.getItem("procurely-cart-token");
          if (guestToken) {
            try {
              // We use the user's UUID as the persistent cart destination to link them
              await api.mergeCart({
                sourceToken: guestToken,
                destinationToken: response.user.id
              });
              // Update session storage to use the persistent user-linked token
              window.sessionStorage.setItem("procurely-cart-token", response.user.id);
            } catch (mergeError) {
              console.warn("Cart merge failed, continuing login anyway:", mergeError);
            }
          }

          await refreshUser();
          setMessage("Signed in successfully. Redirecting...");
          startTransition(() => {
            router.push("/account");
          });
        } catch (nextError) {
          setError(
            nextError instanceof Error ? nextError.message : "Unable to sign in.",
          );
        } finally {
          setLoading(false);
        }
      }}
    >
      <div>
        <h1 className="text-[2rem] font-semibold tracking-[-0.03em] text-[var(--color-brand-navy)]">
          Login
        </h1>
        <p className="mt-1 text-sm text-slate-500">Login to continue</p>
      </div>

      {message ? (
        <div className="rounded-[16px] border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-[16px] border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <TextField
        onChange={(event) =>
          setForm((current) => ({ ...current, email: event.target.value }))
        }
        placeholder="Enter your email"
        required
        type="email"
        value={form.email}
      />
      <TextField
        onChange={(event) =>
          setForm((current) => ({ ...current, password: event.target.value }))
        }
        placeholder="Enter your password"
        required
        type="password"
        value={form.password}
      />

      <div className="flex justify-end text-xs">
        <Link className="font-semibold text-[var(--color-brand-blue)]" href="/forgot-password">
          Forgot password
        </Link>
      </div>

      <button
        className="inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[var(--color-brand-navy)] text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <button
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white text-sm font-bold text-[#13184f] transition hover:bg-slate-50 hover:border-slate-300 shadow-sm"
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.964 10.705a5.41 5.41 0 0 1-.282-1.705c0-.603.104-1.189.282-1.705V4.963H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.037l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.963l3.007 2.332C4.672 5.164 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      <button
        className="flex h-12 w-full items-center justify-center gap-3 rounded-full border border-slate-200 bg-white text-sm font-bold text-[#13184f] transition hover:bg-slate-50 hover:border-slate-300 shadow-sm"
        type="button"
      >
        <svg width="20" height="20" fill="#1877F2" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Sign in with Facebook
      </button>

      <p className="text-center text-sm text-slate-500">
        Don&apos;t have an account?{" "}
        <Link className="font-semibold text-[var(--color-brand-blue)]" href="/signup">
          Sign up
        </Link>
      </p>
    </form>
  );
}
