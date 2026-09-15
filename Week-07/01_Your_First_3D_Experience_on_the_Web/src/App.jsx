import { lazy, Suspense, useCallback, useState } from 'react';
import './App.css';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';
import { useScrollProgress } from './hooks/useScrollProgress';
import { useInView } from './hooks/useInView';
import { THEMES } from './components/themes';
import StaticFallback from './components/StaticFallback';

// The entire three.js / R3F / postprocessing stack lives in its own
// chunk, code-split via React.lazy — the first script the browser
// downloads never touches three.js.
const HeroScene = lazy(() => import('./components/HeroScene'));

export default function App() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [forceEnable3D, setForceEnable3D] = useState(false);
  const [themeIndex, setThemeIndex] = useState(0);
  const scrollProgress = useScrollProgress();
  const [featuresRef, featuresInView] = useInView({ rootMargin: '-80px', threshold: 0.1 });

  const theme = THEMES[themeIndex];
  const shouldRender3D = !prefersReducedMotion || forceEnable3D;

  const handleAdvanceTheme = useCallback(() => {
    setThemeIndex((i) => (i + 1) % THEMES.length);
  }, []);

  return (
    <div className="app" style={{ '--theme-bg': theme.bg }}>
      <header className="topbar">
        <div className="topbar__brand">
          <span className="topbar__logo" aria-hidden="true">◆</span>
          <span>FlyRank AI Internship</span>
        </div>
        <div className="topbar__right">
          <span className="topbar__badge">FE-AA2 · Week 7</span>
          <div className="topbar__author">
            <span className="topbar__author-avatar" aria-hidden="true">GS</span>
            <span className="topbar__author-text">
              <strong>Gungun Sharma</strong>
              <em>BCA · AI Engineering Intern</em>
            </span>
          </div>
        </div>
      </header>

      <main>
        <section className="hero-stage">
          <div className="hero-stage__canvas" aria-hidden={prefersReducedMotion && !forceEnable3D}>
            {prefersReducedMotion && !forceEnable3D && (
              <StaticFallback onEnable={() => setForceEnable3D(true)} />
            )}
            {shouldRender3D && (
              <Suspense fallback={<div className="hero-stage__placeholder" />}>
                <HeroScene theme={theme} scrollProgress={scrollProgress} onAdvanceTheme={handleAdvanceTheme} />
              </Suspense>
            )}
          </div>

          <div className="hero-stage__content">
            <p className="eyebrow">Frontend AI Engineering · Assignment FE-AA2</p>
            <h1>
              Your First
              <br />
              3D Experience
              <br />
              on the Web
            </h1>
            <p className="hero__lede">
              A living, animated 3D hero scene built with React Three Fiber — it follows your
              cursor, reacts as you scroll, and changes mood when you click the core.
            </p>

            <div className="hero__cta-row">
              <span className="hero__cta-hint">
                <span className="hero__cta-dot" style={{ background: theme.glow }} />
                Currently in <strong>{theme.name}</strong> mode — click the shape to change it
              </span>
            </div>

            <div className="hero__badges">
              <span className="badge">React Three Fiber</span>
              <span className="badge">Pointer parallax</span>
              <span className="badge">Scroll-reactive</span>
              <span className="badge">Click interaction</span>
              <span className="badge">Reduced-motion aware</span>
            </div>
          </div>

          <div className="hero-stage__scroll-cue" aria-hidden="true">
            <span />
            scroll
          </div>
        </section>

        <section className="guide">
          <div className="guide__grid">
            <div className="guide__card">
              <span className="guide__icon">◐</span>
              <h3>Move your cursor</h3>
              <p>The whole scene tilts toward your pointer (or your finger, on touch devices).</p>
            </div>
            <div className="guide__card">
              <span className="guide__icon">◈</span>
              <h3>Click the core</h3>
              <p>Cycles through four curated color moods — Nebula, Aurora, Ember and Rosé.</p>
            </div>
            <div className="guide__card">
              <span className="guide__icon">◇</span>
              <h3>Scroll down</h3>
              <p>The camera pulls back and the core's surface distortion intensifies.</p>
            </div>
          </div>
        </section>

        <section className={`notes ${featuresInView ? 'notes--visible' : ''}`} ref={featuresRef}>
          <div className="notes__card">
            <h2>What's happening here</h2>
            <ul>
              <li>The R3F / postprocessing bundle is code-split and lazy-loaded on its own.</li>
              <li>The core shape is procedural geometry — zero asset fetch, zero decode cost.</li>
              <li>Pixel ratio is capped at 1.5x and bloom runs without multisampling for headroom.</li>
              <li>Reduced-motion / low-core devices get a static card with an opt-in toggle.</li>
              <li>Every interaction — parallax, click, scroll — works the same with touch.</li>
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Built for FlyRank AI Internship — FE-AA2</span>
        <span className="footer__dot" aria-hidden="true">·</span>
        <span>
          Designed &amp; developed by <strong>Gungun Sharma</strong>, BCA — AI Engineering Intern
        </span>
      </footer>
    </div>
  );
}
