import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/data/site";
import { MotionController } from "@/components/MotionController";

const siteTitle = `${siteConfig.name} · Criação de Sites, Landing Pages e Sistemas Web`;

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
      <body>
        <MotionController />
        {children}
      </body>
    </html>
  );
}
