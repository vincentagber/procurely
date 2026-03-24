import { Reveal } from "@/components/ui/reveal";

type BrandGridProps = {
  brands: string[];
};

export function BrandGrid({ brands }: BrandGridProps) {
  return (
    <section className="container-shell border-t border-slate-100 py-16">
      <Reveal>
        <h2 className="text-[1.8rem] font-semibold uppercase tracking-[-0.05em] text-slate-400">
          Trusted by <span className="text-[var(--color-brand-blue)]">industry leaders</span>
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {brands.map((brand, index) => (
          <Reveal delay={index * 0.04} key={brand}>
            <div className="rounded-[20px] border border-slate-100 bg-white px-5 py-6 text-center shadow-[0_16px_40px_rgba(19,24,79,0.04)]">
              <p className="text-[1.9rem] font-semibold uppercase tracking-[-0.06em] text-slate-400">
                {brand}
              </p>
              <p className="mt-3 text-sm font-semibold text-[var(--color-brand-navy)]">
                {brand}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
