import type { Metadata } from "next";
import React, { Suspense } from "react";
import { getProcurelyContent } from "@/lib/content";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import { ProductActions } from "./product-actions";
import { TestimonialSection } from "@/components/home/testimonial-section";

type Props = {
  params: Promise<{ id: string }>;
};

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const content = await getProcurelyContent();
  return content.products.map((product) => ({
    id: String(product.id),
  }));
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const content = await getProcurelyContent();
  const product = content.products.find(p => p.id === id) || content.products[0];

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<div className="bg-[#f6f7fd] min-h-screen animate-pulse" />}>
      <div className="bg-[#f6f7fd]">
        <div className="container-shell mx-auto px-4 pt-10 pb-4 sm:px-6 lg:px-8">
          <div className="w-full rounded-[10px] bg-[#F9FAFB] px-6 py-4">
            <p className="text-[14px] font-bold tracking-tight text-[#98A2B3]">
              Home <span className="mx-2 text-[#98A2B3]">/</span> <span className="text-[#04071E]">Product Detail</span>
            </p>
          </div>
        </div>

        <section className="container-shell mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100">
              <img
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                src={product.image}
              />
            </div>

            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center rounded-full bg-[#1900ff]/10 px-4 py-1.5 text-[12px] font-bold uppercase tracking-wider text-[#1900ff]">
                Premium Material
              </div>
              <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-[#13184f] sm:text-5xl">
                {product.name}
              </h1>
              <p className="mb-8 text-xl font-medium leading-relaxed text-slate-500">
                {product.shortDescription}
              </p>

              <div className="mb-10 flex items-center gap-4">
                <span className="text-4xl font-black text-[#13184f]">
                  ₦{product.price.toLocaleString()}
                </span>
                <span className="text-lg font-bold text-slate-300 line-through">
                  ₦{(product.price * 1.2).toLocaleString()}
                </span>
              </div>

              <ProductActions product={product} />
            </div>
          </div>
        </section>

        <div className="bg-[#fde8df] mt-24 py-32 text-center border-t border-slate-100">
           <div className="container-shell mx-auto">
             <TestimonialSection title="What Contractors Say" items={content.testimonials.items} />
           </div>
        </div>
      </div>
    </Suspense>
  );
}
