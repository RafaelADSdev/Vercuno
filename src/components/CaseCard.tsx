import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { caseTypes, type CaseStudy } from "@/lib/cases";
import { AssetImage } from "./AssetImage";
import styles from "./CaseCard.module.css";

type Props = { study: CaseStudy; heading?: "h3" | "h4"; light?: boolean; sizes: string };

export function CaseCard({ study, heading: Heading = "h3", light = false, sizes }: Props) {
  const { alt, desktopAfter, dimensions, desktopPreviewWidths } = study.images;

  return (
    <Link className={styles.card} data-light={light || undefined} href={`/portfolio/${study.slug}`} prefetch={false}>
      <figure className={styles.figure}>
        <div className={styles.preview}>
          <AssetImage src={desktopAfter} alt={alt.desktop} {...dimensions.desktop} sizes={sizes} webpWidths={desktopPreviewWidths} />
        </div>
        <figcaption className={styles.copy}>
          <span className={styles.meta}>{caseTypes[study.projectType].singular} · {study.sector} · {study.year}</span>
          <Heading>{study.client} <ArrowUpRight size={19} aria-hidden="true" /></Heading>
          <p>{study.summary}</p>
          <ul className={styles.tags} role="list" aria-label="Escopo do projeto">
            {study.scope.slice(0, 2).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </figcaption>
      </figure>
    </Link>
  );
}
