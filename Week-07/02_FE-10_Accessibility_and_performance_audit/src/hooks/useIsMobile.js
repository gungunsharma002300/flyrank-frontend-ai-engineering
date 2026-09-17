import { useEffect, useState } from 'react';

/**
 * True on small / touch-primary viewports. Used to cut GPU and
 * main-thread work (postprocessing, particle count, pixel ratio) on
 * phones, where Lighthouse's mobile CPU throttling is unforgiving of
 * heavy per-frame shader passes.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia?.('(max-width: 768px), (pointer: coarse)').matches ?? false;
  });

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px), (pointer: coarse)');
    const listener = (e) => setIsMobile(e.matches);
    media.addEventListener?.('change', listener);
    return () => media.removeEventListener?.('change', listener);
  }, []);

  return isMobile;
}
