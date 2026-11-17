import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { BeforeAfter } from "@/components/BeforeAfter";
import { DeviceMockup } from "@/components/DeviceMockup";
import { buildWhatsappHref, siteConfig } from "@/data/site";
import { cases, caseTypes, type CaseStudy } from "@/lib/cases";
import styles from "./project.module.css";

type ProjectPageProps = { params: Promise<{ projeto: string }> };

export const dynamicParams = false;

async function getCase(params: ProjectPageProps["params"]) {
  const { projeto } = await params;
  const index = cases.findIndex(({ slug }) => slug === projeto);
  if (index < 0) notFound();
  return { project: cases[index], previous: cases[index - 1], next: cases[index + 1] };
}

export function generateStaticParams() {
  return cases.map(({ slug }) => ({ projeto: slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { project } = await getCase(params);
  const title = `${project.client} · ${caseTypes[project.projectType].singular}`;
  const shareTitle = `${title} · ${siteConfig.name}`;
  const canonical = new URL(`/portfolio/${project.slug}`, siteConfig.url).href;
  const image = new URL(project.images.desktopAfter, siteConfig.url).href;

  return {
    title,
    description: project.summary,
    alternates: { canonical },
    openGraph: {
      title: shareTitle,
      description: project.summary,
      url: canonical,
      type: "website",
      locale: "pt_BR",
      siteName: siteConfig.name,
      images: [{ url: image, ...project.images.dimensions.desktop, alt: project.images.alt.desktop }],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description: project.summary,
      images: [image],
    },
  };
}

function CaseMedia({ project }: { project: CaseStudy }) {
  const { images, client, liveUrl } = project;
  const siteHost = liveUrl ? new URL(liveUrl).hostname : undefined;
  const desktop = { src: images.desktopAfter, alt: images.alt.desktop, ...images.dimensions.desktop };
  const mobile = images.mobileAfter && images.dimensions.mobile ? {
    src: images.mobileAfter,
    alt: images.alt.mobile ?? `Versão para celular do site de ${client}`,
    ...images.dimensions.mobile,
  } : undefined;

  if (!images.desktopBefore) {
    return (
      <div className={styles.media}>
        <div className="section">
          <DeviceMockup desktop={desktop} mobile={mobile} siteHost={siteHost} captions={images.caption} />
        </div>
      </div>
    );
  }

  return (
    <figure className={styles.media}>
      <BeforeAfter
        client={client}
        brand={siteConfig.name}
        siteHost={siteHost}
        desktop={{
          after: desktop,
          before: { ...desktop, src: images.desktopBefore, alt: `Site anterior de ${client} em um computador` },
        }}
        mobile={mobile && {
          after: mobile,
          before: images.mobileBefore ? {
            ...mobile,
            src: images.mobileBefore,
            alt: `Site anterior de ${client} em um celular`,
          } : undefined,
        }}
      />
      <figcaption className="section">
        <p className={styles.caption}>{images.caption.comparison ?? images.caption.desktop}</p>
      </figcaption>
    </figure>
  );
}

function CaseDetails({ project }: { project: CaseStudy }) {
  return (
    <div className={`section ${styles.details}`}>
      <section className={styles.detailRow} aria-labelledby="case-challenge">
        <h2 id="case-challenge">Desafio</h2>
        <p>{project.challenge}</p>
      </section>

      <section className={styles.detailRow} aria-labelledby="case-scope">
        <h2 id="case-scope">O que a Vercuno fez</h2>
        <div className={styles.deliverables}>
          <ul className={styles.list}>
            {project.scope.map((item) => <li key={item}>{item}</li>)}
          </ul>
          {project.features.length > 0 && (
            <div>
              <h3>Recursos do site</h3>
              <ul className={styles.list}>
                {project.features.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section className={styles.detailRow} aria-labelledby="case-technical">
        <h2 id="case-technical">Decisões técnicas</h2>
        <div>
          <ul className={styles.list}>
            {project.technicalNotes.map((note) => <li key={note}>{note}</li>)}
          </ul>
          {project.stack?.length ? <p className={styles.stack}>{project.stack.join(" · ")}</p> : null}
        </div>
      </section>

      <aside className={`${styles.detailRow} ${styles.evidence}`} aria-labelledby="case-evidence">
        <h2 id="case-evidence">Nota de evidência</h2>
        <p>{project.evidenceNote}</p>
      </aside>
    </div>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { project, previous, next } = await getCase(params);
  const type = caseTypes[project.projectType].singular;
  const whatsapp = buildWhatsappHref(
    `Olá! Vim pelo site da ${siteConfig.name} e vi o case ${project.client}. Gostaria de conversar sobre um projeto semelhante.`,
  );
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: `${project.client} · ${type}`,
    description: project.summary,
    genre: type,
    inLanguage: "pt-BR",
    url: new URL(`/portfolio/${project.slug}`, siteConfig.url).href,
    image: new URL(project.images.desktopAfter, siteConfig.url).href,
    creator: { "@type": "Organization", name: siteConfig.name, url: siteConfig.url },
  };

  return (
    <main id="conteudo" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <article aria-labelledby="project-title">
        <header className={`section ${styles.hero}`}>
          <Link className={styles.back} href="/portfolio">
            <ArrowLeft size={17} aria-hidden="true" /> Todos os cases
          </Link>
          <div className={styles.heroRow}>
            <div>
              <p className="section-label">{type} <span aria-hidden="true">·</span> <time dateTime={String(project.year)}>{project.year}</time></p>
              <h1 id="project-title">{project.client}</h1>
              <p className={styles.description}>{project.summary}</p>
            </div>
            {(project.liveUrl || project.repositoryUrl) && (
              <div className={styles.projectLinks}>
                {project.liveUrl && (
                  <a className="text-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    {project.projectType === "sistema-web" ? "Acessar sistema" : "Ver site no ar"}
                    <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                )}
                {project.repositoryUrl && (
                  <a className="text-link" href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    Ver no GitHub <ArrowUpRight size={17} aria-hidden="true" />
                  </a>
                )}
              </div>
            )}
          </div>
        </header>

        <CaseMedia project={project} />
        <CaseDetails project={project} />

        <div className={`section ${styles.end}`}>
          <section className={styles.contact} aria-labelledby="case-contact">
            <h2 id="case-contact">Vamos conversar sobre seu projeto?</h2>
            {whatsapp ? (
              <a className="primary-button" href={whatsapp} target="_blank" rel="noopener noreferrer">
                Falar no WhatsApp <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            ) : (
              <Link className="primary-button" href="/#contato">Falar com a equipe</Link>
            )}
          </section>

          {(previous || next) && (
            <nav className={styles.caseNavigation} aria-label="Navegação entre cases">
              {previous && (
                <Link className={styles.previous} href={`/portfolio/${previous.slug}`} prefetch={false}>
                  <span><ArrowLeft size={16} aria-hidden="true" /> Case anterior</span>
                  <strong>{previous.client}</strong>
                </Link>
              )}
              {next && (
                <Link className={styles.next} href={`/portfolio/${next.slug}`} prefetch={false}>
                  <span>Próximo case <ArrowRight size={16} aria-hidden="true" /></span>
                  <strong>{next.client}</strong>
                </Link>
              )}
            </nav>
          )}
        </div>
      </article>
    </main>
  );
}
