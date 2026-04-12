import { Inter, Bebas_Neue } from "next/font/google";
import type { Metadata } from "next";

import { Providers } from "@/app/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${bebasNeue.variable} min-h-screen bg-white antialiased`}>
        <Providers>{children}</Providers>
        {/* Paystack Inline Script */}
        <script src="https://js.paystack.co/v1/inline.js" async />
      </body>
    </html>
  );
}
