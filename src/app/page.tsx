import type { Metadata } from "next";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { AssetImage } from "@/components/AssetImage";
import { Header } from "@/components/Header";
import { ProjectPortfolio } from "@/components/ProjectPortfolio";
import { ReviewCarousel } from "@/components/ReviewCarousel";
import { ScrollLink } from "@/components/ScrollLink";
import { ServicePackages } from "@/components/ServicePackages";
import { SiteFooter } from "@/components/SiteFooter";
import { googleBusinessProfileUrl, googleReviews } from "@/data/reviews";
import { siteConfig, team, whatsappHref, whatsappNumber } from "@/data/site";
import { nauticaDesktopPreviewWidths } from "@/lib/cases";

export const metadata: Metadata = { alternates: { canonical: "/" } };

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": new URL("/#organizacao", siteConfig.url).href,
  name: siteConfig.name,
  url: siteConfig.url,
  logo: new URL(siteConfig.logo.src, siteConfig.url).href,
  description: siteConfig.description,
  areaServed: "BR",
  ...(whatsappNumber ? { contactPoint: { "@type": "ContactPoint", telephone: `+${whatsappNumber}`, contactType: "sales", availableLanguage: "pt-BR" } } : {}),
};

function SectionLabel({ children }: { children: string }) {
  return <p className="section-label">{children}</p>;
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <div className="page-ruler" aria-hidden="true">
        <span />
      </div>

      <main id="conteudo" tabIndex={-1}>
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-orbit" aria-hidden="true" />
          <div className="hero-copy">
            <p className="hero-eyebrow">{siteConfig.name} · Software e design</p>
            <h1 id="hero-title">
              <span>Criamos sites </span>
              <span className="accent">e sistemas web </span>
              <span>sob medida.</span>
            </h1>
            <p className="hero-summary">
              Landing pages, sites institucionais e sistemas web com design e código próprios.
            </p>
            <div className="hero-actions">
              <a className="primary-button" href={whatsappHref ?? "#contato"}
                target={whatsappHref ? "_blank" : undefined} rel={whatsappHref ? "noreferrer" : undefined}>
                {whatsappHref ? "Falar no WhatsApp" : "Falar com a equipe"} <ArrowRight size={18} aria-hidden="true" />
              </a>
              <ScrollLink className="text-link" href="#portfolio" focusId="portfolio-title">
                Ver portfólio <ArrowDown size={17} aria-hidden="true" />
              </ScrollLink>
            </div>
          </div>

          <div className="hero-proof">
            <div className="proof-board">
              <div className="board-meta" aria-hidden="true">
                <span>PROJETO ENTREGUE</span>
                <span>NÁUTICA ENGENHARIA</span>
              </div>
              <div className="desktop-frame">
                <div className="browser-bar" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                  <span>nauticaengenharia.vercel.app</span>
                </div>
                <AssetImage
                  src="/assets/cases/nautica-after-desktop.webp"
                  alt="Página inicial da Náutica Engenharia em uma tela de computador"
                  width={1440}
                  height={900}
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 820px) 82vw, (max-width: 1100px) 39vw, 44vw"
                  webpWidths={nauticaDesktopPreviewWidths}
                />
              </div>
              <div className="mobile-frame">
                <span className="mobile-speaker" aria-hidden="true" />
                <AssetImage
                  src="/assets/cases/nautica-after-mobile.webp"
                  alt="Página da Náutica Engenharia adaptada para celular"
                  width={390}
                  height={844}
                  loading="eager"
                  fetchPriority="low"
                  sizes="(max-width: 820px) 24vw, 11vw"
                  webpWidths={[160, 256]}
                />
              </div>
              <div className="board-note">
                <span>LANDING PAGE</span>
                <strong>Site responsivo + direção visual</strong>
              </div>
            </div>
          </div>

          <div className="hero-footer" aria-hidden="true">
            <span>RECIFE / BRASIL</span>
            <span className="hero-line" />
            <span>PROJETOS DIGITAIS · 2026</span>
          </div>
        </section>

        <ServicePackages />
        <ProjectPortfolio />
        {googleReviews.length > 0 && <ReviewCarousel reviews={googleReviews} profileUrl={googleBusinessProfileUrl} />}

        <section className="section team-section" id="equipe" aria-labelledby="team-title">
          <div className="team-heading">
            <SectionLabel>Equipe</SectionLabel>
            <h2 id="team-title">Quem faz seu projeto</h2>
            <p>Você fala direto com os sócios que planejam, desenvolvem e acompanham a entrega.</p>
          </div>
          <div className="team-grid">
            {team.map((member) => (
              <article key={member.name}>
                <div className="portrait">
                  <AssetImage
                    src={member.image}
                    alt={`Retrato de ${member.name}`}
                    width={900}
                    height={900}
                    loading="lazy"
                    sizes="(max-width: 700px) 86vw, 30vw"
                  />
                </div>
                <h3>{member.name}</h3>
                <p>{member.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="contact-section" id="contato" aria-labelledby="contact-title">
          <div className="contact-glow" aria-hidden="true" />
          <div className="section contact-copy">
            <h2 id="contact-title">Vamos falar do seu projeto?</h2>
            <p>Conte o que você precisa. Um dos sócios conversa com você sobre escopo, prazo e orçamento.</p>
            {whatsappHref ? (
              <>
                <a className="primary-button" href={whatsappHref} target="_blank" rel="noreferrer">
                  Falar no WhatsApp <ArrowUpRight size={18} aria-hidden="true" />
                </a>
                <p className="contact-note">
                  Atendimento em horário comercial.
                </p>
              </>
            ) : (
              <p className="contact-note">
                O canal de WhatsApp será exibido quando o número comercial for configurado.
              </p>
            )}
            <p className="contact-note">E-mail: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></p>
          </div>
        </section>
      </main>

      <SiteFooter home />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
