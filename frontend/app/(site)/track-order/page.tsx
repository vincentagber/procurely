import type { Metadata } from "next";
import { TrackOrderClient } from "./track-order-client";

export const metadata: Metadata = {
  title: "Track My Order | Procurely",
  description: "Check the status of your building material order using your order number and email address.",
};

export default function TrackOrderPage() {
  return <TrackOrderClient />;
}
