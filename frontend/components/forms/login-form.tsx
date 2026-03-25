"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

import {
  AuthFeedback,
  PasswordToggleButton,
  SocialAuthButton,
} from "@/components/forms/auth-elements";
import { TextField } from "@/components/forms/form-field";
import { api } from "@/lib/api";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
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

        const email = form.email.trim().toLowerCase();
        const password = form.password;

        if (!emailPattern.test(email)) {
          setError("A valid email address is required.");
          setMessage(null);
          return;
        }

        if (password === "") {
          setError("Password is required.");
          setMessage(null);
          return;
        }

        try {
          setLoading(true);
          setError(null);
          setMessage(null);
          const response = await api.login({ email, password });
          window.localStorage.setItem("procurely-auth-token", response.token);
          window.localStorage.setItem(
            "procurely-auth-user",
            JSON.stringify(response.user),
          );
          setMessage("Signed in successfully. Redirecting to the homepage...");
          startTransition(() => {
            router.replace("/");
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
        <h1 className="text-[2rem] font-semibold tracking-[-0.03em] text-text-navy-900">
          Login
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Sign in to manage procurement requests, orders, and deliveries.
        </p>
      </div>

      {message ? <AuthFeedback tone="success">{message}</AuthFeedback> : null}

      {error ? <AuthFeedback tone="error">{error}</AuthFeedback> : null}

      <TextField
        autoComplete="email"
        id="login-email"
        inputMode="email"
        label="Email"
        name="email"
        onChange={(event) =>
          setForm((current) => ({ ...current, email: event.target.value }))
        }
        placeholder="Enter your email"
        required
        spellCheck={false}
        type="email"
        value={form.email}
      />
      <TextField
        autoComplete="current-password"
        id="login-password"
        label="Password"
        name="password"
        onChange={(event) =>
          setForm((current) => ({ ...current, password: event.target.value }))
        }
        placeholder="Enter your password"
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

      <div className="flex justify-end text-xs">
        <Link
          className="font-semibold text-primary-blue-500 transition-interactive hover:text-primary-blue-600"
          href="/reset-password"
        >
          Forgot password
        </Link>
      </div>

      <button
        className="inline-flex h-12 w-full items-center justify-center rounded-button bg-primary-navy px-5 text-sm font-semibold text-text-inverse shadow-card transition-interactive hover:bg-primary-navy-600 focus-visible:outline-none focus-visible:shadow-focus disabled:state-disabled"
        data-state={loading ? "loading" : undefined}
        disabled={loading}
        type="submit"
      >
        {loading ? "Signing in..." : "Sign in"}
      </button>

      <div className="space-y-3">
        <SocialAuthButton provider="google" />
        <SocialAuthButton provider="facebook" />
      </div>

      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{" "}
        <Link
          className="font-semibold text-primary-blue-500 transition-interactive hover:text-primary-blue-600"
          href="/signup"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
