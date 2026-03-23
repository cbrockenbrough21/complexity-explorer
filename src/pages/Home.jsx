import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { CanvasRenderer } from "../renderer/CanvasRenderer.js";
import { SYSTEM_ORDER, SYSTEMS } from "../data/systems.js";
import { systemContent } from "../data/systemContent.js";
import styles from "./Home.module.css";

const HERO_SYSTEM = SYSTEMS.reactionDiffusion;

export default function Home() {
  const cards = useMemo(() => {
    return SYSTEM_ORDER.map((id) => ({
      id,
      label: SYSTEMS[id].label,
      ...systemContent[id]
    }));
  }, []);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <HeroBackground />
        <div className={styles.heroOverlay} />

        <div className={styles.heroInner}>
          <p className={styles.kicker}>Complexity Explorer</p>
          <h1 className={styles.heroTitle}>More is different.</h1>
          <p className={styles.heroBody}>
            Local decisions, repeated endlessly, can bloom into worlds no single agent imagined.
            This is a studio for watching that bloom happen in real time.
          </p>
          <Link to="/explore" className={styles.heroCta}>Enter the live explorer</Link>
        </div>
      </section>

      <section className={styles.cardsSection}>
        <h2 className={styles.sectionTitle}>Four Ways Emergence Appears</h2>
        <div className={styles.cardsGrid}>
          {cards.map((card) => (
            <article key={card.id} className={styles.card}>
              <p className={styles.cardEyebrow}>{card.label}</p>
              <h3 className={styles.cardTitle}>{card.tagline}</h3>
              <p className={styles.cardBody}>{card.forEveryone}</p>
              <Link to={`/systems/${card.id}`} className={styles.cardLink}>
                Open system page
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

function HeroBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const system = new HERO_SYSTEM.classRef(HERO_SYSTEM.defaultConfig);
    const renderer = new CanvasRenderer(canvas, system);

    const resize = () => {
      // Match internal drawing buffer to actual CSS-rendered canvas size.
      const viewportWidth = Math.max(canvas.clientWidth || window.innerWidth, 1);
      const viewportHeight = Math.max(canvas.clientHeight || canvas.getBoundingClientRect().height, 1);
      canvas.width = Math.floor(viewportWidth);
      canvas.height = Math.floor(viewportHeight);
    };

    resize();
    window.addEventListener("resize", resize);

    let rafId = 0;
    const animate = () => {
      system.step();
      renderer.render();
      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      renderer.destroy();
      system.destroy();
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.heroCanvas} aria-hidden="true" />;
}
