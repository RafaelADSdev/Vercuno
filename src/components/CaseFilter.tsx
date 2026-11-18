"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import type { CaseStudy } from "@/lib/cases";
import { isMotionReduced, motionPreferenceEvent, syncMotionPreference } from "@/lib/motion";
import styles from "./CaseFilter.module.css";

type ProjectType = CaseStudy["projectType"];
type Filter = "todos" | ProjectType;
type Props = {
  options: readonly { value: Filter; label: string }[];
  items: readonly { slug: string; type: ProjectType; card: ReactNode }[];
  emptyState: ReactNode;
};

const motionPreference = "(prefers-reduced-motion: reduce)";
const easeOut = "cubic-bezier(0.22, 1, 0.36, 1)";

function positionWithin(element: Element, container: DOMRect) {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { left: left - container.left, top: top - container.top, width, height };
}

function playMotion(
  running: Set<() => void>,
  element: Element,
  frames: Keyframe[],
  timing: KeyframeAnimationOptions,
  cleanup?: () => void,
) {
  const animation = element.animate(frames, timing);

  function finish() {
    if (running.delete(cancel)) cleanup?.();
  }

  function cancel() {
    animation.cancel();
    finish();
  }

  running.add(cancel);
  void animation.finished.then(finish, finish);
}

export function CaseFilter({ options, items, emptyState }: Props) {
  const [filter, setFilter] = useState<Filter>("todos");
  const results = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const reveal = useRef<IntersectionObserver | null>(null);
  const motion = useRef(new Set<() => void>());
  const count = items.filter(({ type }) => filter === "todos" || type === filter).length;

  function stopMotion() {
    motion.current.forEach((cancel) => cancel());
  }

  useEffect(() => {
    const preference = window.matchMedia(motionPreference);
    const running = motion.current;
    const onPreferenceChange = () => {
      if (syncMotionPreference()) stopMotion();
    };
    preference.addEventListener("change", onPreferenceChange);
    window.addEventListener(motionPreferenceEvent, onPreferenceChange);
    window.addEventListener("storage", onPreferenceChange);

    if (!isMotionReduced() && "IntersectionObserver" in window && typeof Element.prototype.animate === "function") {
      const observer = new IntersectionObserver((entries) => {
        if (reveal.current !== observer) return;

        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          if (document.documentElement.dataset.motionInput === "keyboard") continue;
          if (isMotionReduced() || entry.target.contains(document.activeElement)) continue;

          playMotion(running, entry.target,
            [{ opacity: .45, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }],
            { duration: 240, easing: easeOut },
          );
        }
      });
      reveal.current = observer;
      list.current?.querySelectorAll("li[data-case]").forEach((element) => observer.observe(element));
    }

    return () => {
      reveal.current?.disconnect();
      reveal.current = null;
      preference.removeEventListener("change", onPreferenceChange);
      window.removeEventListener(motionPreferenceEvent, onPreferenceChange);
      window.removeEventListener("storage", onPreferenceChange);
      stopMotion();
    };
  }, []);

  function changeFilter(next: Filter, animate: boolean) {
    if (next === filter) return;

    reveal.current?.disconnect();
    reveal.current = null;

    const container = results.current;
    const running = motion.current;
    if (!animate || !container?.animate || isMotionReduced()) {
      stopMotion();
      setFilter(next);
      return;
    }

    const elements = Array.from(container.querySelectorAll<HTMLElement>("[data-portfolio-result]"));
    const origin = container.getBoundingClientRect();
    const before = new Map(elements
      .filter((element) => element.getClientRects().length > 0)
      .map((element) => [element, {
        ...positionWithin(element, origin),
        opacity: Number(getComputedStyle(element).opacity),
      }]));

    // Sample the current frame before cancelling so rapid clicks can retarget the motion.
    stopMotion();
    flushSync(() => setFilter(next));

    const destination = container.getBoundingClientRect();
    const after = new Map(elements
      .filter((element) => !element.hidden)
      .map((element) => [element, positionWithin(element, destination)]));
    let entryOrder = 0;

    for (const element of elements) {
      const previous = before.get(element);
      const rect = after.get(element);

      if (!rect) {
        if (!previous) continue;

        // Keep the outgoing item at its old position while the grid reflows.
        element.classList.add(styles.leaving);
        Object.assign(element.style, {
          top: `${previous.top}px`,
          left: `${previous.left}px`,
          width: `${previous.width}px`,
          height: `${previous.height}px`,
        });
        playMotion(running, element,
          [{ opacity: previous.opacity, transform: "none" }, { opacity: 0, transform: "translateY(-4px)" }],
          { duration: 120, easing: "cubic-bezier(0.4, 0, 1, 1)" },
          () => {
            element.classList.remove(styles.leaving);
            element.style.removeProperty("top");
            element.style.removeProperty("left");
            element.style.removeProperty("width");
            element.style.removeProperty("height");
          },
        );
        continue;
      }

      const x = previous ? previous.left - rect.left : 0;
      const y = previous ? previous.top - rect.top : 0;
      // Use a short reveal when a project changes rows on narrow layouts.
      const movesWithinRow = previous && Math.abs(y) < 80;
      const opacity = movesWithinRow ? previous.opacity : .5;
      if (movesWithinRow && Math.abs(x) < 1 && Math.abs(y) < 1 && opacity >= .99) continue;

      const transform = movesWithinRow ? `translate(${x}px, ${y}px)` : "translateY(8px)";
      playMotion(running, element,
        [{ opacity, transform }, { opacity: 1, transform: "none" }],
        { duration: 240, delay: previous ? 0 : Math.min(entryOrder++ * 20, 40), easing: easeOut, fill: "backwards" },
      );
    }
  }

  return (
    <div onKeyDownCapture={stopMotion}>
      <div className={styles.toolbar}>
        <div role="group" aria-label="Filtrar por tipo de projeto" className={styles.filters}>
          {options.map(({ value, label }) => (
            <button type="button" key={value} aria-controls="portfolio-results" aria-pressed={filter === value}
              onClick={(event) => changeFilter(value, event.detail > 0)}>{label}</button>
          ))}
        </div>
        <p className={styles.count} aria-live="polite" aria-atomic="true">{count} {count === 1 ? "projeto" : "projetos"}</p>
      </div>

      <div ref={results} className={styles.results} id="portfolio-results">
        <ul ref={list} aria-hidden={count === 0 || undefined} className={styles.grid} role="list">
          {items.map(({ slug, type, card }) => {
            const hidden = filter !== "todos" && type !== filter;
            return <li data-case={slug} data-portfolio-result key={slug} hidden={hidden} inert={hidden}>{card}</li>;
          })}
        </ul>
        <div data-portfolio-result className={styles.empty} hidden={count !== 0} inert={count !== 0}>{emptyState}</div>
      </div>
    </div>
  );
}
