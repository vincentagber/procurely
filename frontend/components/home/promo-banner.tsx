import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Reveal } from "@/components/ui/reveal";
import type { PromotionBanner } from "@/lib/types";

type PromoBannerProps = {
  banner: PromotionBanner;
  controls?: boolean;
  id?: string;
};

export function PromoBanner({
  banner,
  controls = false,
  id,
}: PromoBannerProps) {
  return (
    <section className="container-shell py-10 md:py-14" id={id}>
      <Reveal className="relative">
        <Link
          className="relative block overflow-hidden rounded-[30px] shadow-[0_28px_70px_rgba(19,24,79,0.12)]"
          href={banner.href}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={banner.title}
            className="h-auto w-full object-cover"
            src={banner.bannerImage}
          />
          <span className="sr-only">
            {banner.title} {banner.description}
          </span>
        </Link>

        {controls ? (
          <>
            <button className="absolute left-0 top-1/2 inline-flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-lg">
              <ArrowLeft className="size-5" />
            </button>
            <button className="absolute right-0 top-1/2 inline-flex size-12 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-lg">
              <ArrowRight className="size-5" />
            </button>
          </>
        ) : null}
      </Reveal>
    </section>
  );
}
