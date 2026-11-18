export const motionPreferenceEvent = "vercuno:motion-preference";

const storageKey = "vercuno:motion";
type MotionPreference = "full" | "reduced";
let transientPreference: MotionPreference | undefined;

function readPreference() {
  if (transientPreference) return transientPreference;
  try {
    const saved = window.localStorage.getItem(storageKey);
    return saved === "full" || saved === "reduced" ? saved : undefined;
  } catch {
    return transientPreference;
  }
}

export function isMotionReduced() {
  if (typeof window === "undefined") return true;
  const setting = document.documentElement.dataset.motion;
  if (setting === "full" || setting === "reduced") return setting === "reduced";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function syncMotionPreference() {
  if (typeof window === "undefined") return true;
  const preference = readPreference();
  const reduced = preference === "reduced" ||
    (preference !== "full" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  document.documentElement.dataset.motion = reduced ? "reduced" : "full";
  return reduced;
}

export function setMotionPreference(preference: MotionPreference) {
  try {
    window.localStorage.setItem(storageKey, preference);
    transientPreference = undefined;
  } catch {
    // The choice remains available for this visit when browser storage is blocked.
    transientPreference = preference;
  }
  document.documentElement.dataset.motion = preference;
  window.dispatchEvent(new Event(motionPreferenceEvent));
}
