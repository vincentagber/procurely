import React from "react";
import OrderDetailClient from "./order-detail-client";

type Props = { params: Promise<{ orderNumber: string }> };

export async function generateStaticParams() {
  return [{ orderNumber: "detail" }];
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;
  
  return (
    <OrderDetailClient orderNumber={orderNumber} />
  );
}
