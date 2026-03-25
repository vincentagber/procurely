import type { Metadata } from "next";
import { getProcurelyContent } from "@/lib/content";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/format";
import { ProductActions } from "./product-actions";
import { TestimonialSection } from "@/components/home/testimonial-section";

type Props = {
  params: { id: string };
};

export default async function ProductPage({ params }: Props) {
  const content = await getProcurelyContent();
  const product = content.products.find(p => p.id === params.id) || content.products[0];

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-[#f6f7fd]">
      <div className="container-shell mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <p className="text-sm font-bold tracking-wide text-slate-400 mb-10">
          Home <span className="mx-3 text-slate-300">/</span> Products <span className="mx-3 text-slate-300">/</span> <span className="text-[#13184f]">{product.name}</span>
        </p>

        <div className="rounded-[2.5rem] bg-white p-6 sm:p-10 lg:p-14 shadow-sm border border-slate-100 flex flex-col lg:flex-row gap-12 lg:gap-20">
           {/* Image Gallery */}
           <div className="w-full lg:w-1/2 rounded-[2rem] bg-slate-50 flex items-center justify-center p-12 border border-slate-100 min-h-[400px]">
              <img src={product.image} alt={product.name} className="max-w-full max-h-[500px] object-contain drop-shadow-2xl hover:scale-105 transition duration-500 ease-out" />
           </div>

           {/* Product Details */}
           <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <span className="text-[#ff6f4d] font-bold text-sm tracking-widest uppercase mb-4">{product.category}</span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-[#13184f] mb-6 leading-tight">{product.name}</h1>
              
              <div className="text-4xl font-black text-[#1900ff] mb-8">
                 {formatCurrency(product.price, product.currency)}
                 <span className="text-base text-slate-400 ml-2 font-medium">/ unit</span>
              </div>

              <p className="text-lg text-slate-600 font-medium leading-relaxed mb-12 pb-12 border-b border-slate-100">
                 {product.shortDescription || "Premium quality building materials designed and engineered for durability and reliability in commercial and residential construction projects."}
              </p>

              <ProductActions product={product} />
           </div>
        </div>
      </div>

      <div className="bg-[#fde8df] mt-24 py-32 text-center border-t border-slate-100">
         <div className="container-shell mx-auto">
           <TestimonialSection title="What Contractors Say" items={content.testimonials.items} />
         </div>
      </div>
    </div>
  );
}
