"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

import { AuthFeedback } from "@/components/forms/auth-elements";
import { TextField } from "@/components/forms/form-field";
import { api } from "@/lib/api";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [tokenPreview, setTokenPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <form
      aria-busy={loading}
      className="w-full max-w-[320px] space-y-4"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();

        const normalizedEmail = email.trim().toLowerCase();

        if (!emailPattern.test(normalizedEmail)) {
          setError("A valid email address is required.");
          setMessage(null);
          setTokenPreview(null);
          return;
        }

        try {
          setLoading(true);
          setError(null);
          setMessage(null);
          setTokenPreview(null);
          const response = await api.forgotPassword({ email: normalizedEmail });
          setMessage(response.message);
          setTokenPreview(response.resetTokenPreview ?? null);
          setEmail(normalizedEmail);
        } catch (nextError) {
          setError(
            nextError instanceof Error
              ? nextError.message
              : "Unable to send reset instructions.",
          );
          setTokenPreview(null);
        } finally {
          setLoading(false);
        }
      }}
    >
      <div className="text-center">
        <h1 className="text-[1.95rem] font-semibold tracking-[-0.04em] text-text-navy-900 sm:text-[2.1rem]">
          {title}
        </h1>
        <p className="mx-auto mt-2 max-w-[260px] text-[0.92rem] leading-6 text-neutral-500">
          {description}
        </p>
      </div>

      {message ? (
        <AuthFeedback tone="success">
          <span>{message}</span>
          {tokenPreview ? (
            <span className="mt-1.5 block text-xs leading-5 text-state-success-700/90">
              Preview token: <span className="font-semibold">{tokenPreview}</span>
            </span>
          ) : null}
        </AuthFeedback>
      ) : null}

      {error ? <AuthFeedback tone="error">{error}</AuthFeedback> : null}

      <TextField
        autoComplete="email"
        className="gap-2.5"
        fieldClassName="h-[46px] rounded-[10px] border-neutral-200 bg-[#f6f7fd] px-4 text-[14px] shadow-none focus:border-border-accent focus:bg-white focus:shadow-focus"
        id="forgot-password-email"
        inputMode="email"
        label="Email"
        name="email"
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Enter your email"
        required
        spellCheck={false}
        type="email"
        value={email}
      />

      <motion.button
        className="inline-flex h-[46px] w-full items-center justify-center rounded-[8px] bg-primary-navy text-sm font-semibold text-white shadow-[0_18px_38px_rgba(19,24,79,0.18)] transition-interactive hover:bg-primary-navy-600 disabled:state-disabled"
        data-state={loading ? "loading" : undefined}
        disabled={loading}
        transition={{ duration: 0.18 }}
        type="submit"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.985 }}
      >
        {loading ? "Sending..." : submitLabel}
      </motion.button>

      <p className="pt-1 text-center text-[13px]">
        <Link
          className="font-semibold text-primary-blue-500 transition-interactive hover:text-primary-blue-600"
          href="/login"
        >
          Back to login
        </Link>
      </p>
    </form>
  );
}
