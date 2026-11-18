import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { CaseCard } from "@/components/CaseCard";
import { CaseFilter } from "@/components/CaseFilter";
import { CaseHero } from "@/components/CaseHero";
import { siteConfig, whatsappHref } from "@/data/site";
import { cases, caseTypes, type CaseStudy } from "@/lib/cases";
import styles from "./portfolio.module.css";

const title = "Portfólio de clientes";
const description = "Projetos da Vercuno, com escopo, decisões técnicas e detalhes de cada entrega.";
const featured = cases.find((study) => study.featured);
const portfolioUrl = new URL("/portfolio", siteConfig.url).href;
const shareImage = new URL(featured?.images.desktopAfter ?? "/assets/brand/vercuno-cover.png", siteConfig.url).href;
const types = Object.keys(caseTypes) as CaseStudy["projectType"][];
const filters = [
  { value: "todos" as const, label: "Todos" },
  ...types.map((value) => ({ value, label: caseTypes[value].plural })),
];
const scores = [
  { label: "Performance", score: 96 },
  { label: "Acessibilidade", score: 100 },
  { label: "Boas práticas", score: 100 },
  { label: "SEO", score: 100 },
];

export function generateMetadata(): Metadata {
  const socialTitle = `${title} · ${siteConfig.name}`;
  return {
    title,
    description,
    alternates: { canonical: portfolioUrl },
    openGraph: {
      title: socialTitle, description, url: portfolioUrl, siteName: siteConfig.name, locale: "pt_BR", type: "website",
      images: [{ url: shareImage, alt: featured?.images.alt.desktop ?? siteConfig.name }],
    },
    twitter: { card: "summary_large_image", title: socialTitle, description, images: [shareImage] },
  };
}

const listingSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: `${title} · ${siteConfig.name}`,
  description,
  url: portfolioUrl,
  inLanguage: "pt-BR",
  mainEntity: {
    "@type": "ItemList",
    itemListElement: cases.map(({ client, slug }, index) => ({
      "@type": "ListItem", position: index + 1, name: client, url: new URL(`/portfolio/${slug}`, siteConfig.url).href,
    })),
  },
};

export default function PortfolioPage() {
  return (
    <main id="conteudo" tabIndex={-1}>
      <div className="section">
        <header className={styles.intro}>
          <p className="section-label">Portfólio · Projetos entregues</p>
          <h1>O que já construímos</h1>
          <p>Veja o escopo, as decisões da equipe e a entrega de cada projeto.</p>
        </header>

        {featured && <CaseHero study={featured} />}

        <section className={styles.catalog} aria-labelledby="catalog-title">
          <h2 id="catalog-title">Projetos por serviço</h2>
          <CaseFilter
            options={filters}
            items={cases.map((study) => ({
              slug: study.slug,
              type: study.projectType,
              card: <CaseCard study={study} sizes="(max-width: 590px) 92vw, (max-width: 890px) 45vw, (max-width: 1520px) 29vw, 445px" />,
            }))}
            emptyState={(
              <div className={styles.empty}>
                <p>Consulte a equipe sobre projetos desse serviço.</p>
                {whatsappHref && <a className="primary-button" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  Conversar no WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
                </a>}
              </div>
            )}
          />
        </section>

        <aside className={styles.availability} aria-labelledby="availability-title">
          <div>
            <h2 id="availability-title">Conte à equipe o que seu site ou sistema precisa fazer.</h2>
          </div>
          {whatsappHref && <a className="service-cta" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            Consultar disponibilidade <ArrowUpRight size={17} aria-hidden="true" />
          </a>}
        </aside>
      </div>

      <section className={styles.evidence} aria-labelledby="evidence-title">
        <div className={`section ${styles.evidenceInner}`}>
          <div>
            <h2 id="evidence-title">Auditoria Lighthouse</h2>
            <p>Auditoria Lighthouse mobile da página inicial do Vercuno em ambiente local.</p>
          </div>
          <dl className={styles.scores}>
            {scores.map(({ label, score }) => <div key={label}><dt>{label}</dt><dd>{score}</dd></div>)}
          </dl>
        </div>
      </section>

      <section className="contact-section" id="contato" aria-labelledby="portfolio-contact">
        <div className="section contact-copy">
          <h2 id="portfolio-contact">Conversa direta com um sócio.</h2>
          <p>Conte o que você quer construir.</p>
          {whatsappHref && <a className="primary-button" href={whatsappHref} target="_blank" rel="noopener noreferrer">
            Falar no WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
          </a>}
          <p className="contact-note">Respondemos em horário comercial.</p>
        </div>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema).replace(/</g, "\\u003c") }} />
    </main>
  );
}
