"use client";

import {
  forwardRef,
  type InputHTMLAttributes,
  type ReactNode,
  type TextareaHTMLAttributes,
} from "react";

import { cn } from "@/lib/format";

type BaseProps = {
  label?: string;
  className?: string;
  fieldClassName?: string;
  hint?: string;
  error?: string;
};

type TextFieldProps = BaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    trailingAdornment?: ReactNode;
  };
type TextAreaFieldProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    rows?: number;
  };

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField(
    { label, className, error, fieldClassName, hint, trailingAdornment, ...props },
    ref,
  ) {
    return (
      <label className={cn("flex w-full flex-col gap-2", className)}>
        {label || hint ? (
          <span className="flex items-center justify-between gap-3 text-sm text-text-navy-700">
            {label ? <span className="font-medium">{label}</span> : <span />}
            {hint ? <span className="text-xs text-neutral-500">{hint}</span> : null}
          </span>
        ) : null}

        <div className="relative">
          <input
            ref={ref}
            aria-invalid={error ? true : props["aria-invalid"]}
            className={cn(
              "h-12 w-full rounded-field border border-border-subtle bg-neutral-100 px-4 text-[15px] text-text-navy-900 shadow-field outline-none transition-interactive placeholder:text-neutral-500 focus:border-border-accent focus:bg-neutral-0 focus:shadow-focus",
              trailingAdornment ? "pr-14" : "",
              error
                ? "border-state-error-500 focus:border-state-error-500 focus:shadow-[0_0_0_3px_rgba(225,29,72,0.14)]"
                : "",
              fieldClassName,
            )}
            {...props}
          />
          {trailingAdornment ? (
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              {trailingAdornment}
            </div>
          ) : null}
        </div>

        {error ? (
          <span className="text-xs text-state-error-700" role="alert">
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField(
    { label, className, error, fieldClassName, hint, rows = 5, ...props },
    ref,
  ) {
    return (
      <label className={cn("flex w-full flex-col gap-2", className)}>
        {label || hint ? (
          <span className="flex items-center justify-between gap-3 text-sm text-text-navy-700">
            {label ? <span className="font-medium">{label}</span> : <span />}
            {hint ? <span className="text-xs text-neutral-500">{hint}</span> : null}
          </span>
        ) : null}
        <textarea
          ref={ref}
          aria-invalid={error ? true : props["aria-invalid"]}
          rows={rows}
          className={cn(
            "w-full rounded-[16px] border border-border-subtle bg-neutral-100 px-4 py-3 text-[15px] text-text-navy-900 shadow-field outline-none transition-interactive placeholder:text-neutral-500 focus:border-border-accent focus:bg-neutral-0 focus:shadow-focus",
            error
              ? "border-state-error-500 focus:border-state-error-500 focus:shadow-[0_0_0_3px_rgba(225,29,72,0.14)]"
              : "",
            fieldClassName,
          )}
          {...props}
        />

        {error ? (
          <span className="text-xs text-state-error-700" role="alert">
            {error}
          </span>
        ) : null}
      </label>
    );
  },
);
