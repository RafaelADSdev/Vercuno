import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/data/site";
import { MotionController } from "@/components/MotionController";

const siteTitle = `${siteConfig.name} · Criação de Sites, Landing Pages e Sistemas Web`;
const latinFont = "/assets/fonts/rethink-sans-latin-wght-normal.woff2";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteTitle,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteTitle,
    description: siteConfig.description,
    type: "website",
    locale: "pt_BR",
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      {process.env.NODE_ENV === "production" && (
        <head>
          <script defer src="https://sv.stayview.com.br/sv.js" data-site="Rqh2PLVLhXfzgp5A" crossOrigin="anonymous" />
        </head>
      )}
      <body>
        <link rel="preload" href={latinFont} as="font" type="font/woff2" crossOrigin="anonymous" />
        <MotionController />
        {children}
      </body>
    </html>
  );
}
