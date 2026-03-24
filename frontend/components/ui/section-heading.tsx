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
          <div className="mb-4 flex items-center gap-3 text-[15px] font-semibold text-[var(--color-brand-accent)]">
            <span className="inline-flex h-10 w-4 rounded-full bg-[var(--color-brand-accent)]" />
            {eyebrow}
          </div>
        ) : null}
        <h2 className="text-[2rem] font-semibold tracking-[-0.04em] text-[var(--color-brand-navy)] md:text-[2.5rem]">
          {lead} <span className="text-[var(--color-brand-blue)]">{accent}</span>
        </h2>
        <div className="mt-4 h-1 w-44 rounded-full bg-[var(--color-brand-accent)]" />
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
