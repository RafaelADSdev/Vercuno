"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { isMotionReduced, motionPreferenceEvent } from "@/lib/motion";

export function ScrollLink({ href, focusId, className, children }: {
  href: `#${string}`;
  focusId: string;
  className: string;
  children: ReactNode;
}) {
  const cancelScroll = useRef<(() => void) | null>(null);

  useEffect(() => () => cancelScroll.current?.(), [href]);

  function scrollToSection(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    cancelScroll.current?.();

    const startY = window.scrollY;
    const scrollPadding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
    const targetY = Math.max(0, startY + target.getBoundingClientRect().top - scrollPadding);
    const distance = targetY - startY;
    const finish = () => {
      window.scrollTo({ top: targetY, behavior: "instant" });
      if (window.location.hash !== href) window.history.pushState(window.history.state, "", href);
      document.getElementById(focusId)?.focus({ preventScroll: true });
    };

    if (isMotionReduced() || Math.abs(distance) < 1) {
      finish();
      return;
    }

    const duration = Math.min(1250, Math.max(700, Math.abs(distance) * .16));
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
      if (progress < 1) {
        const eased = progress * progress * (3 - 2 * progress);
        window.scrollTo({ top: startY + distance * eased, behavior: "instant" });
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

  return <a className={className} href={href} onClick={scrollToSection}>{children}</a>;
}
