import type { Metadata } from "next";
import ProfileDashboard from "@/components/account/profile-dashboard";

export const metadata: Metadata = {
  title: "Profile Order | Procurely",
  description: "View your profile order dashboard and procurement activity.",
};

export default function ProfileOrderPage() {
  return <ProfileDashboard />;
}
