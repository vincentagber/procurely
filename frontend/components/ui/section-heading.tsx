import Link from "next/link";

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
    <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow ? (
          <div className="mb-3 flex items-center gap-3 text-sm font-semibold text-[var(--color-brand-accent)] sm:mb-4 sm:text-[15px]">
            <span className="inline-flex h-8 w-3 rounded-full bg-[var(--color-brand-accent)] sm:h-10 sm:w-4" />
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-[1.65rem] font-semibold tracking-[-0.04em] text-[var(--color-brand-navy)] sm:text-[1.85rem] md:text-[2.5rem]">
          {lead} <span className="text-[var(--color-brand-blue)]">{accent}</span>
        </h2>
        <div className="mt-4 h-1 w-28 rounded-full bg-[var(--color-brand-accent)] sm:w-36 md:w-44" />
      </div>

      {actionLabel ? (
        <Link
          className="text-sm font-semibold text-slate-700 transition hover:text-[var(--color-brand-blue)]"
          href={actionHref}
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
