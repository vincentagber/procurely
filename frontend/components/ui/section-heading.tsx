import Link from "next/link";
import { ChevronRight } from "lucide-react";

type SectionHeadingProps = {
  eyebrow?: string;
  lead: string;
  accent: string;
  actionLabel?: string;
  actionHref?: string;
};

export function SectionHeading({
  eyebrow,
  lead,
  accent,
  actionLabel,
  actionHref = "#",
}: SectionHeadingProps) {
  return (
    <div className="relative flex flex-col gap-4 border-b border-slate-200 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-[var(--color-brand-accent)] sm:mb-4 sm:text-[15px]">
            <span className="inline-flex h-8 w-3 bg-[var(--color-brand-accent)] sm:h-10 sm:w-4" />
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-[1.65rem] font-bold text-slate-600 sm:text-[1.85rem] md:text-[2.1rem]">
          {lead} <span className="text-[var(--color-brand-blue)]">{accent}</span>
        </h2>
      </div>

      {actionLabel ? (
        <Link
          className="group flex items-center gap-1 text-[15px] font-semibold text-slate-800 transition hover:text-[var(--color-brand-blue)] mb-0.5"
          href={actionHref}
        >
          {actionLabel}
          <ChevronRight className="size-5 text-[var(--color-brand-accent)] transition-transform group-hover:translate-x-1 border-[var(--color-brand-accent)]" strokeWidth={2.5} />
        </Link>
      ) : null}

      <div className="absolute -bottom-[2px] left-0 h-[3px] w-28 bg-[var(--color-brand-accent)] sm:w-36 md:w-56" />
    </div>
  );
}
