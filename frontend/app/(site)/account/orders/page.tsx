import type { Metadata } from "next";
import OrderHistoryClient from "./orders-client";

export const metadata: Metadata = {
  title: "My Orders | Procurely",
  description: "View your Procurely order history, track deliveries, and review past purchases.",
};

export default function OrdersPage() {
  return (
    <OrderHistoryClient />
  );
}
