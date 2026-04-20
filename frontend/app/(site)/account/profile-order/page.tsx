import type { Metadata } from "next";
import ProfileOrderDetail from "@/components/account/profile-order-detail";

export const metadata: Metadata = {
  title: "Profile Order | Procurely",
  description: "View your profile order dashboard and procurement activity.",
};

export default function ProfileOrderPage() {
  return <ProfileOrderDetail />;
}
