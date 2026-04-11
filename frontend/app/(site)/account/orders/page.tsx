import type { Metadata } from "next";
import Link from "next/link";
import { Package, ArrowLeft } from "lucide-react";
import OrderHistoryClient from "./orders-client";

export const metadata: Metadata = {
  title: "My Orders | Procurely",
  description: "View your Procurely order history, track deliveries, and review past purchases.",
};

export default function OrdersPage() {
  return <OrderHistoryClient />;
}
