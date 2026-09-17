import { useEffect, useRef, useState } from 'react';

/**
 * Returns a 0→1 value representing how far the visitor has scrolled
 * through the first viewport height. Used to drive the hero scene's
 * camera pull-back and color drift as a "reacts to scroll" interaction.
 * rAF-throttled so it never fires more than once per frame.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const update = () => {
      const span = Math.max(window.innerHeight, 1);
      const value = Math.min(Math.max(window.scrollY / span, 0), 1);
      setProgress(value);
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}
