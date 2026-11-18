"use client";

import { useEffect, useState } from "react";
import { motionPreferenceEvent, setMotionPreference, syncMotionPreference } from "@/lib/motion";

export function MotionToggle() {
  const [reduced, setReduced] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(syncMotionPreference());
    update();
    setReady(true);
    media.addEventListener("change", update);
    window.addEventListener(motionPreferenceEvent, update);
    window.addEventListener("storage", update);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener(motionPreferenceEvent, update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <button className="motion-toggle" type="button" role="switch" aria-label="Animações do site"
      aria-checked={!reduced} disabled={!ready}
      onClick={() => setMotionPreference(reduced ? "full" : "reduced")}>
      Animações {reduced ? "reduzidas" : "ativadas"}
    </button>
  );
}
