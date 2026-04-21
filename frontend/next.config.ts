import type { NextConfig } from "next";

/**
 * PROCURELY™ NEXT.JS CORE CONFIGURATION
 * Optimized for HIGH-FIDELITY visual rendering and cPanel STATIC EXPORT deployment.
 */
const nextConfig: NextConfig = {
  output: "export", // STATIC EXPORT MODE
  trailingSlash: true, // Required for clean URLs on static hosting like cPanel
  images: {
    unoptimized: true, // Required for 'output: export'
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      }
    ],
  },
  // HIGH-6 FIX: Headers are not supported with 'output: export'
  // and can cause build errors in some Next.js versions.
  // Move these to your server configuration (e.g., .htaccess)
  /*
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https: blob:; connect-src 'self' https://useprocurely.com http://localhost:8000; frame-src 'self' https://js.paystack.co;",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
  */
};

export default nextConfig;
