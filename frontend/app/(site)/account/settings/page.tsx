import type { Metadata } from "next";
import SettingsClient from "./settings-client";

export const metadata: Metadata = {
  title: "Account Settings | Procurely",
  description: "Manage your profile, company details, and system preferences.",
};

export default function SettingsPage() {
  return (
    <SettingsClient />
  );
}
