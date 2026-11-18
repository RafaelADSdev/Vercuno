import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { buildWhatsappHref, differentiators, services } from "@/data/site";
import styles from "./ServicePackages.module.css";

export function ServicePackages() {
  return (
    <section className={`section ${styles.packages}`} id="servicos" aria-labelledby="services-title">
      <header className={styles.intro}>
        <h2 id="services-title">O que desenvolvemos</h2>
        <p>Escolha o tipo de projeto. A gente combina escopo, prazo e valor pelo WhatsApp.</p>
      </header>

      <ul className={styles.list} role="list">
        {services.map((service) => {
          const href = buildWhatsappHref(service.whatsappMessage);
          const details = `/servicos/${service.slug}`;

          return (
            <li className={styles.row} key={service.slug}>
              <div className={styles.summary}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
              <ul className={styles.deliverables} role="list" aria-label={`Escopo de ${service.title.toLowerCase()}`}>
                {service.deliverables.map((item) => (
                  <li key={item}><Check size={15} aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <div className={styles.actions}>
                {href && (
                  <a className="service-cta" href={href} target="_blank" rel="noreferrer"
                    aria-label={`Pedir orçamento de ${service.title.toLowerCase()} pelo WhatsApp`}>
                    Pedir orçamento <ArrowUpRight size={16} aria-hidden="true" />
                  </a>
                )}
                <Link href={details} className={styles.details} aria-label={`Ver detalhes de ${service.title.toLowerCase()}`}>
                  Ver detalhes <ArrowRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </li>
          );
        })}
      </ul>

      <ul className={styles.differentiators} role="list" aria-label="Diferenciais da Vercuno">
        {differentiators.map(({ title, description }) => (
          <li key={title}>
            <strong>{title}</strong>
            <span>{description}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
