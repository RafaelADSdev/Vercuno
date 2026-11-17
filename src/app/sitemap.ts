import type { MetadataRoute } from "next";
import { services, siteConfig } from "@/data/site";
import { cases } from "@/lib/cases";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...services.map((service) => `/servicos/${service.slug}`),
    "/portfolio",
    ...cases.map((study) => `/portfolio/${study.slug}`),
    "/privacidade",
  ];

  return paths.map((path) => ({ url: new URL(path, siteConfig.url).href }));
}
