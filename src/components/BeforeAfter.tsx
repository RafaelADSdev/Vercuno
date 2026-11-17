"use client";

import Image from "next/image";
import { ChevronsLeftRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";

type ComparisonImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type BeforeAfterProps = {
  client: string;
  brand: string;
  siteHost?: string;
  desktop: { after: ComparisonImage; before: ComparisonImage };
  mobile?: { after: ComparisonImage; before?: ComparisonImage };
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 100);
const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const JUMP_DURATION = 260;

export function BeforeAfter({ client, brand, siteHost, desktop, mobile }: BeforeAfterProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [split, setSplit] = useState(50);
  const [touched, setTouched] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const splitRef = useRef(50);
  const dragging = useRef<HTMLElement | null>(null);
  const frame = useRef(0);
  const touchedRef = useRef(false);
  const destination = useRef(50);
  const hintAnimation = useRef<Animation | null>(null);

  const commit = useCallback((value: number) => {
    splitRef.current = value;
    setSplit(value);
  }, []);

  const cancelAnimation = useCallback(() => {
    if (frame.current) window.cancelAnimationFrame(frame.current);
    frame.current = 0;
  }, []);

  const markTouched = useCallback(() => {
    touchedRef.current = true;
    setTouched(true);
    cancelAnimation();
    hintAnimation.current?.cancel();
  }, [cancelAnimation]);

  // Desacelera até o destino; novos cliques partem da posição atual.
  const animate = useCallback(
    (keyframes: number[], duration: number) => {
      cancelAnimation();
      destination.current = keyframes[keyframes.length - 1];
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        commit(keyframes[keyframes.length - 1]);
        return;
      }
      const start = performance.now();
      const segments = keyframes.length - 1;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const position = progress * segments;
        const index = Math.min(Math.floor(position), segments - 1);
        const from = keyframes[index];
        const to = keyframes[index + 1];
        commit(from + (to - from) * ease(position - index));
        frame.current = progress < 1 ? window.requestAnimationFrame(tick) : 0;
      };
      frame.current = window.requestAnimationFrame(tick);
    },
    [cancelAnimation, commit],
  );

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stopMotion = () => {
      hintAnimation.current?.cancel();
      if (frame.current) {
        cancelAnimation();
        commit(destination.current);
      }
    };
    const onPreferenceChange = () => {
      if (preference.matches) stopMotion();
    };
    const observer = "IntersectionObserver" in window ? new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer?.disconnect();
        if (touchedRef.current || preference.matches || document.documentElement.dataset.motionInput === "keyboard") return;
        const icon = stage.querySelector<SVGElement>(".compare-handle svg");
        if (icon && typeof icon.animate === "function") {
          // A single directional hint introduces dragging without moving the comparison.
          hintAnimation.current = icon.animate(
            [{ transform: "translateX(0)" }, { transform: "translateX(3px)" },
              { transform: "translateX(-3px)" }, { transform: "translateX(0)" }],
            { duration: 640, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
          );
        }
      },
      { threshold: 0.2 },
    ) : null;
    observer?.observe(stage);
    preference.addEventListener("change", onPreferenceChange);
    window.addEventListener("keydown", stopMotion);

    return () => {
      observer?.disconnect();
      preference.removeEventListener("change", onPreferenceChange);
      window.removeEventListener("keydown", stopMotion);
      hintAnimation.current?.cancel();
      cancelAnimation();
    };
  }, [cancelAnimation, commit]);

  const jumpTo = (target: number, instant = false) => {
    markTouched();
    if (instant) {
      commit(target);
      return;
    }
    animate([splitRef.current, target], JUMP_DURATION);
  };

  const moveTo = (target: HTMLElement, clientX: number) => {
    const rect = target.getBoundingClientRect();
    if (rect.width > 0) commit(clamp(((clientX - rect.left) / rect.width) * 100));
  };

  const handlePointerDown = (event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0) return;
    markTouched();
    dragging.current = event.currentTarget;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.currentTarget, event.clientX);
  };

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (dragging.current !== event.currentTarget) return;
    moveTo(event.currentTarget, event.clientX);
  };

  const handlePointerEnd = () => {
    dragging.current = null;
    setIsDragging(false);
  };

  const pointerHandlers = {
    onPointerDown: handlePointerDown,
    onPointerMove: handlePointerMove,
    onPointerUp: handlePointerEnd,
    onPointerCancel: handlePointerEnd,
  };

  const rounded = Math.round(split);
  const stageClass = [
    "case-stage compare-stage section",
    touched && "is-touched",
    isDragging && "is-dragging",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={stageClass}
      ref={stageRef}
      style={{ "--split": `${split}%`, "--split-num": split } as CSSProperties}
    >
      <input
        className="compare-range"
        type="range"
        min={0}
        max={100}
        step={1}
        value={rounded}
        onChange={(event) => {
          markTouched();
          commit(Number(event.target.value));
        }}
        aria-label={`Comparar as versões do site de ${client}`}
        aria-valuetext={`${rounded}% site anterior, ${100 - rounded}% site novo`}
      />

      <div className="case-desktop">
        <div className="browser-bar dark" aria-hidden="true">
          <i />
          <i />
          <i />
          {siteHost && <span>{siteHost}</span>}
        </div>
        <div className="compare-view" {...pointerHandlers}>
          <Image
            {...desktop.after}
            alt={desktop.after.alt}
            loading="eager"
            fetchPriority="high"
            sizes="(max-width: 820px) 92vw, (max-width: 1560px) 76vw, 1176px"
          />
          <div className="compare-before">
            <Image
              {...desktop.before}
              alt={desktop.before.alt}
              loading="lazy"
              sizes="(max-width: 820px) 92vw, (max-width: 1560px) 76vw, 1176px"
            />
          </div>
          <span className="compare-tag is-before" aria-hidden="true">
            <i /> Site anterior
          </span>
          <span className="compare-tag is-after" aria-hidden="true">
            <i /> Entrega {brand}
          </span>
          <span className="compare-divider" aria-hidden="true" />
          <span className="compare-handle" aria-hidden="true">
            <ChevronsLeftRight size={18} strokeWidth={2.4} />
          </span>
        </div>
      </div>

      <div className="compare-ruler" aria-hidden="true">
        <span className="compare-ruler-marker" />
      </div>

      <div className="compare-controls">
        <div className="compare-toggle" role="group" aria-label="Alternar comparação">
          <button type="button" aria-pressed={split > 60} onClick={(event) => jumpTo(100, event.detail === 0)}>
            Ver antes
          </button>
          <button type="button" aria-pressed={split < 40} onClick={(event) => jumpTo(0, event.detail === 0)}>
            Ver depois
          </button>
        </div>
        <p className="compare-hint" aria-hidden="true">
          <ChevronsLeftRight size={14} /> ou arraste a divisória
        </p>
      </div>

      {mobile && (
        <div className="case-mobile">
          <div className="case-mobile-label">VERSÃO PARA CELULAR</div>
          <div className={mobile.before ? "compare-view" : undefined} {...(mobile.before ? pointerHandlers : {})}>
            <Image
              {...mobile.after}
              alt={mobile.after.alt}
              loading="lazy"
              sizes="(max-width: 820px) 24vw, (max-width: 1560px) 19vw, 302px"
            />
            {mobile.before && (
              <>
                <div className="compare-before">
                  <Image
                    {...mobile.before}
                    alt={mobile.before.alt}
                    loading="lazy"
                    sizes="(max-width: 820px) 24vw, (max-width: 1560px) 19vw, 302px"
                  />
                </div>
                <span className="compare-divider" aria-hidden="true" />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
