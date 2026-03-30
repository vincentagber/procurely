"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import { TextField } from "@/components/forms/form-field";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth/auth-provider";

export function SignupForm() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
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
          const response = await api.register(form);
          window.localStorage.setItem("procurely-auth-token", response.token);
          await refreshUser();
          setMessage("Account created. Redirecting...");
          startTransition(() => {
            router.push("/account");
          });
        } catch (nextError) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Unable to create your account.",
          );
        } finally {
          setLoading(false);
        }
      }}
    >
      <div>
        <h1 className="text-[2rem] font-semibold tracking-[-0.03em] text-[var(--color-brand-navy)]">
          Sign up
        </h1>
        <p className="mt-1 text-sm text-slate-500">Join us now</p>
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
          setForm((current) => ({ ...current, fullName: event.target.value }))
        }
        placeholder="Full Name"
        required
        value={form.fullName}
      />
      <TextField
        onChange={(event) =>
          setForm((current) => ({ ...current, email: event.target.value }))
        }
        placeholder="Email Address"
        required
        type="email"
        value={form.email}
      />
      <TextField
        onChange={(event) =>
          setForm((current) => ({ ...current, password: event.target.value }))
        }
        placeholder="Password"
        required
        type="password"
        value={form.password}
      />

      <p className="text-xs leading-5 text-slate-500">
        You are agreeing to the{" "}
        <span className="font-semibold text-[var(--color-brand-blue)]">
          Terms of Services
        </span>{" "}
        and{" "}
        <span className="font-semibold text-[var(--color-brand-blue)]">
          Privacy Policy
        </span>
        .
      </p>

      <button
        className="inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[var(--color-brand-navy)] text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Creating account..." : "Get started"}
      </button>

      <p className="text-center text-sm text-slate-500">
        Already a member?{" "}
        <Link className="font-semibold text-[var(--color-brand-blue)]" href="/login">
          Sign in
        </Link>
      </p>
    </form>
  );
}
