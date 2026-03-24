"use client";

import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

import { cn } from "@/lib/format";

type BaseProps = {
  label?: string;
  className?: string;
};

type TextFieldProps = BaseProps & InputHTMLAttributes<HTMLInputElement>;
type TextAreaFieldProps = BaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    rows?: number;
  };

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  function TextField({ label, className, ...props }, ref) {
    return (
      <label className="flex w-full flex-col gap-2 text-sm text-slate-600">
        {label ? <span>{label}</span> : null}
        <input
          ref={ref}
          className={cn(
            "h-12 rounded-[12px] border border-slate-200 bg-[#f6f7fd] px-4 text-[15px] text-slate-900 outline-none transition focus:border-[var(--color-brand-blue)] focus:bg-white",
            className,
          )}
          {...props}
        />
      </label>
    );
  },
);

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
  function TextAreaField({ label, className, rows = 5, ...props }, ref) {
    return (
      <label className="flex w-full flex-col gap-2 text-sm text-slate-600">
        {label ? <span>{label}</span> : null}
        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "w-full rounded-[16px] border border-slate-200 bg-[#f6f7fd] px-4 py-3 text-[15px] text-slate-900 outline-none transition focus:border-[var(--color-brand-blue)] focus:bg-white",
            className,
          )}
          {...props}
        />
      </label>
    );
  },
);
