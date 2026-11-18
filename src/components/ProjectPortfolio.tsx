import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cases, caseTypes } from "@/lib/cases";
import { CaseCard } from "./CaseCard";
import styles from "./ProjectPortfolio.module.css";

export function ProjectPortfolio() {
  const groups = Object.entries(caseTypes)
    .map(([type, label]) => ({ type, label: label.plural, cases: cases.filter((study) => study.projectType === type) }))
    .filter((group) => group.cases.length > 0);

  return (
    <section className={styles.portfolio} id="portfolio" aria-labelledby="portfolio-title">
      <div className="section">
        <div className={styles.heading}>
          <h2 id="portfolio-title">Portfólio</h2>
          <Link className={`${styles.more} arrow-link`} href="/portfolio" prefetch={false}>Ver portfólio completo <ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
        <div className={styles.groups}>
          {groups.map((group) => (
            <section key={group.type} className={styles.group} data-wide={group.cases.length > 1 || undefined}
              data-category={group.type}
              aria-labelledby={`portfolio-${group.type}`}>
              <h3 className={styles.groupTitle} id={`portfolio-${group.type}`} data-motion-reveal>{group.label}</h3>
              <ul className={styles.projects} role="list">
                {group.cases.map((study) => (
                  <li key={study.slug} data-motion-reveal>
                    <CaseCard study={study} heading="h4" light sizes={group.type === "sistema-web"
                      ? "(max-width: 780px) 90vw, (max-width: 1520px) 45vw, 690px"
                      : "(max-width: 780px) 90vw, (max-width: 1520px) 29vw, 445px"} />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}
