import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { Reveal } from "@/components/ui/reveal";

type AuthShellProps = {
  pageLabel: string;
  title: string;
  image: string;
  children: ReactNode;
};

export function AuthShell({
  pageLabel,
  title,
  image,
  children,
}: AuthShellProps) {
  return (
    <div className="container-shell py-8 md:py-12">
      <nav
        aria-label="Breadcrumb"
        className="rounded-card bg-surface-soft px-6 py-7 text-sm text-neutral-600"
      >
        <Link className="transition-interactive hover:text-primary-blue-500" href="/">
          Home
        </Link>{" "}
        / pages / <span className="font-semibold text-text-navy-900">{pageLabel}</span>
      </nav>

      <div className="mt-10 rounded-panel border border-border-subtle bg-surface-raised p-4 shadow-panel md:p-5">
        <div className="grid gap-4 lg:grid-cols-[0.94fr_1.06fr]">
          <Reveal className="flex min-h-[540px] items-center justify-center rounded-card px-5 py-10 md:px-10">
            <div className="w-full max-w-[340px]">{children}</div>
          </Reveal>

          <Reveal
            className="relative overflow-hidden rounded-card bg-banner-electric px-7 py-8 text-text-inverse shadow-banner md:px-9 md:py-9"
            delay={0.08}
          >
            <span className="absolute left-6 top-1/2 h-28 w-px -translate-y-1/2 bg-white/35" />
            <span className="absolute bottom-8 left-8 h-px w-16 bg-white/35" />
            <span className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/8 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between">
              <h2 className="max-w-[330px] text-auth-title font-semibold leading-[1.08] tracking-[-0.04em] text-text-inverse">
                {title}
              </h2>

              <div className="relative mx-auto mt-6 w-full max-w-[420px]">
                <div className="relative aspect-[1/1.04]">
                  <Image
                    alt=""
                    aria-hidden="true"
                    fill
                    priority
                    sizes="(max-width: 1024px) 78vw, 420px"
                    src={image}
                    className="object-contain object-bottom"
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
