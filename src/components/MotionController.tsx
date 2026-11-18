"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isMotionReduced, motionPreferenceEvent, syncMotionPreference } from "@/lib/motion";

export function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    syncMotionPreference();
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const hero = document.querySelector<HTMLElement>(".hero");
    const contact = document.querySelector<HTMLElement>(".contact-section");
    const glow = contact?.querySelector<HTMLElement>(".contact-glow");
    const pointer = { x: 0, y: 0, clientX: 0, clientY: 0, active: false };
    const entrances = new Set<Animation>();
    let frame = 0;
    let lastFrame = 0;
    let lastScrollY = window.scrollY;
    let scrollingDown = true;

    // Avoid restarting the hero when hydrating an anchor or a restored scroll position.
    if (hero && window.scrollY < 24 && !window.location.hash && !isMotionReduced() && root.dataset.motionInput !== "keyboard") {
      root.classList.add("js");
    }

    const finishEntrances = () => {
      entrances.forEach((animation) => animation.cancel());
      entrances.clear();
    };

    const update = (now = performance.now()) => {
      frame = 0;
      const elapsed = Math.min(now - lastFrame || 16, 64);
      lastFrame = now;
      const scrollable = root.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
      root.style.setProperty("--page-progress", progress.toString());

      if (isMotionReduced() || !finePointer.matches || root.dataset.motionInput === "keyboard") {
        hero?.style.removeProperty("--hero-parallax");
        pointer.active = false;
        contact?.classList.remove("is-lit");
        return;
      }

      if (hero && window.innerWidth > 820 && window.scrollY <= hero.offsetHeight) {
        const travel = hero.offsetHeight;
        const progress = travel > 0 ? Math.min(Math.max(window.scrollY / travel, 0), 1) : 0;
        hero.style.setProperty("--hero-parallax", progress.toFixed(4));
      }

      if (contact && glow && pointer.active) {
        const rect = contact.getBoundingClientRect();
        const targetX = pointer.clientX - rect.left;
        const targetY = pointer.clientY - rect.top;
        const blend = 1 - Math.exp(-elapsed / 100);
        pointer.x += (targetX - pointer.x) * blend;
        pointer.y += (targetY - pointer.y) * blend;
        glow.style.transform = `translate3d(${pointer.x.toFixed(2)}px, ${pointer.y.toFixed(2)}px, 0) translate(-50%, -50%)`;
        if (Math.hypot(targetX - pointer.x, targetY - pointer.y) > .2) {
          frame = window.requestAnimationFrame(update);
        }
      }
    };

    const schedule = () => {
      if (!frame) {
        lastFrame = performance.now();
        frame = window.requestAnimationFrame(update);
      }
    };
    const onScroll = () => {
      const position = window.scrollY;
      if (position !== lastScrollY) scrollingDown = position > lastScrollY;
      lastScrollY = position;
      schedule();
    };

    const onKeyboard = () => {
      root.dataset.motionInput = "keyboard";
      root.classList.remove("js");
      hero?.style.removeProperty("--hero-parallax");
      finishEntrances();
      schedule();
    };
    const onPointer = () => {
      if (root.dataset.motionInput !== "pointer") root.dataset.motionInput = "pointer";
    };
    const onMouseMove = (event: PointerEvent) => {
      if (event.pointerType === "mouse" && (event.movementX || event.movementY)) onPointer();
    };
    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch" || isMotionReduced() || !finePointer.matches) return;
      onPointer();
      if (!pointer.active && contact) {
        const rect = contact.getBoundingClientRect();
        pointer.x = event.clientX - rect.left;
        pointer.y = event.clientY - rect.top;
      }
      pointer.clientX = event.clientX;
      pointer.clientY = event.clientY;
      pointer.active = true;
      contact?.classList.add("is-lit");
      schedule();
    };
    const handlePointerLeave = () => {
      pointer.active = false;
      contact?.classList.remove("is-lit");
    };
    const onPreferenceChange = () => {
      syncMotionPreference();
      if (isMotionReduced()) {
        root.classList.remove("js");
        finishEntrances();
      } else {
        targets.forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.top >= window.innerHeight || rect.bottom <= 0) observer?.observe(element);
        });
      }
      hero?.style.removeProperty("--hero-parallax");
      schedule();
    };

    // Content stays visible in CSS. Only elements initially below the fold are observed.
    const targets = Array.from(document.querySelectorAll<HTMLElement>(
      "[data-motion-reveal], #servicos header > *, #portfolio h2, .team-heading > *, .team-grid article, .contact-copy > *",
    )).filter((element) => element.getBoundingClientRect().top >= window.innerHeight);

    const observer = "IntersectionObserver" in window ? new IntersectionObserver((entries) => {
      let order = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting || !scrollingDown) continue;
        observer?.unobserve(entry.target);
        if (isMotionReduced() || root.dataset.motionInput === "keyboard") continue;
        const element = entry.target as HTMLElement;
        if (typeof element.animate !== "function") continue;
        const animation = element.animate(
          [{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 520, delay: Math.min(order++ * 55, 165), easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "backwards" },
        );
        entrances.add(animation);
        animation.onfinish = () => entrances.delete(animation);
        animation.oncancel = () => entrances.delete(animation);
      }
    }, { threshold: 0, rootMargin: "0px 0px 8px 0px" }) : null;
    targets.forEach((element) => observer?.observe(element));

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("keydown", onKeyboard, true);
    window.addEventListener("pointerdown", onPointer, true);
    window.addEventListener("pointermove", onMouseMove, { passive: true });
    window.addEventListener(motionPreferenceEvent, onPreferenceChange);
    window.addEventListener("storage", onPreferenceChange);
    reduceMotion.addEventListener("change", onPreferenceChange);
    finePointer.addEventListener("change", onPreferenceChange);
    contact?.addEventListener("pointermove", handlePointerMove, { passive: true });
    contact?.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      observer?.disconnect();
      finishEntrances();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("keydown", onKeyboard, true);
      window.removeEventListener("pointerdown", onPointer, true);
      window.removeEventListener("pointermove", onMouseMove);
      window.removeEventListener(motionPreferenceEvent, onPreferenceChange);
      window.removeEventListener("storage", onPreferenceChange);
      reduceMotion.removeEventListener("change", onPreferenceChange);
      finePointer.removeEventListener("change", onPreferenceChange);
      contact?.removeEventListener("pointermove", handlePointerMove);
      contact?.removeEventListener("pointerleave", handlePointerLeave);
      if (frame) window.cancelAnimationFrame(frame);
      root.classList.remove("js");
      root.style.removeProperty("--page-progress");
      root.style.removeProperty("--hero-parallax");
      hero?.style.removeProperty("--hero-parallax");
      contact?.classList.remove("is-lit");
      glow?.style.removeProperty("transform");
    };
  }, [pathname]);

  return null;
}
