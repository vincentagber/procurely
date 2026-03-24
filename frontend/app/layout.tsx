import type { Metadata } from "next";

import { Providers } from "@/app/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Procurely | Building Materials Procurement",
  description: "Procurement marketplace for BOQ-driven sourcing, verified materials, and structured checkout. The best construction materials platform.",
  keywords: "procurement, construction materials, BoQ, architecture, sourcing, marketplace",
  openGraph: {
    title: "Procurely | Building Materials Procurement",
    description: "Procurement marketplace for BOQ-driven sourcing, verified materials, and structured checkout.",
    siteName: "Procurely",
    images: [{ url: "/assets/design/logo-light.png", width: 800, height: 600, alt: "Procurely Light Logo" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Procurely | Building Materials Procurement",
    description: "Procurement marketplace for BOQ-driven sourcing, verified materials, and structured checkout.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
