import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const stayViewOrigin = "https://sv.stayview.com.br";
const stayViewScripts = `${stayViewOrigin}/sv.js ${stayViewOrigin}/sv-rec.js`;
const stayViewConnections = ["config", "ingest", "replay"]
  .map((endpoint) => `${stayViewOrigin}/api/analytics/${endpoint}`)
  .join(" ");

// Static App Router pages use inline scripts to bootstrap React and its payload.
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : stayViewScripts}`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  isDev ? "connect-src 'self'" : `connect-src 'self' ${stayViewConnections}`,
  "object-src 'none'",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'self'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          ...(!isDev ? [{ key: "Strict-Transport-Security", value: "max-age=31536000" }] : []),
        ],
      },
    ];
  },
};

export default nextConfig;
