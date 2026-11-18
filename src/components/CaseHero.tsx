import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { caseTypes, type CaseStudy } from "@/lib/cases";
import styles from "./CaseHero.module.css";

export function CaseHero({ study }: { study: CaseStudy }) {
  const { desktopAfter, dimensions, alt, caption } = study.images;

  return (
    <section className={styles.feature} aria-labelledby="featured-case">
      <div className={styles.copy}>
        <p className="section-label">Projeto em destaque</p>
        <h2 id="featured-case">{study.client}</h2>
        <p className={styles.category}>{caseTypes[study.projectType].singular} · {study.sector} · {study.year}</p>
        <p className={styles.summary}>{study.summary}</p>
        <ul className={styles.tags} role="list" aria-label="Escopo do projeto">
          {study.scope.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className={styles.actions}>
          <Link className="primary-button" href={`/portfolio/${study.slug}`} prefetch={false}>
            Ver projeto completo <ArrowRight size={17} aria-hidden="true" />
          </Link>
          {study.liveUrl && (
            <a className="text-link" href={study.liveUrl} target="_blank" rel="noopener noreferrer">
              Ver site <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
      <figure className={styles.capture}>
        <div className={styles.frame}>
          <div className="browser-bar" aria-hidden="true"><i /><i /><i /></div>
          <Image src={desktopAfter} alt={alt.desktop} {...dimensions.desktop}
            sizes="(max-width: 760px) 90vw, (max-width: 1520px) 55vw, 850px" fetchPriority="high" loading="eager" />
        </div>
        <figcaption>{caption.desktop}</figcaption>
      </figure>
    </section>
  );
}
