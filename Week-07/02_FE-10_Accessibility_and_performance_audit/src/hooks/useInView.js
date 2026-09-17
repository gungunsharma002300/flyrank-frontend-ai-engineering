import { useEffect, useRef, useState } from 'react';

/**
 * Lazily flips to `true` once the observed element enters the viewport,
 * then disconnects. Used so the (heavy) three.js canvas is never created
 * until it's actually about to be seen — keeps initial page load light.
 */
export function useInView(options = { rootMargin: '200px', threshold: 0 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // If IntersectionObserver isn't available for some reason, fail open.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      });
    }, options);

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}
