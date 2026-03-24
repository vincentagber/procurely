import { BrandGrid } from "@/components/home/brand-grid";
import { CategorySection } from "@/components/home/category-section";
import { FaqSection } from "@/components/home/faq-section";
import { HeroSection } from "@/components/home/hero-section";
import { ProductSection } from "@/components/home/product-section";
import { PromoBanner } from "@/components/home/promo-banner";
import { TestimonialSection } from "@/components/home/testimonial-section";
import type { Product, SiteContent } from "@/lib/types";

type HomePageProps = {
  content: SiteContent;
  searchQuery?: string;
  searchResults?: Product[];
};

export function HomePage({
  content,
  searchQuery = "",
  searchResults,
}: HomePageProps) {
  const query = searchQuery.trim().toLowerCase();
  const resolveProducts = (ids: string[]) =>
    ids
      .map((id) => content.products.find((product) => product.id === id))
      .filter((product): product is NonNullable<typeof product> => Boolean(product));

  const bestSellers = resolveProducts(content.bestSellerSection.productIds);
  const exploreProducts = resolveProducts(content.exploreSection.productIds);
  const filteredExploreProducts = searchResults ?? (query
    ? exploreProducts.filter((product) =>
        `${product.name} ${product.shortDescription} ${product.category}`
          .toLowerCase()
          .includes(query),
      )
    : exploreProducts);

  return (
    <>
      <HeroSection features={content.features} hero={content.hero} />
      <CategorySection section={content.categoriesSection} />
      <BrandGrid brands={content.brands} />
      <ProductSection
        accent={content.bestSellerSection.eyebrowAccent}
        eyebrow={content.bestSellerSection.monthLabel}
        id="best-sellers"
        lead={content.bestSellerSection.eyebrowLead}
        products={bestSellers}
        topActionLabel={content.bestSellerSection.linkLabel}
      />
      <PromoBanner banner={content.promotions.financing} controls />
      <ProductSection
        accent={content.exploreSection.eyebrowAccent}
        bottomActionLabel={content.exploreSection.ctaLabel}
        eyebrow={content.exploreSection.monthLabel}
        id="explore-products"
        lead={content.exploreSection.eyebrowLead}
        products={filteredExploreProducts}
        searchQuery={query}
        showCarouselControls
      />
      <PromoBanner banner={content.promotions.renovation} id="quote" />
      <FaqSection faqs={content.faqs} />
      <TestimonialSection
        items={content.testimonials.items}
        title={content.testimonials.title}
      />
    </>
  );
}
