import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/format";

type AuthFeedbackProps = {
  tone: "error" | "success";
  children: ReactNode;
};

export function AuthFeedback({ tone, children }: AuthFeedbackProps) {
  const toneClassName =
    tone === "success"
      ? "border-state-success-500/15 bg-state-success-50 text-state-success-700"
      : "border-state-error-500/15 bg-state-error-50 text-state-error-700";

  return (
    <div
      className={cn(
        "animate-status-pop rounded-card-sm border px-4 py-3 text-sm leading-6",
        toneClassName,
      )}
      role={tone === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}

type PasswordToggleButtonProps = {
  visible: boolean;
  onToggle: () => void;
};

export function PasswordToggleButton({
  visible,
  onToggle,
}: PasswordToggleButtonProps) {
  return (
    <button
      aria-label={visible ? "Hide password" : "Show password"}
      className="text-xs font-semibold text-primary-blue-500 transition-interactive hover:text-primary-blue-600 focus-visible:outline-none"
      onClick={onToggle}
      type="button"
    >
      {visible ? "Hide" : "Show"}
    </button>
  );
}

type SocialAuthButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  provider: "facebook" | "google";
};

export function SocialAuthButton({
  className,
  disabled = true,
  provider,
  ...props
}: SocialAuthButtonProps) {
  const Icon = provider === "google" ? GoogleIcon : FacebookIcon;
  const label =
    provider === "google" ? "Sign in with Google" : "Sign in with Facebook";

  return (
    <button
      className={cn(
        "inline-flex h-12 w-full items-center justify-center gap-3 rounded-button-pill border border-border-subtle bg-neutral-0 px-5 text-sm font-medium text-text-navy-700 shadow-card-soft transition-interactive hover:border-neutral-300 hover:bg-neutral-50 focus-visible:outline-none focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-100 disabled:hover:border-border-subtle disabled:hover:bg-neutral-0",
        className,
      )}
      disabled={disabled}
      title={disabled ? `${label} is not configured yet.` : undefined}
      type="button"
      {...props}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.6 12.23c0-.78-.07-1.53-.2-2.23H12v4.22h5.38a4.6 4.6 0 0 1-1.99 3.01v2.5h3.22c1.88-1.73 2.99-4.28 2.99-7.5Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.61-2.43l-3.22-2.5c-.9.6-2.04.96-3.39.96-2.61 0-4.82-1.76-5.62-4.13H3.05v2.58A9.98 9.98 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.38 13.9A6 6 0 0 1 6.06 12c0-.66.12-1.3.32-1.9V7.52H3.05A9.98 9.98 0 0 0 2 12c0 1.61.38 3.14 1.05 4.48l3.33-2.58Z"
        fill="#FBBC04"
      />
      <path
        d="M12 5.97c1.47 0 2.79.5 3.83 1.5l2.87-2.87C16.95 2.98 14.7 2 12 2a9.98 9.98 0 0 0-8.95 5.52l3.33 2.58c.8-2.37 3.01-4.13 5.62-4.13Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11 10.13 11.9v-8.42H7.08v-3.48h3.05V9.41c0-3.03 1.79-4.7 4.53-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.95.93-1.95 1.88v2.27h3.32l-.53 3.48h-2.79v8.42C19.61 23.07 24 18.09 24 12.07Z"
        fill="#1877F2"
      />
      <path
        d="m16.66 15.55.53-3.48h-3.32V9.8c0-.95.46-1.88 1.95-1.88h1.5V4.95s-1.36-.24-2.67-.24c-2.74 0-4.53 1.67-4.53 4.7v2.66H7.08v3.48h3.05v8.42a12.2 12.2 0 0 0 3.75 0v-8.42h2.78Z"
        fill="#fff"
      />
    </svg>
  );
}
