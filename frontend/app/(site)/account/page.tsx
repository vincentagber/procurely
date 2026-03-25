import type { Metadata } from "next";
import AccountDashboardClient from "./account-dashboard-client";

export const metadata: Metadata = {
  title: "My Dashboard | Procurely",
  description: "Manage your construction procurement, track active orders, and handle project logistics across Africa.",
};

export default function AccountPage() {
  return (
    <div className="bg-[#f6f7fd] min-h-screen">
      <div className="container-shell py-12 sm:py-16">
        <AccountDashboardClient />
      </div>
    </div>
  );
}
