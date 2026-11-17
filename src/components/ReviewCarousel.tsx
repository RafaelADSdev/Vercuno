"use client";

import { ArrowLeft, ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import { useCallback, useId, useRef, useState, type KeyboardEvent } from "react";
import type { GoogleReview } from "@/data/reviews";
import styles from "./ReviewCarousel.module.css";

type ReviewCarouselProps = {
  reviews: readonly GoogleReview[];
  profileUrl?: string;
};

export function ReviewCarousel({ reviews, profileUrl }: ReviewCarouselProps) {
  const headingId = useId();
  const trackId = useId();
  const track = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [ready, setReady] = useState(false);
  const lastIndex = reviews.length - 1;
  const multiple = lastIndex > 0;

  const attachTrack = useCallback((viewport: HTMLUListElement | null) => {
    track.current = viewport;
    setReady(viewport !== null);
  }, []);

  if (reviews.length === 0) return null;

  function goTo(nextIndex: number) {
    if (nextIndex < 0 || nextIndex > lastIndex || !track.current) return;
    track.current.scrollTo({ left: nextIndex * track.current.clientWidth });
  }

  function updateIndex() {
    const viewport = track.current;
    if (!viewport?.clientWidth) return;

    const nearest = Math.round(viewport.scrollLeft / viewport.clientWidth);
    setIndex(Math.max(0, Math.min(lastIndex, nearest)));
  }

  function onTrackKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    if (event.target !== event.currentTarget) return;

    const targets: Readonly<Record<string, number>> = {
      ArrowLeft: index - 1,
      ArrowRight: index + 1,
      Home: 0,
      End: lastIndex,
    };
    const target = targets[event.key];
    if (target === undefined) return;

    event.preventDefault();
    goTo(target);
  }

  return (
    <section className={`section ${styles.section}`} id="depoimentos" aria-labelledby={headingId}>
      <div className={styles.heading}>
        <h2 id={headingId}>O que dizem nossos clientes</h2>
        {profileUrl && (
          <a className={styles.source} href={profileUrl} target="_blank" rel="noopener noreferrer">
            Avaliações no Google <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        )}
      </div>

      <div
        className={styles.carousel}
        role={multiple ? "group" : undefined}
        aria-roledescription={multiple ? "carrossel" : undefined}
        aria-label={multiple ? "Depoimentos de clientes" : undefined}
      >
        <ul
          ref={attachTrack}
          id={trackId}
          className={styles.track}
          aria-label="Trechos de avaliações do Google"
          tabIndex={multiple ? 0 : undefined}
          onScroll={multiple ? updateIndex : undefined}
          onKeyDown={multiple ? onTrackKeyDown : undefined}
        >
          {reviews.map(({ author, excerpt, url }) => (
            <li key={url} className={styles.slide}>
              <figure className={styles.review}>
                <Quote className={styles.quoteMark} size={32} aria-hidden="true" />
                <blockquote cite={url}>
                  <p>{excerpt}</p>
                </blockquote>
                <figcaption className={styles.credit}>
                  <span>{author}</span>
                  <a
                    className={styles.source}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Ler a avaliação de ${author} no Google`}
                  >
                    Ler no Google <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {ready && multiple && (
          <div className={styles.controls}>
            <button
              type="button"
              aria-label="Depoimento anterior"
              aria-controls={trackId}
              aria-disabled={index === 0}
              onClick={() => goTo(index - 1)}
            >
              <ArrowLeft size={18} aria-hidden="true" />
            </button>
            <p className={styles.position} role="status">
              <span className={styles.srOnly}>Depoimento </span>
              {index + 1} de {reviews.length}
            </p>
            <button
              type="button"
              aria-label="Próximo depoimento"
              aria-controls={trackId}
              aria-disabled={index === lastIndex}
              onClick={() => goTo(index + 1)}
            >
              <ArrowRight size={18} aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
