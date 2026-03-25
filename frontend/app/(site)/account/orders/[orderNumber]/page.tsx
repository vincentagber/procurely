import type { Metadata } from "next";
import OrderDetailClient from "./order-detail-client";

type Props = { params: Promise<{ orderNumber: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber} | Procurely`,
    description: `Track and review the details of your Procurely order ${orderNumber}.`,
  };
}

export default function OrderDetailPage() {
  return (
    <div className="bg-[#f6f7fd] min-h-screen">
      <div className="container-shell py-10">
        <OrderDetailClient />
      </div>
    </div>
  );
}
