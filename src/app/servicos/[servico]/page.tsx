import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { buildWhatsappHref, services, siteConfig } from "@/data/site";
import { cases } from "@/lib/cases";
import styles from "./service.module.css";

type Props = { params: Promise<{ servico: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map(({ slug }) => ({ servico: slug }));
}

async function getService(params: Props["params"]) {
  const { servico } = await params;
  const service = services.find(({ slug }) => slug === servico);
  if (!service) notFound();
  return service;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = await getService(params);
  const url = `/servicos/${service.slug}`;
  const title = `${service.searchTitle} · ${siteConfig.name}`;
  return {
    title: service.searchTitle,
    description: service.details,
    alternates: { canonical: url },
    openGraph: { title, description: service.details, url, locale: "pt_BR", type: "website", siteName: siteConfig.name },
    twitter: { card: "summary", title, description: service.details },
  };
}

export default async function ServicePage({ params }: Props) {
  const service = await getService(params);
  const related = cases.filter((study) => study.projectType === service.projectType);
  const whatsapp = buildWhatsappHref(service.whatsappMessage);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.searchTitle,
    description: service.details,
    url: new URL(`/servicos/${service.slug}`, siteConfig.url).href,
    provider: { "@id": new URL("/#organizacao", siteConfig.url).href },
    areaServed: "BR",
  };

  return (
    <main className={`section ${styles.page}`}>
      <Link className={styles.link} href="/#servicos"><ArrowLeft size={17} aria-hidden="true" /> Todos os serviços</Link>
      <article className={styles.article}>
        <header>
          <h1>{service.searchTitle}</h1>
          <p>{service.details}</p>
          {whatsapp && (
            <a className="primary-button" href={whatsapp} target="_blank" rel="noreferrer">
              Consultar pelo WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
            </a>
          )}
        </header>
        <section aria-labelledby="escopo-title">
          <h2 id="escopo-title">Escopo inicial</h2>
          <ul role="list" className={styles.scope}>
            {service.deliverables.map((item) => (
              <li key={item}><Check size={17} aria-hidden="true" />{item}</li>
            ))}
          </ul>
          {related.map((study) => (
            <Link key={study.slug} className={styles.link} href={`/portfolio/${study.slug}`}>
              Ver o projeto {study.client} <ArrowRight size={16} aria-hidden="true" />
            </Link>
          ))}
        </section>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
