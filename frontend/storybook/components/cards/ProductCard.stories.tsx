import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { ProductCard } from "@/components/product-card";
import {
  bestSellerProducts,
  primaryProduct,
} from "@/storybook/fixtures/procurely-content";

const meta = {
  title: "Components/Cards/Product Card",
  component: ProductCard,
  parameters: {
    docs: {
      description: {
        component:
          "Procurely product cards use hover lift, image scaling, and a focused CTA button state. The add-to-cart button should remain keyboard reachable and announce itself as a button, not a generic div.",
      },
    },
  },
  args: {
    product: primaryProduct,
  },
} satisfies Meta<typeof ProductCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleCard: Story = {};

export const MerchandisingGrid: Story = {
  render: () => (
    <div className="grid max-w-[1180px] gap-6 md:grid-cols-2 xl:grid-cols-4">
      {bestSellerProducts.map((product, index) => (
        <ProductCard index={index} key={product.id} product={product} />
      ))}
    </div>
  ),
};
