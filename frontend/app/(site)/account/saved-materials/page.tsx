import type { Metadata } from "next";
import SavedMaterialsClient from "./saved-materials-client";

export const metadata: Metadata = {
  title: "Saved Materials | Procurely",
  description: "Manage your saved items and curated collection of procurement materials.",
};

export default function SavedMaterialsPage() {
  return (
    <SavedMaterialsClient />
  );
}
