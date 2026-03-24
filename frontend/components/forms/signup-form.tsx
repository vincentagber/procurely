"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import {
  AuthFeedback,
  PasswordToggleButton,
} from "@/components/forms/auth-elements";
import { TextField } from "@/components/forms/form-field";
import { api } from "@/lib/api";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignupForm() {
  const router = useRouter();
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form
      aria-busy={loading}
      className="w-full space-y-5"
      noValidate
      onSubmit={async (event) => {
        event.preventDefault();

        const fullName = form.fullName.trim();
        const email = form.email.trim().toLowerCase();
        const password = form.password;

        if (fullName === "") {
          setError("Full name is required.");
          setMessage(null);
          return;
        }

        if (!emailPattern.test(email)) {
          setError("A valid email address is required.");
          setMessage(null);
          return;
        }

        if (password.length < 8) {
          setError("Password must be at least 8 characters.");
          setMessage(null);
          return;
        }

        try {
          setLoading(true);
          setError(null);
          setMessage(null);
          const response = await api.register({ email, fullName, password });
          window.localStorage.setItem("procurely-auth-token", response.token);
          window.localStorage.setItem(
            "procurely-auth-user",
            JSON.stringify(response.user),
          );
          setMessage("Account created. Redirecting to the homepage...");
          startTransition(() => {
            router.replace("/");
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
        <h1 className="text-[2rem] font-semibold tracking-[-0.03em] text-text-navy-900">
          Sign up
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Create your Procurely account to submit BOQs and manage project orders.
        </p>
      </div>

      {message ? <AuthFeedback tone="success">{message}</AuthFeedback> : null}

      {error ? <AuthFeedback tone="error">{error}</AuthFeedback> : null}

      <TextField
        autoComplete="name"
        id="signup-full-name"
        label="Full Name"
        name="fullName"
        onChange={(event) =>
          setForm((current) => ({ ...current, fullName: event.target.value }))
        }
        placeholder="Full Name"
        required
        value={form.fullName}
      />
      <TextField
        autoComplete="email"
        id="signup-email"
        inputMode="email"
        label="Email Address"
        name="email"
        onChange={(event) =>
          setForm((current) => ({ ...current, email: event.target.value }))
        }
        placeholder="Email Address"
        required
        spellCheck={false}
        type="email"
        value={form.email}
      />
      <TextField
        autoComplete="new-password"
        hint="Minimum 8 characters"
        id="signup-password"
        label="Password"
        name="password"
        onChange={(event) =>
          setForm((current) => ({ ...current, password: event.target.value }))
        }
        placeholder="Password"
        required
        trailingAdornment={
          <PasswordToggleButton
            onToggle={() => setShowPassword((current) => !current)}
            visible={showPassword}
          />
        }
        type={showPassword ? "text" : "password"}
        value={form.password}
      />

      <p className="text-xs leading-5 text-neutral-500">
        You are agreeing to the{" "}
        <Link
          className="font-semibold text-primary-blue-500 transition-interactive hover:text-primary-blue-600"
          href="#terms"
        >
          Terms of Services
        </Link>{" "}
        and{" "}
        <Link
          className="font-semibold text-primary-blue-500 transition-interactive hover:text-primary-blue-600"
          href="#privacy"
        >
          Privacy Policy
        </Link>
        .
      </p>

      <button
        className="inline-flex h-12 w-full items-center justify-center rounded-button bg-primary-navy px-5 text-sm font-semibold text-text-inverse shadow-card transition-interactive hover:bg-primary-navy-600 focus-visible:outline-none focus-visible:shadow-focus disabled:state-disabled"
        data-state={loading ? "loading" : undefined}
        disabled={loading}
        type="submit"
      >
        {loading ? "Creating account..." : "Get started"}
      </button>

      <p className="text-center text-sm text-neutral-500">
        Already a member?{" "}
        <Link
          className="font-semibold text-primary-blue-500 transition-interactive hover:text-primary-blue-600"
          href="/login"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
