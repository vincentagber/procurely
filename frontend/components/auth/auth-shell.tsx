import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

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
      <nav className="rounded-[18px] bg-[#f6f7fd] px-6 py-4 text-sm flex items-center gap-1 text-slate-400">
        <Link className="transition hover:text-[#13184f]" href="/">
          Home
        </Link>
        <span className="mx-1.5">/</span>
        <span>pages</span>
        <span className="mx-1.5">/</span>
        <span className="font-semibold text-[#13184f]">
          {pageLabel}
        </span>
      </nav>

      <div className="mt-10 rounded-[34px] border border-slate-100 bg-white p-4 shadow-[0_36px_90px_rgba(19,24,79,0.08)] md:p-5">
        <div className="grid gap-4 lg:grid-cols-[0.95fr_1.15fr]">
          <div className="flex min-h-[540px] items-center justify-center rounded-[28px] px-5 py-10 md:px-10">
            {children}
          </div>

          <div className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(135deg,#1900ff_0%,#1f13ff_52%,#2a2eff_100%)] px-7 py-8 text-white">
            <span className="absolute left-6 top-1/2 h-28 w-px -translate-y-1/2 bg-white/35" />
            <span className="absolute bottom-8 left-8 h-px w-16 bg-white/35" />
            <div className="relative z-10 flex h-full flex-col justify-between">
              <h2 className="max-w-[320px] text-[2rem] font-semibold leading-tight tracking-[-0.03em] md:text-[2.4rem]">
                {title}
              </h2>
              <div className="relative mx-auto mt-6 w-full max-w-[360px]">
                <div className="relative aspect-[1/1.1]">
                  <Image
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 1024px) 60vw, 420px"
                    src={image}
                    className="object-contain object-bottom"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
