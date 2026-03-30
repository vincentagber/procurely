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
          await refreshUser();
          setMessage("Signed in successfully. Redirecting...");
          startTransition(() => {
            if (response.user.role === "admin") {
              router.push("/admin");
            } else {
              router.push("/account");
            }
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
        className="inline-flex h-12 w-full items-center justify-center rounded-[999px] border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:border-slate-300"
        type="button"
      >
        Sign in with Google
      </button>
      <button
        className="inline-flex h-12 w-full items-center justify-center rounded-[999px] border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:border-slate-300"
        type="button"
      >
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
