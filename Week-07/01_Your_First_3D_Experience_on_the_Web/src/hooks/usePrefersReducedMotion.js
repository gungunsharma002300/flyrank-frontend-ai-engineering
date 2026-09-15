import { useEffect, useState } from 'react';

/**
 * True when the OS/browser has "reduce motion" turned on, OR when the
 * device looks too weak to comfortably run a WebGL scene (very low core
 * count is the cheapest, most reliable signal we can read synchronously).
 * We use this to default to a static fallback card instead of forcing
 * the 3D scene on people who've opted out of motion or are on low-power
 * hardware — they can still choose to load it manually.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false;
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    const lowPower = (navigator.hardwareConcurrency ?? 8) <= 2;
    return Boolean(media?.matches) || lowPower;
  });

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!media) return;
    const listener = (e) => setReduced(e.matches || (navigator.hardwareConcurrency ?? 8) <= 2);
    media.addEventListener?.('change', listener);
    return () => media.removeEventListener?.('change', listener);
  }, []);

  return reduced;
}
