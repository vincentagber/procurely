import type { ReactNode } from "react";

import { cn } from "@/lib/format";

export function DocsShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8 px-2 py-4 sm:px-4">
      <div className="max-w-[820px]">
        <p className="text-eyebrow text-secondary-orange-500">{eyebrow}</p>
        <h1 className="mt-4 text-section-title-md font-semibold text-text-navy-900 md:text-section-title">
          {title}
        </h1>
        <p className="mt-4 max-w-[760px] text-body-base text-neutral-600">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-panel border border-border-subtle bg-surface-raised p-6 shadow-card sm:p-7",
        className,
      )}
    >
      <div className="max-w-[760px]">
        <h2 className="text-card-title text-text-navy-900">{title}</h2>
        {description ? (
          <p className="mt-2 text-body-sm text-neutral-600">{description}</p>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function CodeTag({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-full bg-neutral-100 px-3 py-1 text-[12px] font-semibold text-text-navy-700">
      {children}
    </code>
  );
}

export function DetailStack({
  items,
}: {
  items: Array<{ label: string; value: ReactNode }>;
}) {
  return (
    <dl className="space-y-2">
      {items.map((item) => (
        <div
          className="flex flex-wrap items-start justify-between gap-3 border-b border-border-subtle/70 pb-2"
          key={item.label}
        >
          <dt className="text-body-sm font-medium text-neutral-500">{item.label}</dt>
          <dd className="text-right text-body-sm text-text-navy-900">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function PreviewPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-card border border-border-subtle bg-neutral-50 p-5 shadow-card-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}
