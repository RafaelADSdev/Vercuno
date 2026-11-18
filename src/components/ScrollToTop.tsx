"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { isMotionReduced, motionPreferenceEvent } from "@/lib/motion";

export function ScrollToTop({ href }: { href: "#top" | "#conteudo" }) {
  const cancelScroll = useRef<(() => void) | null>(null);

  useEffect(() => () => cancelScroll.current?.(), [href]);

  function scrollToTop(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    cancelScroll.current?.();

    const finish = () => {
      window.scrollTo({ top: 0, behavior: "instant" });
      if (window.location.hash !== href) window.history.pushState(window.history.state, "", href);
      document.getElementById("conteudo")?.focus({ preventScroll: true });
    };

    const startY = window.scrollY;
    if (isMotionReduced() || startY < 1) {
      finish();
      return;
    }

    const duration = Math.min(1250, Math.max(700, startY * .16));
    const startedAt = performance.now();
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const cancel = () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("wheel", cancel, true);
      window.removeEventListener("touchstart", cancel, true);
      window.removeEventListener("pointerdown", cancel, true);
      window.removeEventListener("keydown", cancel, true);
      window.removeEventListener("popstate", cancel);
      window.removeEventListener(motionPreferenceEvent, onPreferenceChange);
      window.removeEventListener("storage", onPreferenceChange);
      preference.removeEventListener("change", onPreferenceChange);
      cancelScroll.current = null;
    };

    const onPreferenceChange = () => {
      if (isMotionReduced()) {
        cancel();
        finish();
      }
    };

    const step = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      window.scrollTo({ top: startY * (1 - eased), behavior: "instant" });
      if (progress < 1) {
        frame = window.requestAnimationFrame(step);
      } else {
        cancel();
        finish();
      }
    };

    cancelScroll.current = cancel;
    window.addEventListener("wheel", cancel, { passive: true, capture: true });
    window.addEventListener("touchstart", cancel, { passive: true, capture: true });
    window.addEventListener("pointerdown", cancel, { passive: true, capture: true });
    window.addEventListener("keydown", cancel, true);
    window.addEventListener("popstate", cancel);
    window.addEventListener(motionPreferenceEvent, onPreferenceChange);
    window.addEventListener("storage", onPreferenceChange);
    preference.addEventListener("change", onPreferenceChange);
    frame = window.requestAnimationFrame(step);
  }

  return <a className="arrow-link" href={href} onClick={scrollToTop}>Voltar ao topo <ArrowUpRight size={15} aria-hidden="true" /></a>;
}
