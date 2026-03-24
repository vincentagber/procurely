"use client";

import Link from "next/link";
import { useState } from "react";

import { TextField } from "@/components/forms/form-field";
import { api } from "@/lib/api";

type ForgotPasswordFormProps = {
  title: string;
  description: string;
  submitLabel: string;
};

export function ForgotPasswordForm({
  title,
  description,
  submitLabel,
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("");
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
          const response = await api.forgotPassword({ email });
          setMessage(
            response.resetTokenPreview
              ? `${response.message} Preview token: ${response.resetTokenPreview}`
              : response.message,
          );
        } catch (nextError) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Unable to send reset instructions.",
          );
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="text-center">
        <h1 className="text-[2rem] font-semibold tracking-[-0.03em] text-[var(--color-brand-navy)]">
          {title}
        </h1>
        <p className="mt-2 text-sm text-slate-500">{description}</p>
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
        label="Email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email"
        required
        type="email"
        value={email}
      />

      <button
        className="inline-flex h-12 w-full items-center justify-center rounded-[12px] bg-[var(--color-brand-navy)] text-sm font-semibold text-white transition hover:opacity-95 disabled:opacity-60"
        disabled={loading}
        type="submit"
      >
        {loading ? "Sending..." : submitLabel}
      </button>

      <p className="text-center text-sm text-slate-500">
        <Link className="font-semibold text-[var(--color-brand-blue)]" href="/login">
          Back to login
        </Link>
      </p>
    </form>
  );
}
