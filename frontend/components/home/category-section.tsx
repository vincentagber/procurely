import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { cn } from "@/lib/format";
import type { SiteContent } from "@/lib/types";

type CategorySectionProps = {
  section: SiteContent["categoriesSection"];
};

const variantClasses = {
  wide: "md:col-span-8 md:row-span-2",
  tall: "md:col-span-4 md:row-span-2",
  "wide-small": "md:col-span-6",
  small: "md:col-span-3",
} as const;

export function CategorySection({ section }: CategorySectionProps) {
  return (
    <section className="container-shell py-12 md:py-16">
      <SectionHeading
        actionHref="#explore-products"
        actionLabel={section.linkLabel}
        accent={section.eyebrowAccent}
        lead={section.eyebrowLead}
      />

      <div className="mt-10 grid gap-5 md:grid-cols-12 md:auto-rows-[160px]">
        {section.items.map((item, index) => (
          <Reveal
            className={cn("group", variantClasses[item.variant])}
            delay={index * 0.06}
            key={item.id}
          >
            <Link
              aria-label={item.title}
              className="block h-full overflow-hidden rounded-[30px] shadow-[0_24px_60px_rgba(19,24,79,0.08)] transition group-hover:-translate-y-1"
              href={item.href}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt={item.title}
                className="h-full w-full object-cover"
                src={item.cardImage}
              />
              <span className="sr-only">
                {item.title} {item.description} {item.ctaLabel}
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
